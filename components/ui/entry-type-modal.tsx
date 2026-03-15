"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, RefreshCw } from "lucide-react";

interface EntryTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (entryType: "single" | "multiple") => void;
  selected: "single" | "multiple" | "";
  baseFee: number;
  multipleEntryFee: number;
  visaTypeName: string;
}

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function EntryTypeModal({
  open,
  onClose,
  onSelect,
  selected,
  baseFee,
  multipleEntryFee,
  visaTypeName,
}: EntryTypeModalProps) {
  const options: {
    value: "single" | "multiple";
    label: string;
    icon: React.ReactNode;
    desc: string;
    fee: number;
  }[] = [
    {
      value: "single",
      label: "Single Entry",
      icon: <ArrowRight size={20} />,
      desc: "One-time entry into Ghana. The visa becomes invalid after you leave the country.",
      fee: baseFee,
    },
    {
      value: "multiple",
      label: "Multiple Entry",
      icon: <RefreshCw size={20} />,
      desc: "Enter and leave Ghana multiple times during the visa validity period.",
      fee: baseFee + multipleEntryFee,
    },
  ];

  return (
    <Modal isOpen={open} onClose={onClose} title={`Entry Type — ${visaTypeName}`}>
      <p className="text-sm text-text-muted mb-4">
        Choose how many times you need to enter Ghana during your visa validity period.
      </p>

      <div className="grid gap-3">
        {options.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border hover:border-accent/40 bg-surface"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  active ? "bg-accent text-white" : "bg-border/40 text-text-muted"
                }`}
              >
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-text-primary">{opt.label}</span>
                  <span className="text-sm font-bold text-accent">{formatCurrency(opt.fee)}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">{opt.desc}</p>
              </div>
              {active && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={onClose} disabled={!selected}>
          Continue
        </Button>
      </div>
    </Modal>
  );
}
