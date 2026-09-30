import type { Candidate, DbKey, Slot, SlotKey } from "@/types/candidate";
import { campaign } from "./campaign";

/** Ordem de votação na urna — Eleições Gerais 2026. */
export const slots: Slot[] = [
  { key: "federal", label: "Deputado Federal", digits: 4, position: "Deputado Federal", db: "federal" },
  { key: "estadual", label: "Deputado Estadual", digits: 5, position: "Deputado Estadual", db: "estadual" },
  { key: "senador1", label: "Senador — 1ª vaga", digits: 3, position: "Senador", db: "senador" },
  { key: "senador2", label: "Senador — 2ª vaga", digits: 3, position: "Senador", db: "senador" },
  { key: "governador", label: "Governador", digits: 2, position: "Governador", db: "governador" },
  { key: "presidente", label: "Presidente", digits: 2, position: "Presidente", db: "presidente" },
];

export const chapinha: Candidate = {
  name: campaign.candidate.publicName,
  number: campaign.candidate.number,
  party: campaign.candidate.party,
  position: "Deputado Estadual",
  photo: campaign.candidate.avatar,
};

/** Dobrada informada no manual de marca da campanha. */
export const sidneyCruz: Candidate = {
  name: "Sidney Cruz",
  number: "1502",
  party: "MDB",
  position: "Deputado Federal",
};

/**
 * Candidatos cadastrados manualmente. Têm prioridade sobre a base do TSE
 * (public/data/candidatos-sp-2026.json). Nunca inclua candidatos sem fonte oficial.
 */
export const candidates: Partial<Record<DbKey, Record<string, Candidate>>> = {
  estadual: chapinha.number ? { [chapinha.number]: chapinha } : {},
  federal: { [sidneyCruz.number]: sidneyCruz },
};

/**
 * Botão "Preencher candidatos sugeridos". Só aparece se houver algum
 * candidato configurado além do Deputado Estadual.
 */
export const recommendedCandidates: Record<SlotKey, Candidate | null> = {
  federal: sidneyCruz,
  estadual: chapinha,
  senador1: null,
  senador2: null,
  governador: null,
  presidente: null,
};
