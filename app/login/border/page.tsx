"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Shield, Plane, Users } from "lucide-react";
import toast from "react-hot-toast";

const roleRedirect: Record<string, string> = {
  IMMIGRATION_OFFICER: "/dashboard/border",
  AIRLINE_STAFF: "/dashboard/airline",
  immigration_officer: "/dashboard/border",
  airline_staff: "/dashboard/airline",
};

export default function BorderLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Check if user is border control staff
      const borderRoles = ["IMMIGRATION_OFFICER", "AIRLINE_STAFF", "immigration_officer", "airline_staff"];
      if (!borderRoles.includes(user.role)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Access denied. This portal is for border control staff only.");
        return;
      }

      toast.success("Authentication successful");
      router.push(roleRedirect[user.role] || "/dashboard/border");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(error.response.data.errors)) {
          fieldErrors[key] = msgs[0];
        }
        setErrors(fieldErrors);
      } else {
        toast.error(error.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel – Border Control themed (Blue) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {/* Blue overlay for border control */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/95 via-blue-700/90 to-indigo-900/85 z-[1]" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="flex items-center gap-3 mb-20">
              <img src="/gis-logo.png" alt="Ghana Immigration Service" width={54} height={44} className="drop-shadow-lg" />
              <div>
                <p className="text-sm font-bold tracking-wide">Ghana Immigration Service</p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase">Border Control Portal</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4">
              Border Control
              <br />
              <span className="text-blue-300">Verification Portal</span>
            </h2>
            <div className="w-16 h-1 bg-blue-400 mb-6" />
            <p className="text-white/60 text-lg leading-relaxed max-w-md">
              Access the border verification system for immigration officers and airline staff.
              Verify travel authorizations and boarding clearances.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              {[
                { icon: <Shield size={14} />, text: "Secure Verification" },
                { icon: <Users size={14} />, text: "Immigration Officers" },
                { icon: <Plane size={14} />, text: "Airline Staff" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-blue-300">{item.icon}</span>
                  <span className="text-white/70 text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} Ghana Immigration Service &middot; Border Control Access
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Back to home
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-md mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/gis-logo.png" alt="Ghana Immigration Service" width={50} height={40} />
            <div>
              <p className="text-sm font-bold text-blue-700">Ghana Immigration Service</p>
              <p className="text-[10px] text-text-muted tracking-wider uppercase">Border Control</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Border Control Sign In
          </h1>
          <p className="text-text-secondary mb-8">
            Enter your credentials to access the border verification system
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {process.env.NODE_ENV === 'development' && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Quick Login - Border Staff</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEmail("immigration@test.com");
                      setPassword("password");
                    }}
                    className="text-xs"
                  >
                    Immigration Officer
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEmail("airline@test.com");
                      setPassword("password");
                    }}
                    className="text-xs"
                  >
                    Airline Staff
                  </Button>
                </div>
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="officer@immigration.gov.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full !bg-blue-600 hover:!bg-blue-700"
              size="lg"
            >
              Sign In to Border Control
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-muted text-center mb-3">Other portals</p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
              >
                Applicant Portal
              </Link>
              <Link
                href="/login/staff"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium hover:bg-teal-100 transition-colors"
              >
                GIS/MFA Staff
              </Link>
              <Link
                href="/login/admin"
                className="flex-1 text-center py-2 px-3 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

