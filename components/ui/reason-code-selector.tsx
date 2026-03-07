"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface ReasonCode {
  id: number;
  code: string;
  action_type: string;
  reason: string;
  description: string | null;
}

interface ReasonCodeSelectorProps {
  codes: ReasonCode[];
  selectedCode: string | null;
  onSelect: (code: ReasonCode) => void;
  actionType: "approve" | "reject" | "request_info" | "escalate";
  label?: string;
}

const actionTypeLabels = {
  approve: { label: "Approval Reason", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  reject: { label: "Rejection Reason", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  request_info: { label: "Information Request", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  escalate: { label: "Escalation Reason", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
};

export function ReasonCodeSelector({
  codes,
  selectedCode,
  onSelect,
  actionType,
  label,
}: ReasonCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const config = actionTypeLabels[actionType];
  const filteredCodes = codes.filter(
    (c) =>
      c.action_type === actionType &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.reason.toLowerCase().includes(search.toLowerCase()))
  );

  const selected = codes.find((c) => c.code === selectedCode);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label || config.label} <span className="text-red-500">*</span>
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          selected
            ? `${config.bg} ${config.border}`
            : "bg-white border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <span className={`font-mono text-sm font-bold ${config.color}`}>
                {selected.code}
              </span>
              <span className="text-slate-700 font-medium">{selected.reason}</span>
            </>
          ) : (
            <span className="text-slate-400">Select a reason code...</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reason codes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredCodes.length > 0 ? (
                filteredCodes.map((code) => (
                  <button
                    key={code.id}
                    type="button"
                    onClick={() => {
                      onSelect(code);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                      selectedCode === code.code
                        ? `${config.bg}`
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${config.bg} ${config.color}`}>
                      {code.code}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {code.reason}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {code.description || ""}
                      </p>
                    </div>
                    {selectedCode === code.code && (
                      <Check size={18} className={config.color} />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching reason codes found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selected && (
        <p className="mt-2 text-xs text-slate-500">{selected.description || ""}</p>
      )}
    </div>
  );
}
