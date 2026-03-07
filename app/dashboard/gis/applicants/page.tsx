"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Applicant data is only available in admin dashboards per spec.
 * Redirect GIS officers to the case queue instead.
 */
export default function GisApplicantsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/gis/cases");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-muted text-sm">Redirecting to Case Queue...</p>
    </div>
  );
}
