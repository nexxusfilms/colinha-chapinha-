/** Linha pontilhada com círculo na ponta (elemento do manual de marca). */
export default function DottedRule({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`dotted-rule ${className}`} />;
}
