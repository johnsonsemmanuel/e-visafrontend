"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

function getLoginRoute(role: UserRole): string {
  switch (role) {
    case "APPLICANT":
    case "applicant":
      return "/login";
    case "GIS_REVIEWING_OFFICER":
    case "GIS_APPROVAL_OFFICER":
    case "GIS_ADMIN":
    case "gis_officer":
    case "MFA_REVIEWING_OFFICER":
    case "MFA_APPROVAL_OFFICER":
    case "MFA_ADMIN":
    case "mfa_reviewer":
      return "/login/staff";
    case "SYSTEM_ADMIN":
    case "admin":
      return "/login/admin";
    case "IMMIGRATION_OFFICER":
      return "/login/border";
    case "AIRLINE_STAFF":
      return "/login/staff";
    default:
      return "/login";
  }
}

export function RoleGuard({ allowedRoles, children, redirectTo }: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      // Not logged in - redirect to appropriate login
      router.push(redirectTo || "/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // User doesn't have permission - redirect to their correct dashboard or login
      router.push(getLoginRoute(user.role));
    }
  }, [user, isAuthenticated, loading, allowedRoles, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
