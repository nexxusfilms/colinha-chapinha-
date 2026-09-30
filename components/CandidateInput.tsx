"use client";
import { forwardRef } from "react";
import type { Slot } from "@/types/candidate";

interface Props {
  slot: Slot;
  value: string;
  onChange: (v: string) => void;
  onComplete: () => void;
}

const CandidateInput = forwardRef<HTMLInputElement, Props>(function CandidateInput(
  { slot, value, onChange, onComplete },
  ref,
) {
  return (
    <input
      ref={ref}
      id={`input-${slot.key}`}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      enterKeyHint="next"
      maxLength={slot.digits}
      placeholder={"0".repeat(slot.digits)}
      value={value}
      aria-describedby={`info-${slot.key}`}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "").slice(0, slot.digits);
        onChange(v);
        if (v.length === slot.digits && v !== value) onComplete();
      }}
      className="digits-input w-full rounded-xl border-2 border-slate-200 bg-white px-2 py-1 text-center font-display text-[44px] leading-none tracking-[0.2em] text-azul outline-none transition focus:border-rosa focus:ring-4 focus:ring-rosa/15"
      style={{ maxWidth: `${slot.digits * 0.62 + 1.4}em`, fontSize: 44 }}
    />
  );
});

export default CandidateInput;
