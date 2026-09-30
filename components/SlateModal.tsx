"use client";
import { useEffect, useRef } from "react";
import { Download, Loader2, Share2, X } from "lucide-react";
import type { SlateValues } from "@/types/candidate";
import type { CandidateDb } from "@/lib/candidates-db";
import SlatePreview from "./SlatePreview";

interface Props {
  open: boolean;
  values: SlateValues;
  db: CandidateDb | null;
  busy: boolean;
  onClose: () => void;
  onSave: () => void;
  onShare: () => void;
}

export default function SlateModal({ open, values, db, busy, onClose, onSave, onShare }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/70 p-[4vw] print:hidden" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl bg-white"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 id="modal-title" className="font-display text-3xl uppercase text-azul">Sua colinha</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-azul-claro p-4">
          <SlatePreview values={values} db={db} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
          <button type="button" onClick={onSave} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-azul px-4 py-3.5 font-bold text-white disabled:opacity-60">
            {busy ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />} Salvar
          </button>
          <button type="button" onClick={onShare} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rosa px-4 py-3.5 font-bold text-white">
            <Share2 size={20} /> Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
