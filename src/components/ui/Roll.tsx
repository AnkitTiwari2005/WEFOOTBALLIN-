/** Animated number roll: each digit is a 0-9 column that slides. Transform-only. */
export function Roll({ value, pad = 2 }: { value: number; pad?: number }) {
  const digits = String(value).padStart(pad, "0").split("");
  return (
    <span className="inline-flex h-[1em] overflow-hidden leading-none tabular-nums" role="img" aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden className="block h-[1em] overflow-hidden">
          <span className="flex flex-col transition-transform duration-500 ease-expo" style={{ transform: `translateY(-${Number(d)}em)` }}>
            {Array.from({ length: 10 }, (_, n) => <span key={n} className="block h-[1em] leading-[1em]">{n}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}
