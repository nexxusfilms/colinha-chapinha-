import type { SlateValues } from "@/types/candidate";
import { recommendedCandidates } from "@/config/candidates";

const KEY = "minha-colinha-2026";

/** Colinha padrão: apenas o candidato da campanha no campo de Deputado Estadual. */
export function defaultSlate(): SlateValues {
  return {
    federal: "",
    estadual: recommendedCandidates.estadual?.number ?? "",
    senador1: "",
    senador2: "",
    governador: "",
    presidente: "",
  };
}

// Tudo fica somente no navegador do eleitor.
export function loadSlate(): SlateValues | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const base = defaultSlate();
    for (const k of Object.keys(base) as (keyof SlateValues)[]) {
      if (typeof data[k] === "string") base[k] = data[k].replace(/\D/g, "");
    }
    return base;
  } catch {
    return null;
  }
}

export function saveSlate(values: SlateValues) {
  try {
    localStorage.setItem(KEY, JSON.stringify(values));
  } catch {}
}

export function clearSlate() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
