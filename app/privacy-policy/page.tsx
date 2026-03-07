"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🇬🇭</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GH-eVISA</h1>
              <p className="text-xs text-gray-500">Privacy Policy</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-500">Last updated: March 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Introduction</h2>
            <p>
              The Ghana Immigration Service (&quot;GIS&quot;) and the Ministry of Foreign Affairs (&quot;MFA&quot;) are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the GH-eVISA electronic visa application system.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect the following personal information when you apply for an eVisa:</p>
            <ul>
              <li>Full name (as it appears on your passport)</li>
              <li>Date of birth</li>
              <li>Passport number and expiry date</li>
              <li>Nationality</li>
              <li>Contact information (email address, phone number)</li>
              <li>Travel details (intended arrival date, duration of stay, purpose of visit)</li>
              <li>Accommodation address in Ghana</li>
              <li>Passport photograph</li>
              <li>Supporting documents as required by visa type</li>
            </ul>

            <h3>2.2 Payment Information</h3>
            <p>
              Payment processing is handled by third-party payment providers (Paystack, Stripe). We do not store your full credit card details. We only retain transaction references for record-keeping purposes.
            </p>

            <h3>2.3 Technical Information</h3>
            <p>We automatically collect:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Access times and dates</li>
              <li>Pages viewed</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Process your visa application</li>
              <li>Verify your identity and travel documents</li>
              <li>Conduct security screening</li>
              <li>Communicate with you about your application status</li>
              <li>Generate your electronic visa document</li>
              <li>Comply with legal obligations</li>
              <li>Improve our services</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All personal data is encrypted at rest using AES-256 encryption</li>
              <li><strong>Secure Transmission:</strong> All data is transmitted over HTTPS/TLS</li>
              <li><strong>Access Controls:</strong> Role-based access ensures only authorized personnel can view your data</li>
              <li><strong>Audit Logging:</strong> All access to personal data is logged for security purposes</li>
              <li><strong>Regular Security Audits:</strong> We conduct regular security assessments</li>
            </ul>

            <h2>5. Data Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Government Agencies:</strong> Ghana Immigration Service, Ministry of Foreign Affairs, and other relevant government bodies</li>
              <li><strong>International Partners:</strong> INTERPOL and other international security organizations for security screening</li>
              <li><strong>Payment Processors:</strong> For processing visa fees</li>
              <li><strong>Airlines and Border Control:</strong> For verification of your eVisa at ports of entry</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your application data for a minimum of 7 years as required by Ghanaian immigration law. After this period, data may be anonymized for statistical purposes or securely deleted.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Withdraw consent for optional data processing</li>
              <li>Lodge a complaint with the Data Protection Commission of Ghana</li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              We use essential cookies to maintain your session and ensure the security of your application. We do not use tracking or advertising cookies.
            </p>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Visa applications for minors must be submitted by a parent or legal guardian. We collect children&apos;s information only as necessary for visa processing.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact:
            </p>
            <p>
              <strong>Data Protection Officer</strong><br />
              Ghana Immigration Service<br />
              Independence Avenue, Accra<br />
              Email: privacy@gis.gov.gh<br />
              Phone: +233 302 123 456
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ghana Immigration Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
