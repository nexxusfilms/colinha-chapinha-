import { slots } from "@/config/candidates";
import DottedRule from "./DottedRule";

export default function VotingOrder() {
  return (
    <section className="bg-azul-claro">
      <div className="mx-auto max-w-[800px] px-4 py-12">
        <h2 className="font-display text-5xl uppercase leading-none text-azul">Ordem de votação</h2>
        <DottedRule className="mt-4 max-w-[240px] text-rosa" />
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {slots.map((s, i) => (
            <li key={s.key} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-azul font-display text-xl text-white">
                {i + 1}
              </span>
              <span className="font-display text-2xl uppercase leading-none text-azul">{s.label}</span>
              <span className="ml-auto text-xs font-semibold text-slate-500">{s.digits} dígitos</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-3 text-[15px] leading-relaxed text-slate-700">
          <p className="border-l-4 border-rosa bg-white px-4 py-3">
            Antes de apertar <b className="text-[#1e7a3c]">CONFIRMA</b>, confira o nome, o número e a foto que aparecem
            na tela da urna.
          </p>
          <p className="border-l-4 border-amarelo bg-white px-4 py-3">
            Para Senador são duas vagas: escolha dois candidatos diferentes.
          </p>
          <p className="border-l-4 border-azul bg-white px-4 py-3">
            Celular não entra na cabine. Leve sua colinha impressa ou escrita em papel.
          </p>
        </div>
      </div>
    </section>
  );
}
