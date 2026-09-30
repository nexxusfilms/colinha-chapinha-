import type { Candidate } from "@/types/candidate";

export default function CandidateAvatar({ candidate, size = 56 }: { candidate: Candidate; size?: number }) {
  const initials = candidate.name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ú]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-azul-claro ring-2 ring-azul"
      style={{ width: size, height: size }}
    >
      {candidate.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={candidate.photo} alt="" className="h-full w-full object-cover object-top" />
      ) : (
        <span className="font-display text-azul" style={{ fontSize: size * 0.45 }} aria-hidden>
          {initials}
        </span>
      )}
    </div>
  );
}
