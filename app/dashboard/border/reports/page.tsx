"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Plane,
  Shield,
  TrendingUp,
  AlertTriangle,
  Users,
  AlertOctagon,
  Download,
  BarChart3,
  Clock,
} from "lucide-react";

interface ArrivalsReport {
  total_arrivals: number;
  by_hour: Record<string, number>;
  by_flight: Array<{ flight_number: string; airline: string; count: number }>;
  by_port: Record<string, number>;
  peak_hour: string | null;
}

interface OutcomesReport {
  total: number;
  by_status: Record<string, number>;
  rates: { admit: number; secondary: number; deny: number };
}

interface AlertsReport {
  total_alerts: number;
  watchlist_hits: number;
  fraud_flags: number;
  alerts: Array<{ id: number; traveler_name: string; port: string; notes: string; time: string }>;
}

interface ProductivityReport {
  total_cases: number;
  officers_active: number;
  avg_per_officer: number;
  by_officer: Array<{ officer_id: number; officer_name: string; cases_processed: number }>;
}

interface ExceptionsReport {
  total_overrides: number;
  system_downtime: number;
  offline_usage: number;
  overrides: Array<{ id: number; traveler_name: string; officer: string; notes: string; time: string }>;
}

export default function BorderReportsPage() {
  const [selectedPort, setSelectedPort] = useState("KIA");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: arrivals } = useQuery({
    queryKey: ["border-report-arrivals", selectedPort, selectedDate],
    queryFn: () => api.get<ArrivalsReport>(`/border/reports/arrivals?port=${selectedPort}&date=${selectedDate}`).then((r) => r.data),
  });

  const { data: outcomes } = useQuery({
    queryKey: ["border-report-outcomes", selectedPort, selectedDate],
    queryFn: () => api.get<OutcomesReport>(`/border/reports/outcomes?port=${selectedPort}&start_date=${selectedDate}&end_date=${selectedDate}`).then((r) => r.data),
  });

  const { data: alerts } = useQuery({
    queryKey: ["border-report-alerts", selectedPort, selectedDate],
    queryFn: () => api.get<AlertsReport>(`/border/reports/alerts?port=${selectedPort}&date=${selectedDate}`).then((r) => r.data),
  });

  const { data: productivity } = useQuery({
    queryKey: ["border-report-productivity", selectedPort, selectedDate],
    queryFn: () => api.get<ProductivityReport>(`/border/reports/productivity?port=${selectedPort}&date=${selectedDate}`).then((r) => r.data),
  });

  const { data: exceptions } = useQuery({
    queryKey: ["border-report-exceptions", selectedPort, selectedDate],
    queryFn: () => api.get<ExceptionsReport>(`/border/reports/exceptions?port=${selectedPort}&date=${selectedDate}`).then((r) => r.data),
  });

  return (
    <DashboardShell
      title="Border HQ Reports"
      description="Operational intelligence and compliance reporting"
      actions={
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm transition-colors duration-150 ease-out"
          />
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm transition-colors duration-150 ease-out"
          >
            <option value="KIA">KIA</option>
            <option value="ACC">Tema</option>
            <option value="AFL">Aflao</option>
            <option value="ELB">Elubo</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download size={14} className="mr-1" /> Export
          </Button>
        </div>
      }
    >
      {/* Report KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
          <Plane size={18} className="text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{arrivals?.total_arrivals ?? 0}</p>
          <p className="text-xs font-semibold text-blue-600">Arrivals</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4">
          <TrendingUp size={18} className="text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{outcomes?.rates.admit ?? 0}%</p>
          <p className="text-xs font-semibold text-emerald-600">Admit Rate</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-4">
          <AlertTriangle size={18} className="text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{alerts?.watchlist_hits ?? 0}</p>
          <p className="text-xs font-semibold text-amber-600">Watchlist Hits</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 p-4">
          <Users size={18} className="text-violet-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{productivity?.officers_active ?? 0}</p>
          <p className="text-xs font-semibold text-violet-600">Officers Active</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4">
          <AlertOctagon size={18} className="text-red-600 mb-2" />
          <p className="text-2xl font-bold text-slate-800">{exceptions?.total_overrides ?? 0}</p>
          <p className="text-xs font-semibold text-red-600">Overrides</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Arrivals by Flight */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Plane size={18} className="text-slate-500" />
            <h3 className="text-lg font-bold text-slate-800">Arrivals by Flight</h3>
          </div>
          <div className="space-y-2">
            {arrivals?.by_flight?.slice(0, 8).map((flight) => (
              <div key={flight.flight_number} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">{flight.flight_number}</p>
                  <p className="text-xs text-slate-500">{flight.airline}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">{flight.count}</span>
              </div>
            ))}
            {(!arrivals?.by_flight || arrivals.by_flight.length === 0) && (
              <p className="text-sm text-slate-500">No flight data for selected date.</p>
            )}
          </div>
        </div>

        {/* Entry Outcomes */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-slate-500" />
            <h3 className="text-lg font-bold text-slate-800">Entry Outcomes</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Admit", value: outcomes?.rates.admit ?? 0, color: "bg-emerald-500" },
              { label: "Secondary", value: outcomes?.rates.secondary ?? 0, color: "bg-amber-500" },
              { label: "Deny", value: outcomes?.rates.deny ?? 0, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${Math.min(100, item.value)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alerts and Hits */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-slate-500" />
            <h3 className="text-lg font-bold text-slate-800">Alerts & Hits</h3>
          </div>
          <div className="space-y-2">
            {alerts?.alerts?.slice(0, 6).map((alert) => (
              <div key={alert.id} className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm font-semibold text-red-700">{alert.traveler_name}</p>
                <p className="text-xs text-red-600">{alert.port} • {alert.time}</p>
                <p className="text-xs text-red-500 mt-1">{alert.notes}</p>
              </div>
            ))}
            {(!alerts?.alerts || alerts.alerts.length === 0) && (
              <p className="text-sm text-slate-500">No alerts for selected date.</p>
            )}
          </div>
        </div>

        {/* Officer Productivity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-slate-500" />
            <h3 className="text-lg font-bold text-slate-800">Officer Productivity</h3>
          </div>
          <div className="space-y-2">
            {productivity?.by_officer?.slice(0, 8).map((officer) => (
              <div key={officer.officer_id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{officer.officer_name}</span>
                <span className="text-sm font-bold text-violet-600">{officer.cases_processed}</span>
              </div>
            ))}
            {(!productivity?.by_officer || productivity.by_officer.length === 0) && (
              <p className="text-sm text-slate-500">No productivity records for selected date.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
