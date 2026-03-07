"use client";

import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  FileWarning,
  Clock,
  TrendingUp,
  User,
} from "lucide-react";

interface RiskFactor {
  name: string;
  triggered: boolean;
  score: number;
  details?: string;
}

interface RiskPanelProps {
  riskScore: number | null;
  riskLevel: "low" | "medium" | "high" | "critical" | null;
  watchlistFlagged: boolean;
  factors?: RiskFactor[];
  recommendations?: Array<{
    priority: string;
    action: string;
    reason: string;
    details?: string;
  }>;
}

const riskLevelConfig = {
  low: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
    label: "Low Risk",
  },
  medium: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: AlertTriangle,
    label: "Medium Risk",
  },
  high: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: AlertTriangle,
    label: "High Risk",
  },
  critical: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    label: "Critical Risk",
  },
};

export function RiskPanel({
  riskScore,
  riskLevel,
  watchlistFlagged,
  factors = [],
  recommendations = [],
}: RiskPanelProps) {
  const config = riskLevel ? riskLevelConfig[riskLevel] : null;
  const Icon = config?.icon || Shield;

  return (
    <div className="space-y-4">
      {/* Risk Score Header */}
      <div className={`p-4 rounded-2xl border-2 ${config?.bg || "bg-slate-50"} ${config?.border || "border-slate-200"}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${config?.bg || "bg-slate-100"} flex items-center justify-center`}>
              <Icon size={24} className={config?.color || "text-slate-500"} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Risk Assessment</p>
              <p className={`text-xl font-bold ${config?.color || "text-slate-700"}`}>
                {config?.label || "Not Assessed"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-800">{riskScore ?? "—"}</p>
            <p className="text-xs text-slate-500">/ 100</p>
          </div>
        </div>

        {/* Risk Score Bar */}
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              riskLevel === "low"
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : riskLevel === "medium"
                ? "bg-gradient-to-r from-amber-400 to-amber-500"
                : riskLevel === "high"
                ? "bg-gradient-to-r from-orange-400 to-orange-500"
                : riskLevel === "critical"
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-slate-300"
            }`}
            style={{ width: `${riskScore ?? 0}%` }}
          />
        </div>
      </div>

      {/* Watchlist Alert */}
      {watchlistFlagged && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <FileWarning size={20} className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-700">Watchlist Match Detected</p>
              <p className="text-sm text-red-600">Manual review required before approval</p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {factors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <TrendingUp size={16} />
            Risk Factors
          </h4>
          <div className="grid gap-2">
            {factors.map((factor, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  factor.triggered
                    ? "bg-red-50 border-red-200"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {factor.triggered ? (
                      <XCircle size={16} className="text-red-500" />
                    ) : (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {factor.name.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      factor.triggered
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    +{factor.score}
                  </span>
                </div>
                {factor.details && (
                  <p className="text-xs text-slate-500 mt-1 ml-6">{factor.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Eye size={16} />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  rec.priority === "critical"
                    ? "bg-red-50 border-red-200"
                    : rec.priority === "high"
                    ? "bg-orange-50 border-orange-200"
                    : rec.priority === "medium"
                    ? "bg-amber-50 border-amber-200"
                    : rec.priority === "info"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                      rec.priority === "critical"
                        ? "bg-red-100 text-red-700"
                        : rec.priority === "high"
                        ? "bg-orange-100 text-orange-700"
                        : rec.priority === "medium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{rec.action.replace(/_/g, " ")}</p>
                    <p className="text-xs text-slate-500">{rec.reason}</p>
                    {rec.details && (
                      <p className="text-xs text-slate-400 mt-1">{rec.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Checks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Nationality Risk</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {factors.find(f => f.name === "nationality_risk")?.triggered ? "Elevated" : "Normal"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Previous Denial</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {factors.find(f => f.name === "previous_denial")?.triggered ? "Yes" : "None"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Overstay History</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {factors.find(f => f.name === "overstay_history")?.triggered ? "Yes" : "None"}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <FileWarning size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Document Issues</span>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {factors.find(f => f.name === "document_anomaly")?.triggered ? "Detected" : "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
