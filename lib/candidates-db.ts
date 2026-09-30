"use client";
import { useEffect, useState } from "react";
import type { Candidate, DbKey, Slot } from "@/types/candidate";
import { candidates } from "@/config/candidates";

type Entry = { n: string; p: string; f?: string };
export type CandidateDb = Partial<Record<DbKey, Record<string, Entry>>> & { generatedAt?: string | null };

let cache: Promise<CandidateDb | null> | null = null;

/** Baixa a base inteira (arquivo estático) — a busca por número acontece só no aparelho. */
function loadDb() {
  cache ??= fetch("/data/candidatos-sp-2026.json")
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  return cache;
}

export function useCandidateDb() {
  const [db, setDb] = useState<CandidateDb | null>(null);
  useEffect(() => {
    let alive = true;
    loadDb().then((d) => alive && setDb(d));
    return () => {
      alive = false;
    };
  }, []);
  return db;
}

/** true quando a base tem candidatos para esse cargo (permite dizer "número não encontrado"). */
export function dbHasPosition(db: CandidateDb | null, slot: Slot) {
  return !!db?.[slot.db] && Object.keys(db[slot.db]!).length > 0;
}

export function findCandidate(db: CandidateDb | null, slot: Slot, number: string): Candidate | null {
  if (number.length !== slot.digits) return null;
  const manual = candidates[slot.db]?.[number];
  if (manual) return manual;
  const e = db?.[slot.db]?.[number];
  if (!e) return null;
  return { name: e.n, number, party: e.p, position: slot.position, photo: e.f };
}
