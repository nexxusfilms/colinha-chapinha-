import { forwardRef } from "react";
import type { SlateValues } from "@/types/candidate";
import { slots } from "@/config/candidates";
import { campaign } from "@/config/campaign";
import { findCandidate, type CandidateDb } from "@/lib/candidates-db";

interface Props {
  values: SlateValues;
  db: CandidateDb | null;
  id?: string;
}

/** A colinha em si — é o que vira PNG e o que sai na impressão. */
const SlatePreview = forwardRef<HTMLDivElement, Props>(function SlatePreview({ values, db, id }, ref) {
  const { candidate, legal, election } = campaign;
  return (
    <div
      ref={ref}
      id={id}
      className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl bg-white text-tinta shadow-[0_8px_30px_rgba(0,74,173,.18)]"
    >
      <div className="relative bg-azul px-5 pb-4 pt-5 text-white">
        <div aria-hidden className="absolute right-0 top-0 h-5 w-16 bg-rosa" />
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-display text-[46px] uppercase leading-[0.85]">Minha colinha</p>
            <p className="mt-2 inline-block bg-amarelo px-2 py-0.5 font-display text-lg uppercase tracking-wider text-azul">
              Eleições {election.year}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={candidate.logoWhite} alt={candidate.publicName} className="w-[96px]" />
        </div>
      </div>
      <div aria-hidden className="h-1.5 bg-[repeating-linear-gradient(90deg,var(--color-rosa)_0_18px,transparent_18px_28px)]" />

      <ol>
        {slots.map((slot) => {
          const v = values[slot.key];
          const c = findCandidate(db, slot, v);
          const isCampaign = slot.key === "estadual" && !!candidate.number && v === candidate.number;
          return (
            <li
              key={slot.key}
              className={`flex items-center justify-between gap-3 border-b-2 border-dashed border-slate-200 px-5 py-2.5 last:border-b-0 ${
                isCampaign ? "border-l-[6px] border-l-rosa bg-azul-claro pl-[14px]" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="font-display text-[21px] uppercase leading-tight text-azul">{slot.label}</p>
                {isCampaign ? (
                  <p className="font-display text-[20px] uppercase leading-tight text-rosa">{candidate.publicName}</p>
                ) : (
                  c && <p className="truncate text-[12px] font-semibold uppercase text-slate-600">{c.name} · {c.party}</p>
                )}
              </div>
              <p
                className={`shrink-0 font-display leading-none tracking-[0.08em] ${
                  isCampaign ? "text-[58px] text-azul" : v ? "text-[52px] text-tinta" : "text-[52px] text-slate-200"
                }`}
              >
                {v ? v.padEnd(slot.digits, "_") : "_".repeat(slot.digits)}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="border-t-4 border-amarelo px-5 py-3 text-center">
        <p className="text-[11px] font-semibold text-slate-600">Confira nome e foto na urna antes de apertar CONFIRMA.</p>
        <p className="mt-1 text-[10px] text-slate-500">
          {candidate.publicName}
          {candidate.number ? ` ${candidate.number}` : ""} · {candidate.position} {candidate.state}
          {candidate.party ? ` · ${candidate.party}` : ""}
          {legal.cnpj ? ` · CNPJ ${legal.cnpj}` : ""}
        </p>
      </div>
    </div>
  );
});

export default SlatePreview;
