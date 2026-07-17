import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";

export function NexGuildCta() {
  return (
    <div className="gradient-border relative mt-16 overflow-hidden rounded-3xl glass-strong px-8 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(245,158,11,0.14),transparent_70%)]" />
      <p className="relative font-mono text-xs uppercase tracking-[0.25em] text-gold">
        NexGuild
      </p>
      <h3 className="relative mt-3 text-2xl font-semibold sm:text-3xl">
        Earn real money completing <GradientText>tasks &amp; surveys</GradientText>
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-sm text-muted">
        Join NexGuild&apos;s global contributor network, earn NexCoins, and
        redeem them for real gift vouchers.
      </p>
      <div className="relative mt-7">
        <Button href="https://nexguild.in" variant="primary">
          Join NexGuild Free
        </Button>
      </div>
    </div>
  );
}
