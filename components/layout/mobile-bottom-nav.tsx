"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Bell,
  User,
  FolderOpen,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  Menu,
  Scan,
  Plane,
  MapPin,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

interface NavTab {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNav {
  left: NavTab[];
  right: NavTab[];
  center: { label: string; href: string };
}

const applicantMobile: MobileNav = {
  left: [
    { label: "Home", href: "/dashboard/applicant", icon: <LayoutDashboard size={20} /> },
    { label: "Applications", href: "/dashboard/applicant/applications", icon: <FileText size={20} /> },
  ],
  center: { label: "Apply", href: "/dashboard/applicant/applications/new" },
  right: [
    { label: "Alerts", href: "/dashboard/applicant/notifications", icon: <Bell size={20} /> },
    { label: "More", href: "#", icon: <Menu size={20} /> },
  ],
};

const gisMobile: MobileNav = {
  left: [
    { label: "Home", href: "/dashboard/gis", icon: <LayoutDashboard size={20} /> },
    { label: "Cases", href: "/dashboard/gis/cases", icon: <FolderOpen size={20} /> },
  ],
  center: { label: "Cases", href: "/dashboard/gis/cases" },
  right: [
    { label: "SLA", href: "/dashboard/gis/sla-alerts", icon: <AlertTriangle size={20} /> },
    { label: "Payments", href: "/dashboard/gis/payments", icon: <BarChart3 size={20} /> },
  ],
};

const mfaMobile: MobileNav = {
  left: [
    { label: "Home", href: "/dashboard/mfa", icon: <LayoutDashboard size={20} /> },
    { label: "Cases", href: "/dashboard/mfa/escalations", icon: <AlertTriangle size={20} /> },
  ],
  center: { label: "Cases", href: "/dashboard/mfa/escalations" },
  right: [
    { label: "Payments", href: "/dashboard/mfa/payments", icon: <BarChart3 size={20} /> },
    { label: "Profile", href: "/dashboard/mfa", icon: <User size={20} /> },
  ],
};

const adminMobile: MobileNav = {
  left: [
    { label: "Home", href: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <Users size={20} /> },
  ],
  center: { label: "Apps", href: "/dashboard/admin/applications" },
  right: [
    { label: "Reports", href: "/dashboard/admin/reports", icon: <BarChart3 size={20} /> },
    { label: "Settings", href: "/dashboard/admin/tier-rules", icon: <Settings size={20} /> },
  ],
};

const borderMobile: MobileNav = {
  left: [
    { label: "Verify", href: "/dashboard/border", icon: <Scan size={20} /> },
    { label: "Ops", href: "/dashboard/border/operations", icon: <MapPin size={20} /> },
  ],
  center: { label: "Scan", href: "/dashboard/border" },
  right: [
    { label: "Reports", href: "/dashboard/border/reports", icon: <BarChart3 size={20} /> },
    { label: "Profile", href: "/dashboard/border", icon: <User size={20} /> },
  ],
};

const airlineMobile: MobileNav = {
  left: [
    { label: "Home", href: "/dashboard/airline", icon: <Plane size={20} /> },
    { label: "Verify", href: "/dashboard/airline", icon: <Scan size={20} /> },
  ],
  center: { label: "Verify", href: "/dashboard/airline" },
  right: [
    { label: "Profile", href: "/dashboard/airline", icon: <User size={20} /> },
    { label: "More", href: "#", icon: <Menu size={20} /> },
  ],
};

function getMobileNavForRole(role: UserRole): MobileNav | null {
  switch (role) {
    case "APPLICANT":
    case "applicant":
      return applicantMobile;
    case "GIS_REVIEWING_OFFICER":
    case "GIS_APPROVAL_OFFICER":
    case "GIS_ADMIN":
    case "gis_officer":
      return gisMobile;
    case "MFA_REVIEWING_OFFICER":
    case "MFA_APPROVAL_OFFICER":
    case "MFA_ADMIN":
    case "mfa_reviewer":
      return mfaMobile;
    case "SYSTEM_ADMIN":
    case "admin":
      return adminMobile;
    case "IMMIGRATION_OFFICER":
      return borderMobile;
    case "AIRLINE_STAFF":
      return airlineMobile;
    default:
      return null;
  }
}

export function MobileBottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const nav = getMobileNavForRole(user.role);
  if (!nav) return null;

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (["/applicant", "/gis", "/mfa", "/admin", "/border", "/airline"].some(s => href.endsWith(s))) {
      return pathname === href;
    }
    return pathname.startsWith(href + "/");
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Safe area background */}
      <div className="bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-end justify-around px-1 pb-[env(safe-area-inset-bottom,4px)] pt-1">
          {/* Left 2 buttons */}
          {nav.left.map((tab) => {
            const active = isActive(tab.href);
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 min-w-[56px] cursor-pointer"
              >
                <div className={active ? "text-accent" : "text-text-muted"}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-accent" : "text-text-muted"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Center FAB button */}
          <button
            onClick={() => router.push(nav.center.href)}
            className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg shadow-accent/30 text-white cursor-pointer active:scale-95 transition-transform"
          >
            <Plus size={26} strokeWidth={2.5} />
          </button>

          {/* Right 2 buttons */}
          {nav.right.map((tab) => {
            const active = isActive(tab.href);
            const isMore = tab.label === "More";
            return (
              <button
                key={tab.href}
                onClick={() => {
                  if (isMore) {
                    // Open mobile menu - this will trigger the bottom sheet
                    const event = new CustomEvent('openMobileMenu');
                    window.dispatchEvent(event);
                  } else {
                    router.push(tab.href);
                  }
                }}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-2 min-w-[56px] cursor-pointer"
              >
                <div className={active ? "text-accent" : "text-text-muted"}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-accent" : "text-text-muted"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
