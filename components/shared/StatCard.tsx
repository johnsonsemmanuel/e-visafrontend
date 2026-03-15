"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  subtitle,
  description,
  onClick,
  className = "",
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={`card p-4 ${
        isClickable
          ? "cursor-pointer transition-all duration-200 hover:shadow-lg group"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          <Icon size={20} className={iconColor} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-text-muted">{label}</p>
          <p className={`text-xl font-bold ${iconColor}`}>
            {value}
            {subtitle && (
              <span className="text-text-muted font-normal text-sm ml-1">
                {subtitle}
              </span>
            )}
          </p>
        </div>
      </div>
      {description && (
        <p className="text-sm text-text-secondary mt-2">{description}</p>
      )}
    </div>
  );
}

export interface LargeStatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  valueLabel: string;
  description: string;
  onClick?: () => void;
  hoverBorderColor?: string;
}

export function LargeStatCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  valueLabel,
  description,
  onClick,
  hoverBorderColor = "hover:border-info/30",
}: LargeStatCardProps) {
  return (
    <div
      className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${hoverBorderColor} group`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={24} className={iconColor} />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          <p className="text-xs text-text-muted">{valueLabel}</p>
        </div>
      </div>
      <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">Click to view details</span>
        <svg
          className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
