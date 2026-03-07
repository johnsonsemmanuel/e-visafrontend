"use client";

import { X, Download, Printer, CheckCircle2, Shield, Fingerprint, Globe } from "lucide-react";
import { Button } from "./button";
import QRCode from "react-qr-code";

interface EVisaPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  data: {
    reference_number: string;
    full_name: string;
    passport_number: string;
    nationality: string;
    visa_type: string;
    arrival_date: string;
    duration_days: number;
    issued_at: string;
    valid_until: string;
    qr_code: string;
  } | null;
}

export function EVisaPreview({ isOpen, onClose, onDownload, data }: EVisaPreviewProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:block">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm print:hidden" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto print:max-w-none print:shadow-none print:rounded-none animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/80 hover:bg-white shadow-lg hover:shadow-xl transition-all print:hidden z-10 group"
        >
          <X size={18} className="text-slate-500 group-hover:text-slate-700" />
        </button>

        {/* Visa Card */}
        <div className="m-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#006B3F] via-[#005A34] to-[#004D2C] text-white p-6 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-white/5 rounded-full" />
            
            <div className="relative flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-3">
                  <span className="text-lg">🇬🇭</span>
                  <span>REPUBLIC OF GHANA</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight mb-1">Electronic Visa</h1>
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <Globe size={14} />
                  Ghana Immigration Service • Official Document
                </p>
              </div>
              <div className="text-right bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest text-white/70 mb-1">Reference No.</p>
                <p className="text-lg font-bold font-mono tracking-wider">{data.reference_number}</p>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={14} />
            </div>
            <span className="font-bold tracking-wide uppercase text-sm">Visa Approved & Valid for Entry</span>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Traveler Information */}
            <div className="mb-6">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-4 pb-2 border-b-2 border-slate-100">
                Traveler Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold mb-1">Full Name (as in passport)</p>
                  <p className="text-lg font-bold text-slate-800">{data.full_name}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Passport Number</p>
                  <p className="text-base font-bold text-slate-800 font-mono tracking-wider">{data.passport_number}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Nationality</p>
                  <p className="text-base font-bold text-slate-800">{data.nationality}</p>
                </div>
              </div>
            </div>

            {/* Visa Details */}
            <div className="mb-6">
              <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-4 pb-2 border-b-2 border-slate-100">
                Visa Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Visa Type</p>
                  <p className="text-base font-bold text-slate-800">{data.visa_type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Duration of Stay</p>
                  <p className="text-base font-bold text-slate-800">{data.duration_days} Days</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Date of Issue</p>
                  <p className="text-base font-bold text-slate-800">{data.issued_at}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Valid Until</p>
                  <p className="text-base font-bold text-emerald-600">{data.valid_until}</p>
                </div>
                <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Expected Arrival Date</p>
                  <p className="text-base font-bold text-slate-800">{data.arrival_date}</p>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 flex items-center gap-6">
              <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
                <QRCode value={data.qr_code} size={120} level="H" />
              </div>
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Fingerprint size={16} />
                  </div>
                  <span className="font-bold text-lg">Digital Verification</span>
                </div>
                <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                  Scan this QR code at any Ghana port of entry to instantly verify the authenticity of this electronic visa.
                </p>
                <div className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg font-mono text-sm">
                  {data.qr_code}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Verify online: <span className="text-emerald-400 font-semibold">verify.ghanaevisa.gov.gh</span>
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex gap-4">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-800 text-sm mb-1">Important Security Notice</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  This electronic visa must be printed and presented with your valid passport upon arrival. 
                  Tampering with or forging this document is a criminal offence under Ghanaian law.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#006B3F] to-[#004D2C] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                GH
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">Ghana Immigration Service</p>
                <p className="text-xs text-slate-400">Ministry of the Interior</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <p>Document generated electronically</p>
              <p>Valid without physical signature</p>
              <p>© {new Date().getFullYear()} Government of Ghana</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center p-4 print:hidden">
          <Button variant="secondary" leftIcon={<Printer size={16} />} onClick={handlePrint} className="shadow-lg">
            Print
          </Button>
          {onDownload && (
            <Button leftIcon={<Download size={16} />} onClick={onDownload} className="shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              Download PDF
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
