"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🇬🇭</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GH-eVISA</h1>
              <p className="text-xs text-gray-500">Terms of Service</p>
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
              <FileText size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-sm text-gray-500">Last updated: March 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the GH-eVISA electronic visa application system (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              The GH-eVISA system is an official electronic visa application platform operated by the Ghana Immigration Service (GIS) in collaboration with the Ministry of Foreign Affairs (MFA). The Service allows eligible foreign nationals to apply for electronic visas to enter the Republic of Ghana.
            </p>

            <h2>3. Eligibility</h2>
            <p>To use this Service, you must:</p>
            <ul>
              <li>Be a foreign national requiring a visa to enter Ghana</li>
              <li>Hold a valid passport with at least 6 months validity</li>
              <li>Be of legal age to enter into this agreement (18 years or older, or with parental consent)</li>
              <li>Not be prohibited from entering Ghana under any applicable laws</li>
            </ul>

            <h2>4. Application Process</h2>
            <h3>4.1 Accuracy of Information</h3>
            <p>
              You are responsible for ensuring all information provided in your application is accurate, complete, and truthful. Providing false or misleading information may result in:
            </p>
            <ul>
              <li>Rejection of your application</li>
              <li>Revocation of an issued eVisa</li>
              <li>Denial of entry at the border</li>
              <li>Legal prosecution under Ghanaian law</li>
            </ul>

            <h3>4.2 Document Requirements</h3>
            <p>
              You must upload clear, legible copies of all required documents. Documents that do not meet quality standards may delay processing or result in rejection.
            </p>

            <h3>4.3 Processing Time</h3>
            <p>
              While we strive to process applications within the stated timeframes, processing times may vary based on application volume, security screening requirements, and other factors. We do not guarantee approval within any specific timeframe.
            </p>

            <h2>5. Fees and Payment</h2>
            <h3>5.1 Visa Fees</h3>
            <p>
              Visa fees are non-refundable once your application has been submitted for processing. Fees vary based on visa type and are displayed before payment.
            </p>

            <h3>5.2 Payment Processing</h3>
            <p>
              Payments are processed through secure third-party payment providers. By making a payment, you agree to the terms of the payment provider.
            </p>

            <h3>5.3 Refunds</h3>
            <p>
              Refunds are only available in the following circumstances:
            </p>
            <ul>
              <li>Technical error resulting in duplicate payment</li>
              <li>Application not submitted due to system failure</li>
            </ul>
            <p>Refunds are not available for rejected applications.</p>

            <h2>6. eVisa Validity and Use</h2>
            <h3>6.1 Validity Period</h3>
            <p>
              Your eVisa is valid only for the dates and duration specified on the document. Entry must occur within the validity period.
            </p>

            <h3>6.2 Conditions of Entry</h3>
            <p>
              An approved eVisa does not guarantee entry into Ghana. Immigration officers at the port of entry have the final authority to grant or deny entry based on applicable laws and regulations.
            </p>

            <h3>6.3 Prohibited Activities</h3>
            <p>
              Your eVisa is issued for the purpose stated in your application. Engaging in activities not permitted by your visa type (e.g., working on a tourist visa) is a violation of Ghanaian immigration law.
            </p>

            <h2>7. Security and Fraud Prevention</h2>
            <p>
              Tampering with, forging, or misusing an eVisa document is a criminal offense under Ghanaian law, punishable by imprisonment and/or fines. All eVisas contain security features that can be verified by authorities.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              All content, design, and functionality of the GH-eVISA system are the property of the Government of Ghana. You may not copy, reproduce, or distribute any part of the Service without authorization.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              The Government of Ghana and its agencies shall not be liable for:
            </p>
            <ul>
              <li>Delays in processing due to factors beyond our control</li>
              <li>Losses arising from rejected applications</li>
              <li>Technical issues with third-party services</li>
              <li>Consequential damages arising from use of the Service</li>
            </ul>

            <h2>10. Governing Law</h2>
            <p>
              These Terms of Service are governed by the laws of the Republic of Ghana. Any disputes shall be subject to the exclusive jurisdiction of the courts of Ghana.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Continued use of the Service after changes constitutes acceptance of the modified terms.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact:
            </p>
            <p>
              <strong>Ghana Immigration Service</strong><br />
              Independence Avenue, Accra<br />
              Email: support@ghevisa.gov.gh<br />
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
