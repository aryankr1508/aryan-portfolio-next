/**
 * Google Apps Script relay for portfolio contact form submissions.
 *
 * Required Script Properties:
 * - CONTACT_WEBHOOK_SECRET: Shared secret set in Next.js env.
 *
 * Optional Script Properties:
 * - CONTACT_TO_EMAIL: Fallback recipient if payload has no toEmail value.
 */
function doPost(e) {
  try {
    var payload = parseBody(e);
    var expectedSecret = getScriptProperty("CONTACT_WEBHOOK_SECRET");

    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse({
        success: false,
        error: "Unauthorized request."
      });
    }

    var toEmail = sanitize(payload.toEmail, 320) || getScriptProperty("CONTACT_TO_EMAIL");
    var email = sanitize(payload.email, 320);
    var phone = sanitize(payload.phone, 64) || "Not provided";
    var budget = sanitize(payload.budget, 100) || "Not provided";
    var timeline = sanitize(payload.timeline, 100) || "Not provided";
    var message = sanitize(payload.message, 3000);
    var submittedAt = sanitize(payload.submittedAt, 64) || new Date().toISOString();

    if (!toEmail || !isValidEmail(toEmail)) {
      return jsonResponse({
        success: false,
        error: "Recipient email is not configured correctly."
      });
    }

    if (!isValidEmail(email)) {
      return jsonResponse({
        success: false,
        error: "Invalid sender email."
      });
    }

    if (message.length < 10) {
      return jsonResponse({
        success: false,
        error: "Message should be at least 10 characters."
      });
    }

    var subject = "Portfolio inquiry from " + email;
    var textBody = [
      "New portfolio inquiry",
      "",
      "Email: " + email,
      "Phone: " + phone,
      "Budget: " + budget,
      "Timeline: " + timeline,
      "Submitted At: " + submittedAt,
      "",
      "Message:",
      message
    ].join("\n");

    var htmlBody =
      "<h2>New portfolio inquiry</h2>" +
      "<p><strong>Email:</strong> " + escapeHtml(email) + "</p>" +
      "<p><strong>Phone:</strong> " + escapeHtml(phone) + "</p>" +
      "<p><strong>Budget:</strong> " + escapeHtml(budget) + "</p>" +
      "<p><strong>Timeline:</strong> " + escapeHtml(timeline) + "</p>" +
      "<p><strong>Submitted At:</strong> " + escapeHtml(submittedAt) + "</p>" +
      "<p><strong>Message:</strong></p>" +
      "<p>" + escapeHtml(message).replace(/\n/g, "<br/>") + "</p>";

    MailApp.sendEmail({
      to: toEmail,
      replyTo: email,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody,
      name: "Portfolio Contact"
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error && error.message ? error.message : "Unexpected script error."
    });
  }
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error("Invalid JSON payload.");
  }
}

function getScriptProperty(key) {
  return (PropertiesService.getScriptProperties().getProperty(key) || "").trim();
}

function sanitize(value, maxLength) {
  var text = String(value || "").trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
