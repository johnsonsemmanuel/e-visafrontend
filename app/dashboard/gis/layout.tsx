"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function GisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["GIS_REVIEWING_OFFICER", "GIS_APPROVAL_OFFICER", "GIS_ADMIN"]} redirectTo="/login/staff">
      {children}
    </RoleGuard>
  );
}
