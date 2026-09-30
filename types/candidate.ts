export type CandidatePosition =
  | "Deputado Federal"
  | "Deputado Estadual"
  | "Senador"
  | "Governador"
  | "Presidente";

/** Campos da colinha, na ordem da urna. */
export type SlotKey = "federal" | "estadual" | "senador1" | "senador2" | "governador" | "presidente";

/** Chave da base de candidatos (as duas vagas de senador usam a mesma base). */
export type DbKey = "federal" | "estadual" | "senador" | "governador" | "presidente";

export interface Candidate {
  name: string;
  number: string;
  party: string;
  position: CandidatePosition;
  photo?: string;
}

export interface Slot {
  key: SlotKey;
  label: string;
  digits: number;
  position: CandidatePosition;
  db: DbKey;
}

export type SlateValues = Record<SlotKey, string>;
