"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Users, CheckCircle2, AlertTriangle, Plane, Activity,
  Shield, BarChart3, TrendingUp, RefreshCw, Eye,
  Wifi, WifiOff, Timer, Target, AlertOctagon, Download,
} from "lucide-react";

interface ShiftStats {
  entries_processed: number;
  exits_processed: number;
  secondary_referrals: number;
  denials: number;
  avg_processing_time: number;
  sla_compliance: number;
  watchlist_hits: number;
  overrides: number;
}

interface LaneStatus {
  id: string;
  name: string;
  officer: string;
  status: "online" | "offline" | "busy";
  cases_processed: number;
  avg_time: number;
}

interface FlightArrival {
  flight_number: string;
  airline: string;
  origin: string;
  eta: string;
  passengers: number;
  processed: number;
  status: "arrived" | "processing" | "cleared" | "pending";
}

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(","), ...rows.map(r => r.map(escape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BorderOperationsPage() {
  const [selectedPort, setSelectedPort] = useState("KIA");
  const [timeRange, setTimeRange] = useState<"hourly" | "daily">("daily");

  const { data: stats } = useQuery({
    queryKey: ["border-ops-stats", selectedPort],
    queryFn: () => api.get(`/border/statistics?port=${selectedPort}`).then((r) => r.data),
    refetchInterval: 15000,
  });

  // Mock data for demonstration
  const shiftStats: ShiftStats = {
    entries_processed: stats?.entries ?? 247,
    exits_processed: stats?.exits ?? 189,
    secondary_referrals: stats?.by_status?.secondary_inspection ?? 12,
    denials: stats?.by_status?.invalid ?? 3,
    avg_processing_time: 12.4,
    sla_compliance: 94.2,
    watchlist_hits: 2,
    overrides: 1,
  };

  const lanes: LaneStatus[] = [
    { id: "L1", name: "Lane 1", officer: "Kwame Asante", status: "online", cases_processed: 45, avg_time: 11.2 },
    { id: "L2", name: "Lane 2", officer: "Ama Mensah", status: "online", cases_processed: 52, avg_time: 10.8 },
    { id: "L3", name: "Lane 3", officer: "Kofi Boateng", status: "busy", cases_processed: 38, avg_time: 14.5 },
    { id: "L4", name: "Lane 4", officer: "Akua Darko", status: "offline", cases_processed: 0, avg_time: 0 },
    { id: "L5", name: "Lane 5 (Secondary)", officer: "Yaw Owusu", status: "online", cases_processed: 12, avg_time: 45.2 },
  ];

  const flights: FlightArrival[] = [
    { flight_number: "KQ507", airline: "Kenya Airways", origin: "NBO", eta: "14:30", passengers: 156, processed: 142, status: "processing" },
    { flight_number: "ET920", airline: "Ethiopian", origin: "ADD", eta: "15:15", passengers: 189, processed: 0, status: "pending" },
    { flight_number: "BA078", airline: "British Airways", origin: "LHR", eta: "13:45", passengers: 234, processed: 234, status: "cleared" },
    { flight_number: "EK787", airline: "Emirates", origin: "DXB", eta: "16:00", passengers: 298, processed: 0, status: "pending" },
  ];

  const incidents = [
    { id: 1, type: "watchlist", traveler: "J*** D***", flight: "KQ507", time: "14:42", status: "pending" },
    { id: 2, type: "override", traveler: "M*** S***", flight: "BA078", time: "13:58", status: "resolved" },
  ];

  return (
    <DashboardShell
      title="Border Operations Dashboard"
      description="Supervisor View — Shift Management & Monitoring"
      actions={
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as "hourly" | "daily")}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium transition-colors duration-150 ease-out"
          >
            <option value="daily">Daily View</option>
            <option value="hourly">Hourly View</option>
          </select>
          <select
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium transition-colors duration-150 ease-out"
          >
            <option value="KIA">Kotoka International Airport</option>
            <option value="ACC">Tema Port</option>
            <option value="AFL">Aflao Border</option>
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              const rows: string[][] = [];
              lanes.forEach((l) =>
                rows.push(["Lane", l.name, l.officer, l.status, String(l.cases_processed), `${l.avg_time}s`])
              );
              flights.forEach((f) =>
                rows.push(["Flight", f.flight_number, `${f.airline} (${f.origin})`, f.status, `${f.processed}/${f.passengers}`, f.eta])
              );
              rows.push(["Summary", "Entries", String(shiftStats.entries_processed), "", "", ""]);
              rows.push(["Summary", "Exits", String(shiftStats.exits_processed), "", "", ""]);
              rows.push(["Summary", "SLA Compliance", `${shiftStats.sla_compliance}%`, "", "", ""]);
              rows.push(["Summary", "Watchlist Hits", String(shiftStats.watchlist_hits), "", "", ""]);
              downloadCsv(
                `border_operations_${selectedPort}_${today}.csv`,
                ["Category", "Item", "Detail", "Status", "Count", "Time"],
                rows
              );
            }}
          >
            <Download size={16} className="mr-1" /> Export Report
          </Button>
        </div>
      }
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
              <TrendingUp size={12} className="inline mr-1" />+8%
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{shiftStats.entries_processed}</p>
          <p className="text-sm font-semibold text-emerald-600">Entries ({timeRange === "daily" ? "Today" : "This Hour"})</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
              <Timer size={20} className="text-blue-600" />
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${shiftStats.avg_processing_time < 15 ? "text-emerald-600 bg-emerald-100" : "text-amber-600 bg-amber-100"}`}>
              {shiftStats.avg_processing_time < 15 ? "✓ SLA" : "⚠ Slow"}
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{shiftStats.avg_processing_time}s</p>
          <p className="text-sm font-semibold text-blue-600">Avg Process Time</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{shiftStats.secondary_referrals}</p>
          <p className="text-sm font-semibold text-amber-600">Secondary Queue</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{shiftStats.watchlist_hits}</p>
          <p className="text-sm font-semibold text-red-600">Watchlist Hits</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Lane Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Lane Status</h3>
                <p className="text-xs text-slate-500">Real-time officer activity</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <RefreshCw size={14} className="mr-1" /> Refresh
            </Button>
          </div>

          <div className="space-y-2">
            {lanes.map((lane) => (
              <div key={lane.id} className={`flex items-center justify-between p-4 rounded-xl border ${
                lane.status === "online" ? "bg-emerald-50/50 border-emerald-100" :
                lane.status === "busy" ? "bg-amber-50/50 border-amber-100" :
                "bg-slate-50 border-slate-100"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    lane.status === "online" ? "bg-emerald-500 animate-pulse" :
                    lane.status === "busy" ? "bg-amber-500 animate-pulse" :
                    "bg-slate-300"
                  }`} />
                  <div>
                    <p className="font-bold text-slate-800">{lane.name}</p>
                    <p className="text-xs text-slate-500">{lane.officer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{lane.cases_processed}</p>
                    <p className="text-xs text-slate-500">Processed</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${lane.avg_time < 15 ? "text-emerald-600" : lane.avg_time < 30 ? "text-amber-600" : "text-red-600"}`}>
                      {lane.avg_time > 0 ? `${lane.avg_time}s` : "-"}
                    </p>
                    <p className="text-xs text-slate-500">Avg Time</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lane.status === "online" ? "bg-emerald-100 text-emerald-700" :
                    lane.status === "busy" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {lane.status === "online" ? <><Wifi size={12} className="inline mr-1" />Online</> :
                     lane.status === "busy" ? <><Activity size={12} className="inline mr-1" />Busy</> :
                     <><WifiOff size={12} className="inline mr-1" />Offline</>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl flex items-center justify-center">
                <Target size={20} className="text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">SLA Compliance</h3>
                <p className="text-xs text-slate-500">Target: &lt;15s per traveler</p>
              </div>
            </div>
            <div className="text-center mb-4">
              <p className={`text-4xl font-bold ${shiftStats.sla_compliance >= 90 ? "text-emerald-600" : shiftStats.sla_compliance >= 75 ? "text-amber-600" : "text-red-600"}`}>
                {shiftStats.sla_compliance}%
              </p>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${shiftStats.sla_compliance >= 90 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : shiftStats.sla_compliance >= 75 ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-red-400 to-red-500"}`}
                style={{ width: `${shiftStats.sla_compliance}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <BarChart3 size={24} className="text-white/80" />
              <h3 className="text-lg font-bold">Shift Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{shiftStats.entries_processed + shiftStats.exits_processed}</p>
                <p className="text-xs text-white/70">Total Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{shiftStats.denials}</p>
                <p className="text-xs text-white/70">Denials</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{shiftStats.overrides}</p>
                <p className="text-xs text-white/70">Overrides</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{lanes.filter(l => l.status !== "offline").length}/{lanes.length}</p>
                <p className="text-xs text-white/70">Lanes Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Arrivals & Incidents */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Flight Arrivals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                <Plane size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Flight Arrivals</h3>
                <p className="text-xs text-slate-500">Today&apos;s manifest</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {flights.map((flight) => (
              <div key={flight.flight_number} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Plane size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{flight.flight_number}</p>
                    <p className="text-xs text-slate-500">{flight.airline} • {flight.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">{flight.processed}/{flight.passengers}</p>
                    <p className="text-xs text-slate-500">Processed</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    flight.status === "cleared" ? "bg-emerald-100 text-emerald-700" :
                    flight.status === "processing" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                    {flight.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents & Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center">
                <AlertOctagon size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Incidents & Alerts</h3>
                <p className="text-xs text-slate-500">Requires supervisor attention</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
              {incidents.filter(i => i.status === "pending").length} Pending
            </span>
          </div>

          <div className="space-y-2">
            {incidents.map((incident) => (
              <div key={incident.id} className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                incident.status === "pending" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    incident.type === "watchlist" ? "bg-red-100" : "bg-amber-100"
                  }`}>
                    {incident.type === "watchlist" ? (
                      <Shield size={18} className="text-red-600" />
                    ) : (
                      <AlertTriangle size={18} className="text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{incident.type === "watchlist" ? "Watchlist Hit" : "Override Request"}</p>
                    <p className="text-xs text-slate-500">{incident.traveler} • {incident.flight} • {incident.time}</p>
                  </div>
                </div>
                {incident.status === "pending" ? (
                  <Button size="sm" variant="danger">
                    <Eye size={14} className="mr-1" /> Review
                  </Button>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Resolved
                  </span>
                )}
              </div>
            ))}

            {incidents.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-sm text-slate-500">No pending incidents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
