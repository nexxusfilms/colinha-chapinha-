import { Lock } from "lucide-react";

export default function PrivacyNotice() {
  return (
    <section className="mx-auto max-w-[800px] px-4 py-10">
      <div className="flex gap-4 rounded-2xl border-2 border-dashed border-azul/30 p-5">
        <Lock className="mt-0.5 shrink-0 text-azul" size={24} aria-hidden />
        <div>
          <h2 className="font-display text-3xl uppercase leading-none text-azul">Sua colinha é só sua</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-700">
            Os números que você digita ficam salvos apenas neste aparelho e não são enviados para nenhum servidor. Para
            apagar, use “Limpar colinha”.
          </p>
        </div>
      </div>
    </section>
  );
}
