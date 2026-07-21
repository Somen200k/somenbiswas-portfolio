import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { getPrimaryPlatform, PLATFORMS } from "@/lib/platforms";

export function NexGuildCta({ category }: { category?: string }) {
  const platform = (category && getPrimaryPlatform(category)) || PLATFORMS.nexguild;
  const link = platform.url || platform.youtube || platform.telegram || "https://www.nexguild.in";

  return (
    <div className="gradient-border relative mt-16 overflow-hidden rounded-3xl glass-strong px-8 py-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(245,158,11,0.14),transparent_70%)]" />
      <p className="relative font-mono text-xs uppercase tracking-[0.25em] text-gold">
        {platform.name}
      </p>
      <h3 className="relative mt-3 text-2xl font-semibold sm:text-3xl">
        <GradientText>{platform.tagline}</GradientText>
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-sm text-muted">{platform.description}</p>
      <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button href={link} variant="primary">
          {platform.url ? `Visit ${platform.name}` : `Watch ${platform.name}`}
        </Button>
        {platform.telegram && (
          <Button href={platform.telegram} variant="secondary">
            <Send className="h-4 w-4" /> Join on Telegram
          </Button>
        )}
      </div>
    </div>
  );
}
