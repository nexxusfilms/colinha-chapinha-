"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { SlateValues } from "@/types/candidate";
import { chapinha, slots } from "@/config/candidates";
import { dbHasPosition, findCandidate, type CandidateDb } from "@/lib/candidates-db";
import CandidateAvatar from "./CandidateAvatar";

interface Props {
  values: SlateValues;
  db: CandidateDb | null;
}

/** Deputado Estadual fica fixo no candidato da campanha. */
const fixedFor = (i: number) => (slots[i].key === "estadual" && chapinha.number ? chapinha.number : null);

function useBeep() {
  const ctx = useRef<AudioContext | null>(null);
  return (dur = 0.07, freq = 1100) => {
    try {
      ctx.current ??= new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.current.createOscillator();
      const g = ctx.current.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      o.connect(g).connect(ctx.current.destination);
      o.start();
      o.stop(ctx.current.currentTime + dur);
    } catch {}
  };
}

export default function UrnaSimulator({ values, db }: Props) {
  const [step, setStep] = useState(0);
  const [digits, setDigits] = useState(fixedFor(0) ?? "");
  const [branco, setBranco] = useState(false);
  const [done, setDone] = useState(false);
  const beep = useBeep();

  const slot = slots[Math.min(step, slots.length - 1)];
  const fixed = fixedFor(step);
  const complete = digits.length === slot.digits;
  const cand = complete ? findCandidate(db, slot, digits) : null;
  const listAvailable = dbHasPosition(db, slot);
  const fromSlate = values[slot.key];

  useEffect(() => {
    setDigits(fixedFor(step) ?? "");
    setBranco(false);
  }, [step]);

  const press = (k: string) => {
    if (done || fixed || branco || digits.length >= slot.digits) return;
    beep();
    setDigits((d) => d + k);
  };
  const corrige = () => {
    beep();
    setBranco(false);
    setDigits(fixed ?? "");
  };
  const votoBranco = () => {
    if (done || fixed || digits) return;
    beep();
    setBranco(true);
  };
  const confirma = () => {
    if (done || !(complete || branco)) return;
    if (step === slots.length - 1) {
      [0, 110, 220, 330].forEach((t, i) => setTimeout(() => beep(i === 3 ? 0.45 : 0.08), t));
      setDone(true);
    } else {
      beep(0.18);
      setStep((s) => s + 1);
    }
  };
  const restart = () => {
    setDone(false);
    setStep(0);
    setDigits(fixedFor(0) ?? "");
  };

  return (
    <section aria-labelledby="urna-title">
      <h2 id="urna-title" className="font-display text-5xl uppercase leading-none text-azul">
        Treine na urna
      </h2>
      <p className="mt-2 text-slate-700">
        Vote nos seis cargos na ordem da urna. O Deputado Estadual já está com {chapinha.name}
        {chapinha.number ? ` (${chapinha.number})` : ""}.
      </p>

      <div className="mx-auto mt-6 max-w-[520px] rounded-3xl bg-[#2a2a2a] p-3 shadow-xl sm:p-4">
        {/* TELA */}
        <div className="relative min-h-[236px] rounded-lg bg-[#ececec] p-3 font-[Arial,Helvetica,sans-serif] text-black">
          {done ? (
            <div className="flex h-[212px] flex-col items-center justify-center">
              <p className="text-7xl font-bold tracking-widest">FIM</p>
              <p className="mt-2 text-xs text-slate-600">Votou</p>
            </div>
          ) : (
            <>
              <p className="text-[11px]">SEU VOTO PARA</p>
              <p className="mt-1 text-center text-lg font-bold uppercase">{slot.position}</p>
              {branco ? (
                <p className="mt-10 text-center text-2xl font-bold">VOTO EM BRANCO</p>
              ) : (
                <div className="mt-2 flex gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px]">Número:</p>
                    <div className="mt-1 flex gap-1">
                      {Array.from({ length: slot.digits }, (_, i) => (
                        <span
                          key={i}
                          className={`flex h-9 w-7 items-center justify-center border border-black bg-white text-xl font-bold ${
                            i === digits.length ? "urna-blink" : ""
                          }`}
                        >
                          {digits[i] ?? ""}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 min-h-[44px] text-[13px] leading-snug" aria-live="polite">
                      {complete && cand && (
                        <>
                          <p>
                            Nome: <b className="uppercase">{cand.name}</b>
                          </p>
                          <p>
                            Partido: <b>{cand.party}</b>
                          </p>
                        </>
                      )}
                      {complete && !cand && listAvailable && (
                        <>
                          <p className="font-bold">NÚMERO ERRADO</p>
                          <p className="text-lg font-bold">VOTO NULO</p>
                        </>
                      )}
                      {complete && !cand && !listAvailable && <p>Número digitado. Confira nome e foto na urna.</p>}
                    </div>
                  </div>
                  {complete && cand && (
                    <div className="flex h-[92px] w-[76px] shrink-0 items-center justify-center overflow-hidden border border-slate-500 bg-white">
                      {cand.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cand.photo} alt="" className="h-full w-full object-cover object-top" />
                      ) : (
                        <CandidateAvatar candidate={cand} size={60} />
                      )}
                    </div>
                  )}
                </div>
              )}
              {(complete || branco) && (
                <div className="mt-2 border-t border-slate-400 pt-1.5 text-[10px] leading-tight">
                  Aperte a tecla:
                  <br />
                  <b>CONFIRMA</b> para CONFIRMAR este voto
                  {!fixed && (
                    <>
                      <br />
                      <b>CORRIGE</b> para REINICIAR este voto
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* dica */}
        {!done && (
          <p className="mt-3 min-h-[20px] text-center text-sm text-white/80">
            {fixed ? (
              <>
                Na urna de verdade, digite <b className="text-amarelo">{fixed}</b> e aperte CONFIRMA.
              </>
            ) : fromSlate.length === slot.digits ? (
              <button
                type="button"
                className="underline decoration-amarelo underline-offset-4"
                onClick={() => {
                  setBranco(false);
                  setDigits(fromSlate);
                }}
              >
                Na sua colinha: <b className="text-amarelo">{fromSlate}</b> — digitar
              </button>
            ) : (
              `Cargo ${step + 1} de ${slots.length}`
            )}
          </p>
        )}

        {/* TECLADO */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""].map((k, i) =>
            k ? (
              <button
                key={i}
                type="button"
                onClick={() => press(k)}
                className="rounded-md bg-[#111] py-3 text-2xl font-bold text-white shadow-[0_3px_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                {k}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[13px] font-extrabold">
          <button type="button" onClick={votoBranco} className="rounded-md bg-white py-3.5 text-black shadow-[0_3px_0_rgba(0,0,0,.6)]">
            BRANCO
          </button>
          <button type="button" onClick={corrige} className="rounded-md bg-[#e07b24] py-3.5 text-black shadow-[0_3px_0_rgba(0,0,0,.6)]">
            CORRIGE
          </button>
          <button type="button" onClick={confirma} className="rounded-md bg-[#1e9b4b] py-3.5 text-base text-black shadow-[0_3px_0_rgba(0,0,0,.6)]">
            CONFIRMA
          </button>
        </div>
        {done && (
          <button
            type="button"
            onClick={restart}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amarelo py-3 font-bold text-azul"
          >
            <RotateCcw size={18} /> Treinar de novo
          </button>
        )}
      </div>
    </section>
  );
}
