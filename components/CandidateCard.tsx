"use client";
import { forwardRef } from "react";
import { RotateCcw, X } from "lucide-react";
import type { Candidate, Slot } from "@/types/candidate";
import { chapinha } from "@/config/candidates";
import { campaign } from "@/config/campaign";
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
  const isCampaign = slot.key === "estadual" && !!chapinha.number;
  const changed = isCampaign && value !== chapinha.number;
  return (
    <div
      className={`relative rounded-2xl p-4 ${
        isCampaign ? "border-2 border-azul bg-azul-claro" : "border border-slate-200 bg-white"
      }`}
    >
      {isCampaign && (
        <span className="absolute -top-3 right-4 bg-rosa px-2 py-0.5 font-display text-base uppercase tracking-wider text-white">
          {campaign.candidate.publicName}
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`input-${slot.key}`} className="min-w-0">
          <span className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                isCampaign ? "bg-rosa text-white" : "bg-azul text-white"
              }`}
            >
              {index + 1}
            </span>
            <span className="font-display text-[26px] uppercase leading-none text-azul">{slot.label}</span>
          </span>
          <span className="mt-1 block pl-8 text-xs text-slate-500">{slot.digits} dígitos</span>
        </label>
        <div className="flex items-center gap-1">
          <CandidateInput ref={ref} slot={slot} value={value} onChange={onChange} onComplete={onComplete} />
          {value && !isCampaign && (
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
      </div>
      <CandidateInfo slot={slot} value={value} candidate={candidate} listAvailable={listAvailable} />
      {changed && (
        <button
          type="button"
          onClick={() => onChange(chapinha.number)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-azul underline-offset-2 hover:underline"
        >
          <RotateCcw size={14} /> Voltar para {chapinha.name} {chapinha.number}
        </button>
      )}
    </div>
  );
});

export default CandidateCard;
