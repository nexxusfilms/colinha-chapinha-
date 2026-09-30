/**
 * Eventos genéricos de uso. NUNCA envie números, candidatos ou combinações de voto.
 * Sem ferramenta de analytics instalada, é um no-op. Com Vercel Analytics
 * (<Analytics /> em app/layout.tsx), os eventos vão para window.va.
 */
export type AppEvent = "ferramenta_aberta" | "colinha_gerada" | "download" | "impressao" | "compartilhamento";

export function track(event: AppEvent) {
  try {
    const w = window as unknown as { va?: (t: string, p: object) => void };
    w.va?.("event", { name: event });
  } catch {}
}
