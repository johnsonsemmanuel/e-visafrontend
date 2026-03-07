"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CheckCircle2, XCircle, Shield, User, Plane, Calendar, Clock, AlertTriangle, Fingerprint } from "lucide-react";
import Link from "next/link";


interface VerificationResult {
  valid: boolean;
  application?: {
    reference_number: string;
    full_name: string;
    passport_number: string;
    nationality: string;
    visa_type: string;
    arrival_date: string;
    duration_days: number;
    issued_at: string;
    valid_until: string;
    status: string;
  };
  message?: string;
}

export default function VerifyVisaPage() {
  const params = useParams();
  const code = params.code as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["verify-visa", code],
    queryFn: () => api.get<VerificationResult>(`/verify/${code}`).then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-4">
            <span className="text-2xl">🇬🇭</span>
            <span className="text-white font-semibold tracking-wide">Ghana Immigration Service</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">eVisa Verification</h1>
          <p className="text-slate-400">Official document authentication system</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Verifying document...</p>
              <p className="text-slate-400 text-sm mt-1">Please wait while we authenticate</p>
            </div>
          ) : error || !data?.valid ? (
            <>
              {/* Invalid Status Banner */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircle size={18} />
                </div>
                <span className="font-bold tracking-wide uppercase">Verification Failed</span>
              </div>
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={40} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid or Expired Document</h2>
                <p className="text-slate-500 mb-6">
                  {data?.message || "This eVisa could not be verified. It may be invalid, expired, or tampered with."}
                </p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left">
                  <p className="text-sm text-red-700">
                    <strong>Border Officer Action:</strong> Please detain the traveler for further verification and contact the Ghana Immigration Service headquarters.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Valid Status Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <span className="font-bold tracking-wide uppercase">Document Verified</span>
              </div>

              <div className="p-6">
                {/* Verification Badge */}
                <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-700 font-bold text-lg">Authentic eVisa</p>
                    <p className="text-emerald-600 text-sm">Entry authorized for Ghana</p>
                  </div>
                </div>

                {/* Reference */}
                <div className="text-center mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">Reference Number</p>
                  <p className="text-2xl font-bold font-mono text-slate-800 tracking-wider">{data.application?.reference_number}</p>
                </div>

                {/* Traveler Info */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold pb-2 border-b-2 border-slate-100">
                    Traveler Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard 
                      icon={<User size={16} />}
                      label="Full Name"
                      value={data.application?.full_name || ""}
                      fullWidth
                      highlight
                    />
                    <InfoCard 
                      icon={<Fingerprint size={16} />}
                      label="Passport Number"
                      value={data.application?.passport_number || ""}
                      mono
                    />
                    <InfoCard 
                      label="Nationality"
                      value={data.application?.nationality || ""}
                    />
                  </div>
                </div>

                {/* Visa Details */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold pb-2 border-b-2 border-slate-100">
                    Visa Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard 
                      label="Visa Type"
                      value={data.application?.visa_type || ""}
                    />
                    <InfoCard 
                      icon={<Clock size={16} />}
                      label="Duration"
                      value={`${data.application?.duration_days} Days`}
                    />
                    <InfoCard 
                      icon={<Calendar size={16} />}
                      label="Valid Until"
                      value={data.application?.valid_until || ""}
                      highlight
                    />
                    <InfoCard 
                      icon={<Plane size={16} />}
                      label="Arrival Date"
                      value={data.application?.arrival_date || ""}
                    />
                  </div>
                </div>

                {/* Action Notice */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm text-emerald-700">
                    <strong>✓ Entry Authorized:</strong> This traveler has a valid electronic visa. Please verify passport details match the information above before granting entry.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#006B3F] to-[#004D2C] rounded-xl flex items-center justify-center text-white font-bold">
                GH
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">Ghana Immigration Service</p>
                <p className="text-xs text-slate-400">Border Control System</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <p>Verified: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Return to Ghana eVisa Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ 
  icon, 
  label, 
  value, 
  fullWidth, 
  highlight, 
  mono 
}: { 
  icon?: React.ReactNode;
  label: string; 
  value: string; 
  fullWidth?: boolean;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={`${fullWidth ? 'col-span-2' : ''} ${highlight ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} rounded-xl p-3 border`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-slate-400">{icon}</span>}
        <p className={`text-[10px] uppercase tracking-wider font-semibold ${highlight ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</p>
      </div>
      <p className={`text-sm font-bold ${highlight ? 'text-emerald-700' : 'text-slate-800'} ${mono ? 'font-mono tracking-wider' : ''}`}>{value}</p>
    </div>
  );
}
