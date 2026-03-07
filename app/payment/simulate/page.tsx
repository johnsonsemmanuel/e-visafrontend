"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function SimulatePaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");

  const handlePayment = async (success: boolean) => {
    setLoading(true);
    try {
      // Simulate webhook callback
      await api.post("/webhooks/payment", {
        transaction_reference: ref,
        provider_reference: `SIM_${Date.now()}`,
        status: success ? "success" : "failed",
      });

      setStatus(success ? "success" : "failed");
      toast.success(success ? "Payment successful!" : "Payment failed");

      if (success) {
        setTimeout(() => {
          router.push("/dashboard/applicant");
        }, 2000);
      }
    } catch (err) {
      toast.error("Payment processing error");
    } finally {
      setLoading(false);
    }
  };

  if (!ref) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="mx-auto text-danger mb-4" />
          <h1 className="text-xl font-bold text-text-primary mb-2">Invalid Payment Link</h1>
          <p className="text-text-secondary">No transaction reference provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-8">
        {status === "pending" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-accent" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Simulation</h1>
              <p className="text-text-secondary text-sm">
                This is a test payment page. In production, you would be redirected to the actual payment gateway.
              </p>
            </div>

            <div className="bg-surface rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">Transaction Reference</span>
                <span className="text-sm font-mono text-text-primary">{ref}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Status</span>
                <span className="text-sm font-medium text-warning">Awaiting Payment</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full !bg-success hover:!bg-success/90"
                onClick={() => handlePayment(true)}
                loading={loading}
                leftIcon={<CheckCircle2 size={18} />}
              >
                Simulate Successful Payment
              </Button>
              <Button
                variant="secondary"
                className="w-full !border-danger !text-danger hover:!bg-danger/10"
                onClick={() => handlePayment(false)}
                loading={loading}
                leftIcon={<XCircle size={18} />}
              >
                Simulate Failed Payment
              </Button>
            </div>

            <p className="text-xs text-text-muted text-center mt-6">
              In production, configure Paystack or Stripe API keys in your environment variables.
            </p>
          </>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Payment Successful!</h2>
            <p className="text-text-secondary mb-4">
              Your application has been submitted for processing.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
              <Loader2 size={16} className="animate-spin" />
              Redirecting to dashboard...
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={40} className="text-danger" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Payment Failed</h2>
            <p className="text-text-secondary mb-6">
              The payment could not be processed. Please try again.
            </p>
            <Button onClick={() => setStatus("pending")}>
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimulatePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-8">
          <div className="text-center py-8">
            <Loader2 size={48} className="mx-auto text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <SimulatePaymentContent />
    </Suspense>
  );
}
