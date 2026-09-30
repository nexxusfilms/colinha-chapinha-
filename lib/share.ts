import { campaign } from "@/config/campaign";

/** Compartilha apenas o link da ferramenta — nunca os números escolhidos. */
export async function shareTool() {
  const url = window.location.origin + "/";
  const text = `Monte sua colinha para as Eleições ${campaign.election.year} e leve seus números no dia da votação:`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Minha Colinha 2026", text, url });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
}
