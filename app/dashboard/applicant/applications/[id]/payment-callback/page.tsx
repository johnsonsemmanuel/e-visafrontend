"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import api from "@/lib/api";
import toast from "react-hot-toast";

function PaymentCallbackContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const reference = searchParams.get('reference') || searchParams.get('trxref') || searchParams.get('tx_ref');
      
      if (!reference) {
        setStatus('failed');
        setMessage('Payment reference not found');
        return;
      }

      // Verify payment with backend
      const response = await api.post('/applicant/payment/verify', { reference });
      

      
      // Check for successful payment
      if (response.data.success && (response.data.status === 'paid' || response.data.status === 'completed')) {
        setStatus('success');
        setMessage('Payment completed successfully! Your application is now being processed.');
        setPaymentDetails(response.data.payment);
        
        toast.success('Payment completed successfully! Your application is now being processed.', {
          duration: 5000,
          icon: '✅'
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/applicant');
        }, 2000);
        return;
      }
      
      // Check for pending verification (bank transfer)
      if (response.data.success && response.data.status === 'pending_verification') {
        setStatus('pending');
        setMessage('Payment received and is being verified. You will be notified once confirmed.');
        
        toast.success('Payment received and is being verified. You will be notified once confirmed.', {
          duration: 5000,
          icon: '⏳'
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/applicant');
        }, 2000);
        return;
      }
      
      // Payment verification failed or payment not found
      setStatus('failed');
      setMessage(response.data.message || 'Payment verification failed. Please contact support if you have been charged.');
      toast.error(response.data.message || 'Payment verification failed');
      
    } catch (error: any) {
      // TODO: wire to error monitoring service
      setStatus('failed');
      setMessage(error.response?.data?.message || 'Failed to verify payment. Please contact support if you have been charged.');
      toast.error('Payment verification failed');
    }
  };

  const handleContinue = () => {
    if (status === 'success') {
      router.push(`/dashboard/applicant/applications/${params.id}`);
    } else {
      router.push('/dashboard/applicant');
    }
  };

  const handleRetryPayment = () => {
    router.push(`/dashboard/applicant/applications/${params.id}`);
  };

  return (
    <DashboardShell title="Payment Status">
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-accent/10">
                <Loader2 size={32} className="text-accent animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Verifying Payment</h1>
              <p className="text-text-secondary mb-6">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-success/10">
                <CheckCircle size={32} className="text-success" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Successful!</h1>
              <p className="text-text-secondary mb-6">
                {message || 'Your payment has been processed successfully. Your visa application is now being reviewed.'}
              </p>
              
              {paymentDetails && (
                <div className="bg-surface rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-semibold text-text-primary mb-3">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Reference:</span>
                      <span className="text-text-primary font-mono">{paymentDetails.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Amount:</span>
                      <span className="text-text-primary">${paymentDetails.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Method:</span>
                      <span className="text-text-primary capitalize">{paymentDetails.provider}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleContinue} className="w-full">
                View Application <ArrowRight size={16} className="ml-2" />
              </Button>
            </>
          )}

          {status === 'pending' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-warning/10">
                <Loader2 size={32} className="text-warning" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Pending</h1>
              <p className="text-text-secondary mb-6">
                {message || 'Your payment is being processed. This may take a few minutes.'}
              </p>
              
              <div className="space-y-3">
                <Button onClick={handleContinue} className="w-full">
                  View Application <ArrowRight size={16} className="ml-2" />
                </Button>
                <p className="text-xs text-text-muted">
                  You will receive an email notification once your payment is confirmed.
                </p>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-danger/10">
                <XCircle size={32} className="text-danger" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Payment Failed</h1>
              <p className="text-text-secondary mb-6">
                {message || 'We could not process your payment. Please try again.'}
              </p>
              
              <div className="space-y-3">
                <Button onClick={handleRetryPayment} className="w-full">
                  Try Again
                </Button>
                <Button variant="secondary" onClick={() => router.push('/dashboard/applicant')} className="w-full">
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<DashboardShell title="Payment Status"><div className="flex items-center justify-center h-96"><Loader2 className="animate-spin" /></div></DashboardShell>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}