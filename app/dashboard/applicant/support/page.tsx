"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Send,
  Mail,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How long does it take to process my visa application?",
    answer: "Standard processing takes 3-5 business days. Express processing (additional fee) takes 24-48 hours. Processing times may vary based on application volume and completeness of your submission."
  },
  {
    question: "What documents do I need to apply for a Ghana eVisa?",
    answer: "Required documents typically include: a valid passport (6+ months validity), passport-sized photograph, proof of accommodation in Ghana, return flight itinerary, and proof of sufficient funds. Additional documents may be required based on visa type."
  },
  {
    question: "Can I edit my application after submission?",
    answer: "Once an application is submitted and paid, you cannot edit the core details. However, if additional information is requested by the reviewing officer, you will be notified and can provide updates through your dashboard."
  },
  {
    question: "How do I check my application status?",
    answer: "Log into your dashboard and navigate to 'My Applications'. You can see the current status of all your applications. You will also receive email notifications when your status changes."
  },
  {
    question: "What happens if my application is denied?",
    answer: "If your application is denied, you will receive an email with the reason for denial. You may be eligible to reapply after addressing the issues mentioned. Visa fees are non-refundable for denied applications."
  },
  {
    question: "How do I download my approved eVisa?",
    answer: "Once approved, go to 'My Applications', click on the approved application, and use the 'Download eVisa' button. You should print this document and carry it with your passport when traveling."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, all personal information is encrypted using industry-standard AES-256 encryption. We comply with data protection regulations and never share your information with unauthorized third parties."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept major credit/debit cards (Visa, Mastercard) and mobile money payments through Paystack. All payments are processed securely."
  },
  {
    question: "Can I apply for multiple people at once?",
    answer: "Currently, each application must be submitted individually. However, you can create multiple applications from the same account for family members or groups."
  },
  {
    question: "What if I need to change my travel dates after approval?",
    answer: "Minor date changes may be accommodated by contacting support. Significant changes may require a new application. The eVisa is valid for entry within the specified validity period."
  }
];

export default function ApplicantSupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Your message has been sent. We'll respond within 24-48 hours.");
    setContactForm({ subject: "", message: "" });
    setSending(false);
  };

  return (
    <DashboardShell
      title="Help & Support"
      description="Find answers to common questions or contact our support team"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card-interactive p-5 text-center">
              <div className="w-12 h-12 bg-primary/6 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-text-primary text-sm mb-0.5">Application Guide</h3>
              <p className="text-xs text-text-muted">Step-by-step instructions</p>
            </div>
            <div className="card-interactive p-5 text-center">
              <div className="w-12 h-12 bg-info/8 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock size={22} className="text-info" />
              </div>
              <h3 className="font-bold text-text-primary text-sm mb-0.5">Processing Times</h3>
              <p className="text-xs text-text-muted">Current wait times</p>
            </div>
            <div className="card-interactive p-5 text-center">
              <div className="w-12 h-12 bg-success/8 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={22} className="text-success" />
              </div>
              <h3 className="font-bold text-text-primary text-sm mb-0.5">Requirements</h3>
              <p className="text-xs text-text-muted">Document checklist</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="card">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gold/8 flex items-center justify-center">
                <HelpCircle size={16} className="text-gold" />
              </div>
              <h2 className="text-base font-bold text-text-primary">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-200 ${
                    expandedFaq === index ? "border-accent/20 bg-accent/3" : "border-border-light bg-surface/50 hover:bg-surface"
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                  >
                    <span className={`text-sm pr-4 ${expandedFaq === index ? "font-semibold text-text-primary" : "font-medium text-text-secondary"}`}>{faq.question}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      expandedFaq === index ? "bg-accent/10" : "bg-surface"
                    }`}>
                      {expandedFaq === index ? (
                        <ChevronUp size={14} className="text-accent" />
                      ) : (
                        <ChevronDown size={14} className="text-text-muted" />
                      )}
                    </div>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Form */}
          <div className="card">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center">
                <MessageSquare size={16} className="text-accent" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Contact Support</h3>
            </div>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <Input
                label="Subject"
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                required
              />
              <Textarea
                label="Message"
                placeholder="Describe your issue in detail..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                required
              />
              <Button type="submit" className="w-full" loading={sending} leftIcon={<Send size={16} />}>
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="card">
            <h3 className="font-semibold text-text-primary mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Email</p>
                  <a href="mailto:support@ghevisa.gov.gh" className="text-sm text-primary hover:underline">
                    support@ghevisa.gov.gh
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={16} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Phone</p>
                  <p className="text-sm text-text-secondary">+233 302 123 456</p>
                  <p className="text-xs text-text-muted">Mon-Fri, 8am-5pm GMT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={15} className="text-primary" />
              <h4 className="text-sm font-bold text-text-primary">Response Time</h4>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              We typically respond within <strong className="text-text-primary">24-48 hours</strong> during business days.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
