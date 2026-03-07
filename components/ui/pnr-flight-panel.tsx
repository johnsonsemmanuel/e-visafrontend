"use client";

import { Plane, Clock, Users, MapPin, CheckCircle2, AlertTriangle, Luggage } from "lucide-react";

interface FlightInfo {
  flight_number: string;
  airline: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  status: "on_time" | "delayed" | "arrived" | "boarding";
  passenger_count?: number;
  gate?: string;
}

interface PnrData {
  pnr_code: string;
  passenger_name: string;
  seat_number?: string;
  booking_class?: string;
  checked_bags?: number;
  flight: FlightInfo;
  manifest_match: boolean;
  boarding_status: "not_boarded" | "boarded" | "no_show";
}

interface PnrFlightPanelProps {
  data?: PnrData;
  compact?: boolean;
}

export function PnrFlightPanel({ data, compact = false }: PnrFlightPanelProps) {
  // Default mock data
  const pnr: PnrData = data || {
    pnr_code: "ABC123",
    passenger_name: "John Doe",
    seat_number: "12A",
    booking_class: "Economy",
    checked_bags: 1,
    flight: {
      flight_number: "KQ507",
      airline: "Kenya Airways",
      departure_airport: "NBO",
      arrival_airport: "ACC",
      departure_time: new Date().toISOString(),
      arrival_time: new Date().toISOString(),
      status: "arrived",
      passenger_count: 156,
      gate: "B12",
    },
    manifest_match: true,
    boarding_status: "boarded",
  };

  const statusColors = {
    on_time: "bg-emerald-100 text-emerald-700",
    delayed: "bg-amber-100 text-amber-700",
    arrived: "bg-blue-100 text-blue-700",
    boarding: "bg-violet-100 text-violet-700",
  };

  if (compact) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plane size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{pnr.flight.flight_number}</p>
              <p className="text-xs text-slate-500">{pnr.flight.airline}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[pnr.flight.status]}`}>
              {pnr.flight.status.replace("_", " ").toUpperCase()}
            </span>
            {pnr.manifest_match ? (
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 justify-end">
                <CheckCircle2 size={12} /> Manifest Match
              </p>
            ) : (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 justify-end">
                <AlertTriangle size={12} /> Mismatch
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
            <Plane size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Flight & PNR Data</h3>
            <p className="text-xs text-slate-500">API/PNR Integration</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColors[pnr.flight.status]}`}>
          {pnr.flight.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Flight Info */}
      <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{pnr.flight.departure_airport}</p>
            <p className="text-xs text-slate-500">Departure</p>
          </div>
          <div className="flex-1 px-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-slate-300" />
              <Plane size={20} className="text-blue-500 rotate-90" />
              <div className="h-px flex-1 bg-slate-300" />
            </div>
            <p className="text-center text-xs text-slate-500 mt-1">{pnr.flight.flight_number}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{pnr.flight.arrival_airport}</p>
            <p className="text-xs text-slate-500">Arrival</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-500">Airline</p>
            <p className="text-sm font-semibold text-slate-700">{pnr.flight.airline}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Gate</p>
            <p className="text-sm font-semibold text-slate-700">{pnr.flight.gate || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Passengers</p>
            <p className="text-sm font-semibold text-slate-700">{pnr.flight.passenger_count || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* PNR Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500">PNR Code</p>
          <p className="text-lg font-mono font-bold text-slate-800">{pnr.pnr_code}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500">Seat</p>
          <p className="text-lg font-bold text-slate-800">{pnr.seat_number || "N/A"}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs text-slate-500">Class</p>
          <p className="text-sm font-semibold text-slate-700">{pnr.booking_class || "N/A"}</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Luggage size={16} className="text-slate-400" />
          <div>
            <p className="text-xs text-slate-500">Bags</p>
            <p className="text-sm font-semibold text-slate-700">{pnr.checked_bags ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Manifest Match Status */}
      <div className={`p-4 rounded-xl border-2 ${pnr.manifest_match ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {pnr.manifest_match ? (
              <CheckCircle2 size={24} className="text-emerald-600" />
            ) : (
              <AlertTriangle size={24} className="text-amber-600" />
            )}
            <div>
              <p className={`font-bold ${pnr.manifest_match ? "text-emerald-700" : "text-amber-700"}`}>
                {pnr.manifest_match ? "Manifest Match Confirmed" : "Manifest Mismatch Detected"}
              </p>
              <p className="text-xs text-slate-500">
                Boarding: {pnr.boarding_status.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
