import {
  Rocket,
  Newspaper,
  Wrench,
  Sparkles,
  Database,
  Tags,
  MessagesSquare,
  ShieldCheck,
  ClipboardList,
  FlaskConical,
  BadgeCheck,
  ImagePlus,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Rocket,
  Newspaper,
  Wrench,
  Sparkles,
  Database,
  Tags,
  MessagesSquare,
  ShieldCheck,
  ClipboardList,
  FlaskConical,
  BadgeCheck,
  ImagePlus,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}
