"use client";

import { Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type ContactState = "idle" | "submitting" | "success" | "error";

type ContactFormData = {
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  message: string;
};

const initialData: ContactFormData = {
  email: "",
  phone: "",
  budget: "",
  timeline: "",
  message: ""
};

const budgetOptions = ["Under $3k", "$3k - $8k", "$8k - $15k", "$15k+", "Not sure"];
const timelineOptions = ["ASAP", "2 - 4 weeks", "1 - 2 months", "Flexible"];

export default function ContactForm() {
  const [data, setData] = useState<ContactFormData>(initialData);
  const [state, setState] = useState<ContactState>("idle");
  const [feedback, setFeedback] = useState("");

  const isSubmitting = state === "submitting";

  const buttonLabel = useMemo(() => {
    if (isSubmitting) return "Sending...";
    if (state === "success") return "Sent";
    return "Send Message";
  }, [isSubmitting, state]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("submitting");
    setFeedback("");
    trackEvent("contact_form_submit_attempt", {
      budget: data.budget || "unspecified",
      timeline: data.timeline || "unspecified",
      has_phone: Boolean(data.phone.trim())
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const payload = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Unable to send the message right now.");
      }

      setState("success");
      setFeedback("Your message was sent successfully. I will reply soon.");
      trackEvent("contact_form_submit", {
        status: "success",
        budget: data.budget || "unspecified",
        timeline: data.timeline || "unspecified"
      });
      setData(initialData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong while sending.";
      setState("error");
      setFeedback(message);
      trackEvent("contact_form_submit", {
        status: "error",
        budget: data.budget || "unspecified",
        timeline: data.timeline || "unspecified"
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={data.email}
          onChange={(event) =>
            setData((previous) => ({ ...previous, email: event.target.value }))
          }
          placeholder="you@example.com"
          className="h-11 w-full rounded-xl border border-slate-300 bg-white/85 px-3 text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
          Phone Number (optional)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(event) =>
            setData((previous) => ({ ...previous, phone: event.target.value }))
          }
          placeholder="+91 9876543210"
          className="h-11 w-full rounded-xl border border-slate-300 bg-white/85 px-3 text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Project Budget (optional)</p>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((option) => {
            const isSelected = data.budget === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setData((previous) => ({ ...previous, budget: option }))}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "border-teal-600 bg-teal-50 text-teal-700"
                    : "border-slate-300 bg-white/80 text-slate-600 hover:border-teal-400/60 hover:text-slate-900"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Timeline (optional)</p>
        <div className="flex flex-wrap gap-2">
          {timelineOptions.map((option) => {
            const isSelected = data.timeline === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setData((previous) => ({ ...previous, timeline: option }))}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-slate-300 bg-white/80 text-slate-600 hover:border-orange-400/60 hover:text-slate-900"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-slate-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={data.message}
          onChange={(event) =>
            setData((previous) => ({ ...previous, message: event.target.value }))
          }
          placeholder="Tell me about your project, timeline, and goals."
          className="w-full rounded-xl border border-slate-300 bg-white/85 px-3 py-2 text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="button-primary h-11 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {buttonLabel}
        <Send size={14} />
      </button>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`min-h-[1.25rem] text-sm ${
          feedback
            ? state === "success"
              ? "text-emerald-600"
              : "text-rose-600"
            : "text-transparent"
        }`}
      >
        {feedback || " "}
      </p>
    </form>
  );
}
