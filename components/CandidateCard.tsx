"use client";
import { forwardRef } from "react";
import { Lock, X } from "lucide-react";
import type { Candidate, Slot } from "@/types/candidate";
import { fixedCandidates } from "@/config/candidates";
import CandidateInput from "./CandidateInput";
import CandidateInfo from "./CandidateInfo";

interface Props {
  slot: Slot;
  index: number;
  value: string;
  candidate: Candidate | null;
  listAvailable: boolean;
  onChange: (v: string) => void;
  onComplete: () => void;
}

const CandidateCard = forwardRef<HTMLInputElement, Props>(function CandidateCard(
  { slot, index, value, candidate, listAvailable, onChange, onComplete },
  ref,
) {
  const fixed = fixedCandidates[slot.key];
  return (
    <div
      className={`relative rounded-2xl p-4 ${
        fixed ? "border-2 border-azul bg-azul-claro" : "border border-slate-200 bg-white"
      }`}
    >
      {fixed && (
        <span className="absolute -top-3 right-4 bg-rosa px-2 py-0.5 font-display text-base uppercase tracking-wider text-white">
          {fixed.name}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`input-${slot.key}`} className="min-w-0">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                fixed ? "bg-rosa" : "bg-azul"
              }`}
            >
              {index + 1}
            </span>
            <span className="font-display text-[26px] uppercase leading-none text-azul">{slot.label}</span>
          </span>
          <span className="mt-1 block pl-8 text-xs text-slate-500">{slot.digits} dígitos</span>
        </label>
        {fixed ? (
          <div className="flex items-center gap-2">
            <output
              id={`input-${slot.key}`}
              aria-describedby={`info-${slot.key}`}
              className="digits-input rounded-xl border-2 border-azul/20 bg-white px-3 py-1 font-display text-[44px] leading-none tracking-[0.2em] text-azul"
            >
              {fixed.number}
            </output>
            <Lock size={16} className="text-azul/60" aria-label="Campo fixo" />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <CandidateInput ref={ref} slot={slot} value={value} onChange={onChange} onComplete={onComplete} />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label={`Apagar ${slot.label}`}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      <CandidateInfo slot={slot} value={fixed ? fixed.number : value} candidate={fixed ?? candidate} listAvailable={listAvailable} />
    </div>
  );
});

export default CandidateCard;
