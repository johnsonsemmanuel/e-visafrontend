"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function BorderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["IMMIGRATION_OFFICER"]} redirectTo="/login/border">
      {children}
    </RoleGuard>
  );
}
