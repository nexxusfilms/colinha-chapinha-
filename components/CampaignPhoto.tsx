"use client";
import { useState } from "react";
import { campaign } from "@/config/campaign";

/** Foto do candidato (PNG transparente). Sem o arquivo, mostra um placeholder identificado. */
export default function CampaignPhoto({ className = "" }: { className?: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-white/60 p-4 text-center text-sm font-semibold text-white/80 ${className}`}
      >
        FOTO DO CANDIDATO
        <br />
        {campaign.candidate.photo}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={campaign.candidate.photo}
      alt={`Foto de ${campaign.candidate.publicName}`}
      onError={() => setMissing(true)}
      className={className}
      fetchPriority="high"
    />
  );
}
