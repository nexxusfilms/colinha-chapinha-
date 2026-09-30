"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2 } from "lucide-react";
import type { SlateValues, SlotKey } from "@/types/candidate";
import { recommendedCandidates } from "@/config/candidates";
import { clearSlate, defaultSlate, loadSlate, saveSlate } from "@/lib/storage";
import { useCandidateDb } from "@/lib/candidates-db";
import { downloadSlate } from "@/lib/generateSlate";
import { shareTool } from "@/lib/share";
import { track } from "@/lib/analytics";
import CandidateForm from "./CandidateForm";
import SlatePreview from "./SlatePreview";
import SlateModal from "./SlateModal";
import ActionButtons from "./ActionButtons";
import UrnaSimulator from "./UrnaSimulator";

const isMobile = () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches;

export default function ColinhaApp() {
  const [values, setValues] = useState<SlateValues>(defaultSlate);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const db = useCandidateDb();

  useEffect(() => {
    const saved = loadSlate();
    if (saved) setValues(saved);
    setReady(true);
    track("ferramenta_aberta");
  }, []);

  useEffect(() => {
    if (ready) saveSlate(values);
  }, [values, ready]);

  const setField = (key: SlotKey, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const fillRecommended = () =>
    setValues((s) => {
      const next = { ...s };
      for (const [k, c] of Object.entries(recommendedCandidates)) if (c?.number) next[k as SlotKey] = c.number;
      return next;
    });

  const save = async () => {
    if (!previewRef.current || busy) return;
    setBusy(true);
    try {
      await downloadSlate(previewRef.current);
      track("colinha_gerada");
      track("download");
    } catch {
      alert("Não foi possível gerar a imagem. Tente imprimir ou tirar um print da tela.");
    } finally {
      setBusy(false);
    }
  };

  const onDownload = () => (isMobile() ? setModal(true) : save());
  const onPrint = () => {
    track("impressao");
    window.print();
  };
  const onShare = () => {
    track("compartilhamento");
    shareTool();
  };
  const onClear = () => {
    if (!confirm("Apagar os números da sua colinha neste aparelho?")) return;
    clearSlate();
    setValues(defaultSlate());
  };
  const closeModal = useCallback(() => setModal(false), []);

  return (
    <div className="mx-auto grid max-w-[800px] gap-14 px-4 py-10">
      <CandidateForm values={values} db={db} onChange={setField} onFillRecommended={fillRecommended} />

      <section aria-labelledby="sua-colinha" className="scroll-mt-4">
        <div className="flex items-end justify-between gap-3">
          <h2 id="sua-colinha" className="font-display text-5xl uppercase leading-none text-azul">
            Sua colinha
          </h2>
          <button
            type="button"
            onClick={() => setModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-azul px-3 py-1.5 text-sm font-bold text-azul hover:bg-azul-claro"
          >
            <Maximize2 size={16} /> Ampliar
          </button>
        </div>
        <p className="mt-2 text-slate-700">É assim que ela fica na imagem e na impressão.</p>
        <div className="mt-6 rounded-3xl bg-azul-claro px-3 py-6 sm:px-6">
          <SlatePreview ref={previewRef} values={values} db={db} />
        </div>
        <div className="mx-auto mt-6 max-w-[420px]">
          <ActionButtons busy={busy} onDownload={onDownload} onPrint={onPrint} onShare={onShare} onClear={onClear} />
        </div>
      </section>

      <UrnaSimulator values={values} db={db} />

      {ready &&
        createPortal(
          <div id="print-root" aria-hidden>
            <SlatePreview values={values} db={db} />
          </div>,
          document.body,
        )}

      <SlateModal open={modal} values={values} db={db} busy={busy} onClose={closeModal} onSave={save} onShare={onShare} />
    </div>
  );
}
