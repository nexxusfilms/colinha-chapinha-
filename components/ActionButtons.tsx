"use client";
import { Download, Loader2, Printer, RotateCcw, Share2 } from "lucide-react";

interface Props {
  busy: boolean;
  onDownload: () => void;
  onPrint: () => void;
  onShare: () => void;
  onClear: () => void;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul disabled:opacity-60";

export default function ActionButtons({ busy, onDownload, onPrint, onShare, onClear }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" onClick={onDownload} disabled={busy} className={`${base} col-span-2 bg-azul text-white hover:brightness-110`}>
        {busy ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
        {busy ? "Gerando imagem…" : "Baixar colinha"}
      </button>
      <button type="button" onClick={onPrint} className={`${base} bg-amarelo text-azul hover:brightness-105`}>
        <Printer size={20} /> Imprimir
      </button>
      <button type="button" onClick={onShare} className={`${base} bg-rosa text-white hover:brightness-110`}>
        <Share2 size={20} /> Compartilhar
      </button>
      <button type="button" onClick={onClear} className={`${base} col-span-2 border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300`}>
        <RotateCcw size={18} /> Limpar colinha
      </button>
    </div>
  );
}
