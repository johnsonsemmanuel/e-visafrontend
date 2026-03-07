"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { ArrowLeft, Shield, Clock, Globe2 } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    locale: "en" | "fr";
  }>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    locale: "en",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      toast.success("Registration successful");
      router.push("/dashboard/applicant");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (error.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(error.response.data.errors)) {
          fieldErrors[key] = msgs[0];
        }
        setErrors(fieldErrors);
      } else {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel – Photo with overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-black/70 z-[1]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="flex items-center gap-3 mb-20">
              <img src="/gis-logo.png" alt="Ghana Immigration Service" width={54} height={44} className="drop-shadow-lg" />
              <div>
                <p className="text-sm font-bold tracking-wide">Republic of Ghana</p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase">Electronic Visa Portal</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Electronic Visa
              <br />
              <span className="gold-accent">Application Registration</span>
            </h2>
            <div className="divider-gold mb-6" />
            <p className="text-white/50 text-lg leading-relaxed max-w-md">
              Register an account to begin a Tourism or Business visa application
              to the Republic of Ghana. The application process takes approximately
              15 minutes.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              {[
                { icon: <Shield size={14} />, text: "Secure & Encrypted" },
                { icon: <Clock size={14} />, text: "72-Hour Processing" },
                { icon: <Globe2 size={14} />, text: "24/7 Available" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-gold">{item.icon}</span>
                  <span className="text-white/70 text-xs font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} Republic of Ghana &middot; Ghana Immigration Service
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
              <p className="text-sm font-bold text-primary">Republic of Ghana</p>
              <p className="text-[10px] text-text-muted tracking-wider uppercase">e-Visa Portal</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Account Registration
          </h1>
          <p className="text-text-secondary mb-8">
            Complete the form below to create an account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Other Names"
                placeholder="Given name(s)"
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                error={errors.first_name}
                required
              />
              <Input
                label="Surname"
                placeholder="Family name"
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                error={errors.last_name}
                required
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Telephone Number"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
              hint="Optional"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              error={errors.password}
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={form.password_confirmation}
              onChange={(e) => set("password_confirmation", e.target.value)}
              error={errors.password_confirmation}
              required
            />
            <Select
              label="Preferred Language"
              value={form.locale}
              onChange={(e) => set("locale", e.target.value)}
              options={[
                { value: "en", label: "English" },
                { value: "fr", label: "Français" },
              ]}
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Register Account
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-accent font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
