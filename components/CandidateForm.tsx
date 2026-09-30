"use client";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import type { SlateValues, SlotKey } from "@/types/candidate";
import { recommendedCandidates, slots } from "@/config/candidates";
import { dbHasPosition, findCandidate, type CandidateDb } from "@/lib/candidates-db";
import CandidateCard from "./CandidateCard";

interface Props {
  values: SlateValues;
  db: CandidateDb | null;
  onChange: (key: SlotKey, v: string) => void;
  onFillRecommended: () => void;
}

const hasRecommended = Object.entries(recommendedCandidates).some(([k, c]) => k !== "estadual" && c);

export default function CandidateForm({ values, db, onChange, onFillRecommended }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Avança para o próximo campo ainda incompleto.
  const next = (i: number) => {
    for (let j = i + 1; j < slots.length; j++) {
      if (values[slots[j].key].length < slots[j].digits) return refs.current[j]?.focus();
    }
    refs.current[i]?.blur();
  };

  return (
    <section id="seus-candidatos" className="scroll-mt-4">
      <h2 className="font-display text-5xl uppercase leading-none text-azul">Seus candidatos</h2>
      <p className="mt-2 text-slate-700">Preencha os números na ordem em que eles aparecerão na urna.</p>
      {hasRecommended && (
        <button
          type="button"
          onClick={onFillRecommended}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-amarelo px-4 py-2.5 text-sm font-bold text-azul transition hover:brightness-105"
        >
          <Sparkles size={16} /> Preencher candidatos sugeridos
        </button>
      )}
      <div className="mt-6 grid gap-4">
        {slots.map((slot, i) => (
          <CandidateCard
            key={slot.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            slot={slot}
            index={i}
            value={values[slot.key]}
            candidate={findCandidate(db, slot, values[slot.key])}
            listAvailable={dbHasPosition(db, slot)}
            onChange={(v) => onChange(slot.key, v)}
            onComplete={() => next(i)}
          />
        ))}
      </div>
    </section>
  );
}
