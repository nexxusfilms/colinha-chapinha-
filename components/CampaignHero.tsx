import { campaign } from "@/config/campaign";
import CampaignPhoto from "./CampaignPhoto";
import DottedRule from "./DottedRule";

export default function CampaignHero() {
  const { candidate, election } = campaign;
  return (
    <>
      <section className="relative overflow-hidden bg-azul text-white">
        {/* blocos geométricos */}
        <div aria-hidden className="absolute -right-10 top-8 h-40 w-40 rotate-12 bg-rosa sm:right-6 sm:h-56 sm:w-56" />
        <div aria-hidden className="absolute bottom-0 left-0 h-3 w-full bg-rosa" />
        <div aria-hidden className="absolute left-4 top-6 h-3 w-3 bg-amarelo" />

        <div className="relative mx-auto grid max-w-[800px] grid-cols-1 items-end px-4 sm:grid-cols-[1.15fr_1fr]">
          <div className="pb-6 pt-10 sm:pb-14">
            <span className="inline-block bg-rosa px-3 py-1 font-display text-xl uppercase tracking-wider">
              {candidate.position}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={candidate.logoWhite}
              alt={candidate.publicName}
              className="mt-4 w-[240px] max-w-full sm:w-[300px]"
            />
            {candidate.number && (
              <div className="mt-4 flex items-end gap-3">
                <span
                  className="font-display text-[108px] leading-[0.8] tracking-wide sm:text-[128px]"
                  aria-label={`Número ${candidate.number.split("").join(" ")}`}
                >
                  {candidate.number}
                </span>
                {candidate.party && (
                  <span className="mb-1 bg-amarelo px-2 py-0.5 font-display text-2xl uppercase text-azul">
                    {candidate.party}
                  </span>
                )}
              </div>
            )}
            <DottedRule className="mt-6 max-w-[300px] text-amarelo" />
          </div>
          <div className="relative -mx-4 flex h-[340px] items-end justify-center sm:mx-0 sm:h-[460px]">
            <div aria-hidden className="absolute bottom-0 h-[250px] w-[250px] rounded-full border-[10px] border-amarelo/90 sm:h-[330px] sm:w-[330px]" />
            <CampaignPhoto className="relative z-10 h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,.25)]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[800px] px-4 pb-2 pt-10">
        <h1 className="font-display text-[64px] uppercase leading-[0.9] text-azul sm:text-[80px]">Minha Colinha</h1>
        <p className="mt-2 font-display text-2xl uppercase tracking-wide text-rosa">
          Eleições {election.year} · {election.firstRoundShort}
        </p>
        <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-slate-700">
          Monte sua colinha com os números dos seus candidatos, baixe no celular ou imprima para consultar na hora de
          votar.
        </p>
      </section>
    </>
  );
}
