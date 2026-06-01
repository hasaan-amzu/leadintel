"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { TIERS, type PricingTier } from "@/lib/pricing";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
            step >= 1
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          1
        </span>
        <span
          className={`text-sm font-medium ${
            step >= 1 ? "text-gray-900" : "text-gray-400"
          }`}
        >
          Upload & Select
        </span>
      </div>
      <div
        className={`h-px w-10 ${step >= 2 ? "bg-primary-600" : "bg-gray-300"}`}
      />
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
            step >= 2
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          2
        </span>
        <span
          className={`text-sm ${
            step >= 2 ? "font-medium text-gray-900" : "text-gray-400"
          }`}
        >
          Payment
        </span>
      </div>
    </div>
  );
}

interface PaymentFormProps {
  file: File;
  tier: PricingTier;
  fileRowCount: number | null;
  onBack: () => void;
}

function PaymentForm({ file, tier, fileRowCount, onBack }: PaymentFormProps) {
  const actualLeads = fileRowCount !== null ? Math.min(fileRowCount, tier.leads) : tier.leads;
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // 1. Create PaymentIntent on our API route
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: tier.leads,
          price: tier.price,
          email,
          name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create payment");
      }

      const { clientSecret } = await res.json();

      // 2. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name, email },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent?.status === "succeeded") {
        // 3. Upload CSV and trigger pipeline
        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", email);
        formData.append("name", name);
        formData.append("leads", String(tier.leads));
        formData.append("payment_intent_id", paymentIntent.id);

        const pipelineRes = await fetch("/api/start-research", {
          method: "POST",
          body: formData,
        });

        if (!pipelineRes.ok) {
          // Payment succeeded but pipeline failed — we'll still show success
          // and handle retry on backend
          console.error("Pipeline start failed, payment already captured");
        }

        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="mt-2 text-gray-600">
          We&apos;re researching your {actualLeads} leads now.
        </p>
        <p className="mt-1 text-gray-600">
          Your Excel report will be sent to <strong>{email}</strong> within 1 hour.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          ← Back
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Researching {tier.leads} leads — ${tier.price.toFixed(2)}
      </p>

      {/* Name */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
        />
      </div>

      {/* Email */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@company.com"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-400">
          Your research report will be delivered here
        </p>
      </div>

      {/* Stripe Card Element */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="mt-1 rounded-md border border-gray-300 px-3 py-3 shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#111827",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Lead research ({tier.leads} leads)
          </span>
          <span className="text-sm font-medium text-gray-900">
            ${tier.price.toFixed(2)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            ${tier.price.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-6 w-full rounded-md bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay $${tier.price.toFixed(2)}`}
      </button>

      <p className="mt-4 text-center text-xs text-gray-400">
        Secured by Stripe. We never see your card details.
      </p>
    </form>
  );
}

export default function OrderPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileRowCount, setFileRowCount] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [tier, setTier] = useState<PricingTier>(TIERS[0]);
  const [error, setError] = useState("");

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext || "")) {
      setError("Please upload a CSV or Excel file.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }
    setError("");

    // Count CSV rows client-side for validation and user feedback
    if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const lines = text.split("\n").filter((l) => l.trim().length > 0);
          const rowCount = Math.max(0, lines.length - 1); // subtract header

          if (rowCount > 500) {
            setError(`Your file has ${rowCount.toLocaleString()} leads — we support up to 500 per file. Please split your file into smaller batches.`);
            setFileRowCount(null);
            return;
          }
          if (rowCount === 0) {
            setError("Your file appears to be empty. Please upload a file with at least one lead.");
            setFileRowCount(null);
            return;
          }

          setFileRowCount(rowCount);
          setFile(f);
        }
      };
      reader.readAsText(f);
    } else {
      setFileRowCount(null);
      setFile(f);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  function handleContinue() {
    if (!file) {
      setError("Please upload a CSV file first.");
      return;
    }
    if (fileRowCount !== null && fileRowCount === 0) {
      setError("Your file has no valid leads. Please check the file and try again.");
      return;
    }
    setError("");
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            Lead<span className="text-primary-600">Intel</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-6 py-12">
        <StepIndicator step={step} />

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              Get Your Lead Research
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Upload your CSV and choose how many leads to research.
            </p>

            {/* Upload zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`mt-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
                dragOver
                  ? "border-primary-400 bg-primary-50"
                  : file
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              {file ? (
                <>
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                    {fileRowCount !== null && ` · ${fileRowCount} rows`}
                  </p>
                  <button
                    onClick={() => { setFile(null); setFileRowCount(null); }}
                    className="mt-2 text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop your CSV here, or{" "}
                    <label className="cursor-pointer font-medium text-primary-600 hover:text-primary-700">
                      browse
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    CSV or Excel with columns: name, company, linkedin
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">Max 5 MB</p>
                </>
              )}
            </div>

            {/* Tier selector */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">
                How many leads to research?
              </label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {TIERS.map((t) => (
                  <button
                    key={t.leads}
                    onClick={() => setTier(t)}
                    className={`rounded-lg border-2 px-4 py-4 text-center transition-colors ${
                      tier.leads === t.leads
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className="block text-2xl font-bold text-gray-900">
                      {t.leads}
                    </span>
                    <span className="block text-xs text-gray-500">leads</span>
                    <span
                      className={`mt-2 block text-lg font-semibold ${
                        tier.leads === t.leads
                          ? "text-primary-600"
                          : "text-gray-700"
                      }`}
                    >
                      ${t.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
              {fileRowCount !== null && fileRowCount > tier.leads ? (
                <p className="mt-2 text-xs text-amber-600">
                  Your file has {fileRowCount} leads but you selected {tier.leads}.
                  We&apos;ll research the first {tier.leads} — or select a larger tier above.
                </p>
              ) : (
                <p className="mt-2 text-xs text-gray-400">
                  We&apos;ll research {fileRowCount !== null ? `all ${fileRowCount}` : `up to ${tier.leads}`} leads from your file.
                </p>
              )}
            </div>

            {/* Order summary */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Lead research ({tier.leads} leads)
                </span>
                <span className="text-sm font-medium text-gray-900">
                  ${tier.price.toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${tier.price.toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              className="mt-6 w-full rounded-md bg-primary-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Continue to Payment — ${tier.price.toFixed(2)}
            </button>
          </>
        )}

        {step === 2 && file && (
          <Elements stripe={stripePromise}>
            <PaymentForm
              file={file}
              tier={tier}
              fileRowCount={fileRowCount}
              onBack={() => setStep(1)}
            />
          </Elements>
        )}

        <p className="mt-4 text-center text-xs text-gray-400">
          Secure payment powered by Stripe. Your report will be emailed within
          30 minutes.
        </p>
      </div>
    </div>
  );
}
