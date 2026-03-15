"use client";

import { useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

interface ReasonCode {
  id: number;
  code: string;
  action_type: string;
  reason: string;
  description: string | null;
}

interface ReasonCodeMultiSelectorProps {
  codes: ReasonCode[];
  selectedCodes: string[];
  onSelect: (codes: string[]) => void;
  actionType: "approve" | "reject" | "request_info" | "escalate";
  label?: string;
}

const actionTypeLabels = {
  approve: { label: "Approval Reasons", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  reject: { label: "Rejection Reasons", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  request_info: { label: "Information Requests", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  escalate: { label: "Escalation Reasons", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
};

export function ReasonCodeMultiSelector({
  codes,
  selectedCodes,
  onSelect,
  actionType,
  label,
}: ReasonCodeMultiSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const config = actionTypeLabels[actionType];
  const filteredCodes = codes.filter(
    (c) =>
      c.action_type === actionType &&
      (c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.reason.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedReasonCodes = codes.filter((c) => selectedCodes.includes(c.code));

  const toggleCode = (code: string) => {
    if (selectedCodes.includes(code)) {
      onSelect(selectedCodes.filter((c) => c !== code));
    } else {
      onSelect([...selectedCodes, code]);
    }
  };

  const removeCode = (code: string) => {
    onSelect(selectedCodes.filter((c) => c !== code));
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label || config.label} <span className="text-red-500">*</span>
      </label>

      {/* Selected Codes Display */}
      {selectedReasonCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedReasonCodes.map((reasonCode) => (
            <div
              key={reasonCode.code}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} ${config.border} border`}
            >
              <span className={`font-mono text-xs font-bold ${config.color}`}>
                {reasonCode.code}
              </span>
              <span className="text-xs text-slate-700">{reasonCode.reason}</span>
              <button
                type="button"
                onClick={() => removeCode(reasonCode.code)}
                className={`${config.color} hover:opacity-70 transition-opacity`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
          selectedCodes.length > 0
            ? `${config.bg} ${config.border}`
            : "bg-white border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-3">
          {selectedCodes.length > 0 ? (
            <span className="text-slate-700 font-medium">
              {selectedCodes.length} reason{selectedCodes.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            <span className="text-slate-400">Select reason codes...</span>
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
                filteredCodes.map((code) => {
                  const isSelected = selectedCodes.includes(code.code);
                  return (
                    <button
                      key={code.id}
                      type="button"
                      onClick={() => toggleCode(code.code)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        isSelected
                          ? `${config.bg}`
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? `${config.border} ${config.bg}`
                          : "border-slate-300"
                      }`}>
                        {isSelected && (
                          <Check size={14} className={config.color} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${config.bg} ${config.color}`}>
                            {code.code}
                          </span>
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {code.reason}
                          </p>
                        </div>
                        {code.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {code.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No matching reason codes found
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedReasonCodes.length > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          {selectedReasonCodes.length} reason{selectedReasonCodes.length !== 1 ? 's' : ''} selected. You can select multiple reasons.
        </p>
      )}
    </div>
  );
}
