import { campaign } from "@/config/campaign";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-14 max-w-[800px] items-center justify-between px-4">
        <a href="#" aria-label={campaign.candidate.publicName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={campaign.candidate.logo} alt={campaign.candidate.publicName} className="h-9 w-auto" />
        </a>
        <a
          href="#seus-candidatos"
          className="rounded-full bg-rosa px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
        >
          Montar colinha
        </a>
      </div>
    </header>
  );
}
