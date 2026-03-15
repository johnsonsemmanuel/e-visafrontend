"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRealTimeDashboard } from "@/hooks/useRealTimeDashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { MetricsSkeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Users,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Shield,
  Settings,
  Wifi,
  WifiOff,
  Sparkles,
  Send,
  Globe,
} from "lucide-react";
import type { AdminOverview } from "@/lib/types";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [realtimeMetrics, setRealtimeMetrics] = useState<AdminOverview | null>(null);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Real-time dashboard hook
  const { isConnected } = useRealTimeDashboard({
    agency: 'admin',
    onMetricsUpdate: useCallback((newMetrics: any) => {
      setRealtimeMetrics(newMetrics);
    }, []),
    onPaymentUpdate: useCallback((update: any) => {

      // Optionally show toast notification for new payments
    }, []),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () =>
      api.get<AdminOverview>("/admin/reports/overview").then((r) => r.data),
    refetchInterval: isConnected ? 300000 : 60000, // Reduce polling when connected to WebSocket
  });

  // Use real-time metrics if available, otherwise fall back to polled data
  const currentData = realtimeMetrics || data;
  const apps = currentData?.applications;
  const payments = currentData?.payments;
  const users_data = currentData?.users;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setAiLoading(true);
    try {
      const response = await api.post("/admin/ai-assistant/query", { query: aiQuery });
      setAiResponse(response.data);
      setAiQuery(""); // Clear input after successful query
    } catch (error) {
      // TODO: wire to error monitoring service
      setAiResponse({
        success: false,
        answer: "Failed to process query. Please try again.",
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Admin Overview"
      description="System-wide analytics and management"
      actions={
        <div className="flex items-center gap-3">
          {/* Real-time connection indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            {isConnected ? (
              <>
                <Wifi size={12} />
                Live
              </>
            ) : (
              <>
                <WifiOff size={12} />
                Polling
              </>
            )}
          </div>
          <Button
            variant="secondary"
            leftIcon={<BarChart3 size={16} />}
            onClick={() => router.push("/dashboard/admin/reports")}
          >
            Full Reports
          </Button>
        </div>
      }
    >
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-accent-light to-accent p-6 lg:p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-gold/15 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">{greeting()},</p>
          <h2 className="text-white text-2xl font-bold mb-2">
            {user?.first_name || "Admin"} {user?.last_name || ""}
          </h2>
          <p className="text-white/70 text-sm max-w-md">
            Monitor system performance, manage users, and oversee all visa processing operations.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <Button
              onClick={() => router.push("/dashboard/admin/reports")}
              leftIcon={<BarChart3 size={15} />}
              className="!bg-white !text-accent hover:!bg-white/90 !shadow-lg !font-bold"
            >
              View Reports
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/admin/users")}
              className="!text-white/90 hover:!text-white hover:!bg-white/15"
            >
              Manage Users <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── AI Assistant ── */}
      <div className="card mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
            <Sparkles size={22} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">AI Assistant</h3>
            <p className="text-xs text-text-muted">Ask questions about your system data</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAIQuery()}
            placeholder="e.g., How many visitors from Nigeria last month?"
            className="flex-1 px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <Button
            onClick={handleAIQuery}
            loading={aiLoading}
            leftIcon={<Send size={16} />}
            className="px-6"
          >
            Ask
          </Button>
        </div>

        {aiResponse && (
          <div className="bg-surface rounded-xl p-4 border border-border">
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

        {!aiResponse && !aiLoading && (
          <div className="bg-surface/50 rounded-xl p-4 border border-border border-dashed">
            <p className="text-xs text-text-muted mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "How much revenue last month?",
                "Show visitors from US",
                "What's the approval rate?",
                "How many applications today?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
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

      {/* ── Application Metric Cards ── */}
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Applications Overview
      </h2>
      {isLoading ? (
        <MetricsSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="card-interactive group" onClick={() => router.push("/dashboard/admin/applications")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-info/8 flex items-center justify-center group-hover:bg-info/12 transition-colors">
                <FileText size={20} className="text-info" />
              </div>
              <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight">{apps?.total ?? 0}</p>
            <p className="text-xs text-text-muted font-medium mt-1">Total Applications</p>
          </div>

          <div className="card-interactive group" onClick={() => router.push("/dashboard/admin/applications")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue/8 flex items-center justify-center group-hover:bg-blue/12 transition-colors">
                <FileText size={20} className="text-blue-600" />
              </div>
              <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight">{apps?.submitted ?? 0}</p>
            <p className="text-xs text-text-muted font-medium mt-1">Submitted</p>
          </div>

          <div className="card-interactive group" onClick={() => router.push("/dashboard/admin/applications")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-warning/8 flex items-center justify-center group-hover:bg-warning/12 transition-colors">
                <Clock size={20} className="text-warning" />
              </div>
              <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight">{apps?.under_review ?? 0}</p>
            <p className="text-xs text-text-muted font-medium mt-1">Under Review</p>
          </div>

          <div className="card-interactive group" onClick={() => router.push("/dashboard/admin/applications")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-success/8 flex items-center justify-center group-hover:bg-success/12 transition-colors">
                <CheckCircle2 size={20} className="text-success" />
              </div>
              <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight">{(apps?.approved ?? 0) + (apps?.issued ?? 0)}</p>
            <p className="text-xs text-text-muted font-medium mt-1">Approved & Issued</p>
          </div>

          <div className="card-interactive group" onClick={() => router.push("/dashboard/admin/applications")}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-danger/8 flex items-center justify-center group-hover:bg-danger/12 transition-colors">
                <AlertTriangle size={20} className="text-danger" />
              </div>
              <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-bold text-text-primary tracking-tight">{(apps?.denied ?? 0) + (apps?.escalated ?? 0)}</p>
            <p className="text-xs text-text-muted font-medium mt-1">Denied & Escalated</p>
          </div>
        </div>
      )}

      {/* ── Payments & Users ── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Payments Card */}
        <div className="card-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-success/8 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Payments</h3>
              <p className="text-xs text-text-muted">Revenue overview</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-success mb-4">
            ${typeof payments?.total_collected === 'number' 
              ? payments.total_collected.toFixed(2) 
              : payments?.total_collected || "0.00"}
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">{payments?.completed ?? 0}</p>
              <p className="text-xs text-text-muted">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{payments?.pending ?? 0}</p>
              <p className="text-xs text-text-muted">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-danger">{payments?.failed ?? 0}</p>
              <p className="text-xs text-text-muted">Failed</p>
            </div>
          </div>
          {payments?.today_revenue && payments.today_revenue > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-text-muted">Today's Revenue</p>
              <p className="text-xl font-bold text-success">${Number(payments.today_revenue).toFixed(2)}</p>
              <p className="text-xs text-text-muted">{payments.today_count} transactions</p>
            </div>
          )}
        </div>

        {/* Users Card */}
        <div className="card-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-primary/8 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Users</h3>
              <p className="text-xs text-text-muted">System users overview</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-text-primary mb-4">
            {(users_data?.total_applicants ?? 0) + (users_data?.total_officers ?? 0)}
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">{users_data?.total_applicants ?? 0}</p>
              <p className="text-xs text-text-muted">Applicants</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">{users_data?.total_officers ?? 0}</p>
              <p className="text-xs text-text-muted">Officers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{users_data?.active_officers ?? 0}</p>
              <p className="text-xs text-text-muted">Active</p>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div className="card-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-accent/8 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">System Status</h3>
              <p className="text-xs text-text-muted">Overall health</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Applications Processing</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm font-medium text-success">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Payment Gateway</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm font-medium text-success">Operational</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Real-time Updates</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-warning'}`}></div>
                <span className={`text-sm font-medium ${isConnected ? 'text-success' : 'text-warning'}`}>
                  {isConnected ? 'Connected' : 'Polling'}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">Approval Rate</span>
                <span className="text-sm font-bold text-text-primary">
                  {apps?.total && apps.total > 0 
                    ? Math.round(((apps.approved ?? 0) + (apps.issued ?? 0)) / apps.total * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Quick Actions
      </h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => router.push("/dashboard/admin/users")}
          className="card hover:border-accent/30 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm">Manage Users</p>
              <p className="text-xs text-text-muted">Roles & permissions</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => router.push("/dashboard/admin/tier-rules")}
          className="card hover:border-accent/30 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm">Tier Rules</p>
              <p className="text-xs text-text-muted">Routing & SLA config</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => router.push("/dashboard/admin/reports")}
          className="card hover:border-accent/30 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-warning" />
            </div>
            <div>
              <p className="font-semibold text-text-primary text-sm">Reports</p>
              <p className="text-xs text-text-muted">Volumes, SLA & audit</p>
            </div>
          </div>
        </button>
      </div>

      {/* ── Financial Analytics ── */}
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 mt-8">
        Financial Analytics
      </h2>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Country */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Globe size={20} className="text-success" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Revenue by Country</h3>
                <p className="text-xs text-text-muted">Top revenue sources</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/admin/reports")}
            >
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {[
              { country: "United States", flag: "🇺🇸", revenue: 12500, count: 25 },
              { country: "United Kingdom", flag: "🇬🇧", revenue: 8900, count: 18 },
              { country: "Nigeria", flag: "🇳🇬", revenue: 6700, count: 34 },
              { country: "Germany", flag: "🇩🇪", revenue: 5400, count: 12 },
              { country: "India", flag: "🇮🇳", revenue: 4200, count: 21 },
            ].map((item) => (
              <div key={item.country} className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-dark transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{item.country}</p>
                    <p className="text-xs text-text-muted">{item.count} applications</p>
                  </div>
                </div>
                <p className="font-bold text-success">${item.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Visa Type */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <FileText size={20} className="text-info" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Revenue by Visa Type</h3>
                <p className="text-xs text-text-muted">Performance breakdown</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { type: "Tourism", revenue: 25000, count: 50, color: "bg-blue-500" },
              { type: "Business", revenue: 18000, count: 18, color: "bg-purple-500" },
              { type: "Student", revenue: 12000, count: 8, color: "bg-green-500" },
              { type: "Work", revenue: 8000, count: 4, color: "bg-orange-500" },
            ].map((item) => {
              const total = 63000;
              const percentage = ((item.revenue / total) * 100).toFixed(1);
              return (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-text-primary">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">${item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-text-muted">{percentage}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Visitor Analytics ── */}
      <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
        Visitor Analytics
      </h2>
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Visitors by Country */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Users size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Top Countries</h3>
                <p className="text-xs text-text-muted">Application volume</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/admin/reports")}
            >
              View All <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {[
              { country: "Nigeria", flag: "🇳🇬", total: 145, approved: 120, denied: 25 },
              { country: "United States", flag: "🇺🇸", total: 98, approved: 92, denied: 6 },
              { country: "United Kingdom", flag: "🇬🇧", total: 87, approved: 81, denied: 6 },
              { country: "India", flag: "🇮🇳", total: 76, approved: 68, denied: 8 },
              { country: "Germany", flag: "🇩🇪", total: 54, approved: 51, denied: 3 },
            ].map((item) => (
              <div key={item.country} className="p-3 bg-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.flag}</span>
                    <span className="font-medium text-text-primary text-sm">{item.country}</span>
                  </div>
                  <span className="text-sm font-bold text-text-primary">{item.total}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-success">{item.approved} approved</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-danger">{item.denied} denied</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Rates */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Approval Rates</h3>
                <p className="text-xs text-text-muted">Success by country</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { country: "Germany", flag: "🇩🇪", rate: 94.4, total: 54 },
              { country: "United States", flag: "🇺🇸", rate: 93.9, total: 98 },
              { country: "United Kingdom", flag: "🇬🇧", rate: 93.1, total: 87 },
              { country: "India", flag: "🇮🇳", rate: 89.5, total: 76 },
              { country: "Nigeria", flag: "🇳🇬", rate: 82.8, total: 145 },
            ].map((item) => (
              <div key={item.country}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="text-sm font-medium text-text-primary">{item.country}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">{item.rate}%</p>
                    <p className="text-xs text-text-muted">{item.total} total</p>
                  </div>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
