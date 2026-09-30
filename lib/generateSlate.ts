import { toBlob } from "html-to-image";

const FILE = "minha-colinha-2026.png";

export async function slateToBlob(node: HTMLElement) {
  const opts = {
    pixelRatio: 3,
    backgroundColor: "#ffffff",
    cacheBust: true,
    width: node.offsetWidth,
    height: node.offsetHeight,
    // Sem margem automática/sombra do layout da página, senão a imagem sai deslocada.
    style: { margin: "0", boxShadow: "none", borderRadius: "0" },
  };
  // A primeira passada aquece fontes/imagens (Safari às vezes gera a 1ª imagem sem elas).
  await toBlob(node, opts).catch(() => null);
  const blob = await toBlob(node, opts);
  if (!blob) throw new Error("Não foi possível gerar a imagem");
  return blob;
}

export async function downloadSlate(node: HTMLElement) {
  const blob = await slateToBlob(node);
  const file = new File([blob], FILE, { type: "image/png" });
  // No celular, o menu de compartilhar oferece "Salvar imagem" na galeria.
  const isTouch = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  if (isTouch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = FILE;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
