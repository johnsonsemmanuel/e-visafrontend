"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Download,
  FileText,
  Globe,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState({
    start_date: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    end_date: formatDate(new Date()),
  });

  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch analytics data
  const { data: revenueData } = useQuery({
    queryKey: ["revenue", dateRange],
    queryFn: () =>
      api.get("/admin/analytics/revenue", { params: dateRange }).then((r) => r.data.data),
  });

  const { data: visitorsByCountry } = useQuery({
    queryKey: ["visitors-by-country", dateRange],
    queryFn: () =>
      api.get("/admin/analytics/visitors/by-country", { params: dateRange }).then((r) => r.data.data),
  });

  const { data: approvalRates } = useQuery({
    queryKey: ["approval-rates", dateRange],
    queryFn: () =>
      api.get("/admin/analytics/visitors/approval-rates", { params: dateRange }).then((r) => r.data.data),
  });

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setAiLoading(true);
    try {
      const response = await api.post("/admin/ai-assistant/query", { query: aiQuery });
      setAiResponse(response.data);
      setAiQuery(""); // Clear input after successful query
    } catch (error) {
      console.error("AI query failed:", error);
      setAiResponse({
        success: false,
        answer: "Failed to process query. Please try again.",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleExport = async (type: "csv" | "excel") => {
    try {
      const response = await api.post(`/admin/analytics/export/${type}`, {
        report_type: "visitors_by_country",
        ...dateRange,
      }, {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `evisa_report_${dateRange.start_date}_to_${dateRange.end_date}.${type === "csv" ? "csv" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <DashboardShell
      title="Financial & Analytics Reports"
      description="Comprehensive system analytics and AI-powered insights"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={() => handleExport("csv")}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={() => handleExport("excel")}
          >
            Export Excel
          </Button>
        </div>
      }
    >
      {/* Date Range Selector */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.start_date}
              onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.end_date}
              onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border text-sm"
            />
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">AI Assistant</h3>
            <p className="text-xs text-text-muted">Ask questions about your data</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAIQuery()}
            placeholder="e.g., How many visitors from Nigeria last month?"
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm"
          />
          <Button
            onClick={handleAIQuery}
            loading={aiLoading}
            leftIcon={<Send size={16} />}
          >
            Ask
          </Button>
        </div>

        {aiResponse && (
          <div className="bg-surface rounded-lg p-4 border border-border">
            <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {aiResponse.answer}
            </p>
            {aiResponse.structured_data && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-medium text-text-muted mb-2">Data:</p>
                <pre className="text-xs text-text-muted overflow-auto bg-white p-3 rounded-lg max-h-48">
                  {JSON.stringify(aiResponse.structured_data, null, 2)}
                </pre>
              </div>
            )}
            {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-medium text-text-muted mb-2">Follow-up questions:</p>
                <div className="flex flex-wrap gap-2">
                  {aiResponse.suggestions.map((suggestion: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setAiQuery(suggestion)}
                      className="px-3 py-1.5 bg-white rounded-lg text-xs text-text-secondary hover:text-accent hover:bg-accent/5 border border-border transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Financial Report */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <DollarSign size={20} className="text-success" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Financial Report</h3>
            <p className="text-xs text-text-muted">Revenue and payment analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-2xl font-bold text-success">${revenueData?.total?.toFixed(2) || "0.00"}</p>
            <p className="text-xs text-text-muted mt-1">Total Revenue</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-2xl font-bold text-text-primary">{revenueData?.count || 0}</p>
            <p className="text-xs text-text-muted mt-1">Transactions</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-2xl font-bold text-text-primary">${revenueData?.average?.toFixed(2) || "0.00"}</p>
            <p className="text-xs text-text-muted mt-1">Average Value</p>
          </div>
        </div>
      </div>

      {/* Visitors by Country */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
            <Globe size={20} className="text-info" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Visitors by Country</h3>
            <p className="text-xs text-text-muted">Application volume by nationality</p>
          </div>
        </div>

        <div className="space-y-2">
          {visitorsByCountry && visitorsByCountry.length > 0 ? (
            visitorsByCountry.slice(0, 10).map((country: any) => (
              <div key={country.country} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <p className="font-medium text-text-primary">{country.country}</p>
                    <p className="text-xs text-text-muted">{country.count} applications ({country.percentage}%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-primary">{country.count}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">No visitor data available for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Rates by Country */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Approval & Denial Rates</h3>
            <p className="text-xs text-text-muted">Success rates by country</p>
          </div>
        </div>

        <div className="space-y-2">
          {approvalRates && approvalRates.length > 0 ? (
            approvalRates.slice(0, 10).map((country: any) => (
              <div key={country.country} className="p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-text-primary">{country.country}</p>
                  <p className="text-sm text-text-muted">{country.total} total</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-success">Approved</span>
                      <span className="text-xs font-medium">{country.approval_rate}%</span>
                    </div>
                    <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${country.approval_rate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-danger">Denied</span>
                      <span className="text-xs font-medium">{country.denial_rate}%</span>
                    </div>
                    <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-danger"
                        style={{ width: `${country.denial_rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">No approval rate data available for this period</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
