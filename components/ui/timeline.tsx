"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle, Circle, User, Send, ArrowRight, FileCheck } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

interface TimelineItem {
  status: ApplicationStatus;
  notes: string | null;
  changed_at: string;
  changed_by?: string | null;
  next_step?: string | null;
}

const dotColor: Partial<Record<ApplicationStatus, string>> = {
  approved: "bg-success",
  denied: "bg-danger",
  escalated: "bg-warning",
  additional_info_requested: "bg-warning",
  pending_approval: "bg-info",
  under_review: "bg-info",
  submitted: "bg-accent",
  draft: "bg-text-muted",
  pending_payment: "bg-gold",
};

const ringColor: Partial<Record<ApplicationStatus, string>> = {
  approved: "ring-success/20",
  denied: "ring-danger/20",
  escalated: "ring-warning/20",
  additional_info_requested: "ring-warning/20",
  pending_approval: "ring-info/20",
  under_review: "ring-info/20",
  submitted: "ring-accent/20",
  draft: "ring-text-muted/10",
  pending_payment: "ring-gold/20",
};

const iconMap: Partial<Record<ApplicationStatus, React.ReactNode>> = {
  approved: <CheckCircle2 size={14} className="text-white" />,
  denied: <AlertCircle size={14} className="text-white" />,
  escalated: <Send size={14} className="text-white" />,
  additional_info_requested: <Clock size={14} className="text-white" />,
  pending_approval: <FileCheck size={14} className="text-white" />,
  under_review: <User size={14} className="text-white" />,
  submitted: <ArrowRight size={14} className="text-white" />,
};

const statusLabels: Partial<Record<ApplicationStatus, string>> = {
  draft: "Application Created",
  pending_payment: "Awaiting Payment",
  submitted: "Submitted for Processing",
  under_review: "Under Review",
  pending_approval: "Pending Final Approval",
  escalated: "Escalated to MFA",
  additional_info_requested: "Additional Info Requested",
  approved: "Application Approved",
  denied: "Application Denied",
};

const nextStepInfo: Partial<Record<ApplicationStatus, string>> = {
  submitted: "Application routed to reviewing agency",
  under_review: "Officer reviewing documents and details",
  pending_approval: "Awaiting senior officer approval",
  escalated: "MFA reviewer will assess the case",
  additional_info_requested: "Waiting for applicant to provide documents",
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const isFirst = i === 0;
        return (
          <div key={i} className="flex gap-4 relative">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[34px] bottom-0 w-[2px] bg-gradient-to-b from-border to-border-light" />
            )}

            {/* Dot */}
            <div className="relative z-10 shrink-0 mt-1">
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ring-4 ${dotColor[item.status] || "bg-text-muted"} ${ringColor[item.status] || "ring-text-muted/10"}`}>
                {iconMap[item.status] || <Circle size={12} className="text-white" />}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
              <div className={`p-3 rounded-xl ${isFirst ? "bg-surface border border-border-light" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary leading-tight">
                    {statusLabels[item.status] || item.status.replace(/_/g, " ")}
                  </p>
                  <span className="text-[11px] text-text-muted whitespace-nowrap shrink-0">
                    {relativeTime(item.changed_at)}
                  </span>
                </div>
                {item.changed_by && (
                  <p className="text-xs text-accent font-medium mt-1">
                    {item.changed_by}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {item.notes}
                  </p>
                )}
                {isLast && nextStepInfo[item.status] && (
                  <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-info/8 border border-info/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                    <p className="text-[11px] text-info font-medium">
                      {nextStepInfo[item.status]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
