"use client";

import { CheckCircle2, Clock, AlertTriangle, XCircle, FileText, ArrowRight } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

interface TimelineItem {
  status: ApplicationStatus;
  notes: string | null;
  changed_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  draft:                      { icon: <FileText size={14} />,      color: "text-text-muted",  bg: "bg-text-muted/10",  label: "Draft" },
  submitted:                  { icon: <ArrowRight size={14} />,    color: "text-info",        bg: "bg-info/10",        label: "Submitted" },
  submitted_awaiting_payment: { icon: <Clock size={14} />,         color: "text-warning",     bg: "bg-warning/10",     label: "Awaiting Payment" },
  pending_payment:            { icon: <Clock size={14} />,         color: "text-warning",     bg: "bg-warning/10",     label: "Pending Payment" },
  paid_submitted:             { icon: <CheckCircle2 size={14} />,  color: "text-info",        bg: "bg-info/10",        label: "Paid & Submitted" },
  under_review:               { icon: <Clock size={14} />,         color: "text-info",        bg: "bg-info/10",        label: "Under Review" },
  pending_approval:           { icon: <Clock size={14} />,         color: "text-warning",     bg: "bg-warning/10",     label: "Pending Approval" },
  additional_info_requested:  { icon: <AlertTriangle size={14} />, color: "text-warning",     bg: "bg-warning/10",     label: "Info Requested" },
  escalated:                  { icon: <AlertTriangle size={14} />, color: "text-danger",      bg: "bg-danger/10",      label: "Escalated" },
  approved:                   { icon: <CheckCircle2 size={14} />,  color: "text-success",     bg: "bg-success/10",     label: "Approved" },
  denied:                     { icon: <XCircle size={14} />,       color: "text-danger",      bg: "bg-danger/10",      label: "Denied" },
  issued:                     { icon: <CheckCircle2 size={14} />,  color: "text-success",     bg: "bg-success/10",     label: "Issued" },
  cancelled:                  { icon: <XCircle size={14} />,       color: "text-text-muted",  bg: "bg-text-muted/10",  label: "Cancelled" },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative space-y-0">
      {items.map((item, idx) => {
        const cfg = statusConfig[item.status] || statusConfig.draft;
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="relative flex gap-3 pb-5 last:pb-0">
            {/* Vertical connector line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[30px] w-[2px] h-[calc(100%-18px)] bg-border" />
            )}

            {/* Status icon */}
            <div className={`relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color}`}>
              {cfg.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{formatDate(item.changed_at)}</p>
              {item.notes && (
                <p className="text-xs text-text-secondary mt-1 bg-surface rounded-md px-2.5 py-1.5">{item.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
