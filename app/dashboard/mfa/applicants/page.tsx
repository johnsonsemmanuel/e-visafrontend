"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Applicant data is only available in admin dashboards per spec.
 * Redirect MFA reviewers to the escalations inbox instead.
 */
export default function MfaApplicantsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/mfa/escalations");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-muted text-sm">Redirecting to Escalation Inbox...</p>
    </div>
  );
}
