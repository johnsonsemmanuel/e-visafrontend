"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode, Search, Plane, CheckCircle2, AlertTriangle, XCircle,
  Users, Activity, FileText, Clock,
} from "lucide-react";

interface VerificationResult {
  valid: boolean;
  status: string;
  message: string;
  passenger?: {
    name: string;
    nationality: string;
    passport_number_masked: string;
    visa_type?: string;
    entry_type: string;
    valid_until: string;
  };
  alerts?: Array<{ type: string; message: string }>;
}

export default function AirlineDashboardPage() {
  const router = useRouter();
  const [searchType, setSearchType] = useState<"qr" | "manual">("qr");
  const [qrData, setQrData] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyQR = async () => {
    if (!qrData.trim()) return;
    setLoading(true);
    try {
      const response = await api.post("/airline/verify-qr", { qr_code: qrData });
      setVerificationResult(response.data);
    } catch (error: any) {
      setVerificationResult({
        valid: false,
        status: "error",
        message: error.response?.data?.message || "Verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyManual = async () => {
    if (!passportNumber.trim() || !nationality.trim()) return;
    setLoading(true);
    try {
      const response = await api.post("/airline/verify-passenger", {
        passport_number: passportNumber,
        nationality: nationality,
        reference_number: referenceNumber || undefined,
      });
      setVerificationResult(response.data);
    } catch (error: any) {
      setVerificationResult({
        valid: false,
        status: "error",
        message: error.response?.data?.message || "Verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQrData("");
    setPassportNumber("");
    setNationality("");
    setReferenceNumber("");
    setVerificationResult(null);
  };

  return (
    <DashboardShell
      title="Airline Verification Portal"
      description="Verify passenger travel authorization for Ghana"
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Users size={20} className="text-info" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">-</p>
          <p className="text-sm text-text-muted">Verified Today</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-success" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">-</p>
          <p className="text-sm text-text-muted">Approved</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-warning" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">-</p>
          <p className="text-sm text-text-muted">Alerts</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Activity size={20} className="text-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">Online</p>
          <p className="text-sm text-text-muted">System Status</p>
        </div>
      </div>

      {/* Verification Panel */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Verification Form */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Verify Passenger</h2>

          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={searchType === "qr" ? "primary" : "secondary"}
              onClick={() => {
                setSearchType("qr");
                resetForm();
              }}
              leftIcon={<QrCode size={16} />}
              className="flex-1"
            >
              QR Code
            </Button>
            <Button
              variant={searchType === "manual" ? "primary" : "secondary"}
              onClick={() => {
                setSearchType("manual");
                resetForm();
              }}
              leftIcon={<Search size={16} />}
              className="flex-1"
            >
              Manual Search
            </Button>
          </div>

          {/* QR Code Scan */}
          {searchType === "qr" && (
            <div className="space-y-4">
              <Input
                label="QR Code Data"
                placeholder="Scan or paste QR code data"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
              />
              <Button
                onClick={handleVerifyQR}
                loading={loading}
                disabled={!qrData.trim()}
                className="w-full"
              >
                Verify QR Code
              </Button>
            </div>
          )}

          {/* Manual Search */}
          {searchType === "manual" && (
            <div className="space-y-4">
              <Input
                label="Passport Number"
                placeholder="Enter passport number"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                required
              />
              <Input
                label="Nationality"
                placeholder="e.g., US, GB, NG"
                value={nationality}
                onChange={(e) => setNationality(e.target.value.toUpperCase())}
                maxLength={2}
                required
              />
              <Input
                label="Reference Number (Optional)"
                placeholder="eVisa or ETA reference"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
              />
              <Button
                onClick={handleVerifyManual}
                loading={loading}
                disabled={!passportNumber.trim() || !nationality.trim()}
                className="w-full"
              >
                Verify Passenger
              </Button>
            </div>
          )}

          {verificationResult && (
            <Button
              variant="secondary"
              onClick={resetForm}
              className="w-full mt-4"
            >
              Clear & New Search
            </Button>
          )}
        </div>

        {/* Right: Verification Result */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Verification Result</h2>

          {!verificationResult ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plane size={32} className="text-text-muted" />
              </div>
              <p className="text-text-muted">
                Enter passenger details to verify travel authorization
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-xl border-2 ${
                  verificationResult.valid
                    ? "bg-success/5 border-success/20"
                    : "bg-danger/5 border-danger/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {verificationResult.valid ? (
                    <CheckCircle2 size={32} className="text-success" />
                  ) : (
                    <XCircle size={32} className="text-danger" />
                  )}
                  <div>
                    <p className="font-bold text-text-primary">
                      {verificationResult.valid ? "Authorized to Board" : "Not Authorized"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              {verificationResult.passenger && (
                <div className="bg-surface rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-text-primary">Passenger Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Name:</span>
                      <span className="font-medium text-text-primary">
                        {verificationResult.passenger.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Nationality:</span>
                      <span className="font-medium text-text-primary">
                        {verificationResult.passenger.nationality}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Passport:</span>
                      <span className="font-mono text-text-primary">
                        {verificationResult.passenger.passport_number_masked}
                      </span>
                    </div>
                    {verificationResult.passenger.visa_type && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Visa Type:</span>
                        <span className="font-medium text-text-primary">
                          {verificationResult.passenger.visa_type}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Entry Type:</span>
                      <span className="font-medium text-text-primary capitalize">
                        {verificationResult.passenger.entry_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Valid Until:</span>
                      <span className="font-medium text-text-primary">
                        {new Date(verificationResult.passenger.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Alerts */}
              {verificationResult.alerts && verificationResult.alerts.length > 0 && (
                <div className="space-y-2">
                  {verificationResult.alerts.map((alert, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{alert.type}</p>
                        <p className="text-xs text-text-secondary">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-6 mt-8">
        <h3 className="font-bold text-text-primary mb-4">Verification Instructions</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-text-primary mb-2">QR Code Verification</h4>
            <ul className="space-y-1 text-text-secondary">
              <li>• Scan passenger's eVisa QR code</li>
              <li>• System verifies in real-time</li>
              <li>• Fastest verification method</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-2">Manual Verification</h4>
            <ul className="space-y-1 text-text-secondary">
              <li>• Enter passport number and nationality</li>
              <li>• Optional: Add reference number for faster lookup</li>
              <li>• Use when QR code is unavailable</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
