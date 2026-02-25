"use client";

import { Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type ContactState = "idle" | "submitting" | "success" | "error";

type ContactFormData = {
  email: string;
  phone: string;
  message: string;
};

const initialData: ContactFormData = {
  email: "",
  phone: "",
  message: ""
};

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
      setData(initialData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong while sending.";
      setState("error");
      setFeedback(message);
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
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={data.phone}
          onChange={(event) =>
            setData((previous) => ({ ...previous, phone: event.target.value }))
          }
          placeholder="+91 9876543210"
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
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
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {buttonLabel}
        <Send size={14} />
      </button>

      {feedback ? (
        <p
          className={`text-sm ${
            state === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
