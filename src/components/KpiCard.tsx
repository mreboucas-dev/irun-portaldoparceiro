import { Gift, Leaf, Heart, Users } from "lucide-react";
import { GlassCard } from "./GlassCard";

const iconMap: Record<string, React.ElementType> = {
  gift: Gift,
  leaf: Leaf,
  heart: Heart,
  users: Users,
};

interface KpiCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: string;
  delay?: number;
}

export function KpiCard({ label, value, trend, icon, delay = 0 }: KpiCardProps) {
  const Icon = iconMap[icon] || Gift;
  const isPositive = trend.startsWith("+");

  return (
    <GlassCard className="animate-fade-in-up" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground animate-count-up">{value}</p>
          <span className={`text-sm font-medium mt-1 inline-block ${isPositive ? "text-emerald-500" : "text-destructive"}`}>
            {trend}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-md">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </GlassCard>
  );
}
