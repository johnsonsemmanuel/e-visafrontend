"use client";

import { Search } from "lucide-react";
import { Select } from "@/components/ui/input";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  type: "search" | "select";
  placeholder: string;
  options?: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  className?: string;
}

export function FilterBar({ filters, className = "" }: FilterBarProps) {
  return (
    <div className={`card mb-6 ${className}`}>
      <div className={`grid gap-4 ${getGridClass(filters.length)}`}>
        {filters.map((filter) => (
          <div key={filter.key}>
            {filter.type === "search" ? (
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="input !pl-9"
                />
              </div>
            ) : filter.type === "select" && filter.options ? (
              <Select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                placeholder={filter.placeholder}
                options={filter.options}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function getGridClass(filterCount: number): string {
  if (filterCount === 1) return "grid-cols-1";
  if (filterCount === 2) return "sm:grid-cols-2";
  if (filterCount === 3) return "sm:grid-cols-3";
  if (filterCount === 4) return "sm:grid-cols-4";
  if (filterCount >= 5) return "sm:grid-cols-2 lg:grid-cols-5";
  return "sm:grid-cols-2 lg:grid-cols-3";
}
