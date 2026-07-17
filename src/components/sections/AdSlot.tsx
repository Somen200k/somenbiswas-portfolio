export function AdSlot({ slot }: { slot: "blog-top" | "blog-middle" | "blog-end" }) {
  return (
    <div
      data-ad-slot={slot}
      className="my-8 flex min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-border text-xs uppercase tracking-wide text-dim"
    >
      Ad Slot — {slot}
    </div>
  );
}
