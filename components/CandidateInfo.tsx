import type { Candidate, Slot } from "@/types/candidate";
import CandidateAvatar from "./CandidateAvatar";

interface Props {
  slot: Slot;
  value: string;
  candidate: Candidate | null;
  listAvailable: boolean;
}

export default function CandidateInfo({ slot, value, candidate, listAvailable }: Props) {
  let content: React.ReactNode;
  if (!value) {
    content = <p className="text-sm text-slate-500">Digite os {slot.digits} números do seu candidato.</p>;
  } else if (value.length < slot.digits) {
    const k = slot.digits - value.length;
    content = <p className="text-sm text-slate-500">Falta{k > 1 ? "m" : ""} {k} dígito{k > 1 ? "s" : ""}.</p>;
  } else if (candidate) {
    content = (
      <div className="flex items-center gap-3">
        <CandidateAvatar candidate={candidate} />
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold uppercase text-tinta">{candidate.name}</p>
          <p className="text-sm text-slate-600">
            {candidate.party} · <span className="font-semibold text-azul">{candidate.number}</span>
          </p>
        </div>
      </div>
    );
  } else {
    content = (
      <div>
        <p className="text-sm font-bold text-tinta">Número informado</p>
        {listAvailable && (
          <p className="text-xs text-slate-500">
            Não encontramos esse número na lista de candidatos. Confira antes de votar.
          </p>
        )}
      </div>
    );
  }
  return (
    <div id={`info-${slot.key}`} aria-live="polite" className="mt-3 min-h-[56px] content-center">
      {content}
    </div>
  );
}
