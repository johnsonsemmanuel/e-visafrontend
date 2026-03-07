"use client";

import { Shield, CheckCircle2, AlertTriangle, XCircle, Globe, Fingerprint, FileSearch, AlertOctagon } from "lucide-react";

interface TrustNetResult {
  passport_authentic: boolean;
  mrz_valid: boolean;
  interpol_clear: boolean;
  watchlist_clear: boolean;
  identity_verified: boolean;
  fraud_indicators: string[];
  risk_score: number;
  last_checked: string;
}

interface TrustNetPanelProps {
  data?: TrustNetResult;
  compact?: boolean;
}

export function TrustNetPanel({ data, compact = false }: TrustNetPanelProps) {
  // Default mock data if not provided
  const trustnet: TrustNetResult = data || {
    passport_authentic: true,
    mrz_valid: true,
    interpol_clear: true,
    watchlist_clear: true,
    identity_verified: true,
    fraud_indicators: [],
    risk_score: 15,
    last_checked: new Date().toISOString(),
  };

  const allClear = trustnet.passport_authentic && trustnet.mrz_valid && 
    trustnet.interpol_clear && trustnet.watchlist_clear && trustnet.identity_verified;

  const checks = [
    { label: "Passport Authenticity", passed: trustnet.passport_authentic, icon: FileSearch },
    { label: "MRZ Validation", passed: trustnet.mrz_valid, icon: Fingerprint },
    { label: "Interpol Database", passed: trustnet.interpol_clear, icon: Globe },
    { label: "Watchlist Check", passed: trustnet.watchlist_clear, icon: Shield },
    { label: "Identity Match", passed: trustnet.identity_verified, icon: CheckCircle2 },
  ];

  if (compact) {
    return (
      <div className={`p-4 rounded-xl border-2 ${allClear ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${allClear ? "bg-emerald-100" : "bg-red-100"}`}>
              {allClear ? <Shield size={20} className="text-emerald-600" /> : <AlertOctagon size={20} className="text-red-600" />}
            </div>
            <div>
              <p className={`font-bold ${allClear ? "text-emerald-700" : "text-red-700"}`}>
                TrustNET: {allClear ? "CLEAR" : "FLAGGED"}
              </p>
              <p className="text-xs text-slate-500">Risk Score: {trustnet.risk_score}/100</p>
            </div>
          </div>
          <div className="flex gap-1">
            {checks.map((c, i) => (
              <div key={i} className={`w-6 h-6 rounded flex items-center justify-center ${c.passed ? "bg-emerald-100" : "bg-red-100"}`}>
                {c.passed ? <CheckCircle2 size={12} className="text-emerald-600" /> : <XCircle size={12} className="text-red-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${allClear ? "bg-gradient-to-br from-emerald-100 to-emerald-50" : "bg-gradient-to-br from-red-100 to-red-50"}`}>
            <Shield size={24} className={allClear ? "text-emerald-600" : "text-red-600"} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">TrustNET Verification</h3>
            <p className="text-xs text-slate-500">Passport & Security Screening</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold text-sm ${allClear ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
          {allClear ? "✓ CLEAR" : "⚠ FLAGGED"}
        </div>
      </div>

      {/* Risk Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Risk Score</span>
          <span className={`text-lg font-bold ${trustnet.risk_score < 30 ? "text-emerald-600" : trustnet.risk_score < 60 ? "text-amber-600" : "text-red-600"}`}>
            {trustnet.risk_score}/100
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-150 ease-out ${trustnet.risk_score < 30 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : trustnet.risk_score < 60 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
            style={{ width: `${trustnet.risk_score}%` }}
          />
        </div>
      </div>

      {/* Security Checks */}
      <div className="space-y-2">
        {checks.map((check, i) => {
          const Icon = check.icon;
          return (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${check.passed ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${check.passed ? "bg-emerald-100" : "bg-red-100"}`}>
                  <Icon size={16} className={check.passed ? "text-emerald-600" : "text-red-600"} />
                </div>
                <span className="text-sm font-medium text-slate-700">{check.label}</span>
              </div>
              {check.passed ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 size={14} /> PASS
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <XCircle size={14} /> FAIL
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Fraud Indicators */}
      {trustnet.fraud_indicators.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-sm font-bold text-red-700">Fraud Indicators Detected</span>
          </div>
          <ul className="space-y-1">
            {trustnet.fraud_indicators.map((indicator, i) => (
              <li key={i} className="text-sm text-red-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-4">
        Last verified: {new Date(trustnet.last_checked).toLocaleString()}
      </p>
    </div>
  );
}
