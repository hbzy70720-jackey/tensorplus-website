"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/button";
import { useDict } from "@/lib/i18n";

export default function ContactForm() {
  const t = useDict();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    // Client-side validation
    if (!data.name.trim()) {
      setError(t.contactForm.requiredName);
      setLoading(false);
      return;
    }
    if (!data.company.trim()) {
      setError(t.contactForm.requiredCompany);
      setLoading(false);
      return;
    }
    if (!data.phone.trim()) {
      setError(t.contactForm.requiredPhone);
      setLoading(false);
      return;
    }
    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError(t.contactForm.invalidEmail);
      setLoading(false);
      return;
    }
    if (data.message.trim().length < 10) {
      setError(t.contactForm.messageTooShort);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        form.reset();
      } else {
        setError(result.error || t.contactForm.submitFailed);
      }
    } catch {
      setError(t.contactForm.networkError);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800">{t.contactForm.success}</h3>
        <p className="mt-2 text-green-600">{t.contactForm.successDesc}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-[var(--text-dark)]"
        >
          {t.contactForm.name} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t.contactForm.namePlaceholder}
        />
      </div>

      <div>
        <label
          htmlFor="company"
          className="mb-2 block text-sm font-medium text-[var(--text-dark)]"
        >
          {t.contactForm.company} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t.contactForm.companyPlaceholder}
        />
      </div>

      {/* 电话 */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-[var(--text-dark)]"
        >
          {t.contactForm.phone} <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t.contactForm.phonePlaceholder}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-[var(--text-dark)]"
        >
          {t.contactForm.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t.contactForm.emailPlaceholder}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-[var(--text-dark)]"
        >
          {t.contactForm.message} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={t.contactForm.messagePlaceholder}
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t.contactForm.submit}
      </Button>
    </form>
  );
}
