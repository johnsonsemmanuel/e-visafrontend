"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function MfaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["MFA_REVIEWING_OFFICER", "MFA_APPROVAL_OFFICER", "MFA_ADMIN"]} redirectTo="/login/staff">
      {children}
    </RoleGuard>
  );
}
