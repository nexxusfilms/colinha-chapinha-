import { campaign } from "@/config/campaign";

export default function Footer() {
  const { candidate, legal, social, election } = campaign;
  return (
    <footer className="relative bg-azul text-white">
      <div aria-hidden className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-rosa)_0_24px,transparent_24px_36px)]" />
      <div className="mx-auto flex max-w-[800px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={candidate.logoWhite} alt={candidate.publicName} className="w-[170px]" />
          <p className="mt-4 font-display text-2xl uppercase tracking-wide">
            {candidate.position}
            {candidate.number && <span className="text-amarelo"> · {candidate.number}</span>}
            {candidate.party && <span> · {candidate.party}</span>}
          </p>
          <p className="text-sm text-white/80">Eleições {election.year}</p>
          {(social.instagram || social.website) && (
            <p className="mt-3 flex gap-4 text-sm font-semibold">
              {social.instagram && (
                <a className="underline underline-offset-4" href={social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {social.website && (
                <a className="underline underline-offset-4" href={social.website} target="_blank" rel="noopener noreferrer">
                  Site
                </a>
              )}
            </p>
          )}
        </div>
        <div className="max-w-[340px] text-xs leading-relaxed text-white/75 sm:text-right">
          <p>
            {candidate.publicName} — {candidate.legalName}
          </p>
          {legal.cnpj && <p>CNPJ {legal.cnpj}</p>}
          {legal.disclaimer && <p>{legal.disclaimer}</p>}
        </div>
      </div>
    </footer>
  );
}
