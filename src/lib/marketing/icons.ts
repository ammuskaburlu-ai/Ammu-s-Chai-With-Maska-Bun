import {
  Coffee,
  Heart,
  IndianRupee,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
  Users,
  Clock,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  coffee: Coffee,
  heart: Heart,
  "indian-rupee": IndianRupee,
  leaf: Leaf,
  "shield-check": ShieldCheck,
  star: Star,
  truck: Truck,
  users: Users,
  clock: Clock,
};

export const MARKETING_ICON_OPTIONS = Object.keys(ICON_MAP);

export function getMarketingIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? ShieldCheck;
}
