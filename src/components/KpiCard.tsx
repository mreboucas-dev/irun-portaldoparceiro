import { Gift, Leaf, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, boxShadow: "0 14px 36px -8px hsl(var(--primary) / 0.15)" }}
      className="glass-card rounded-xl p-6 transition-colors duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: (delay + 200) / 1000 }}
            className={`text-sm font-medium mt-1 inline-block ${isPositive ? "text-emerald-500" : "text-destructive"}`}
          >
            {trend}
          </motion.span>
        </div>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-md"
        >
          <Icon className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      </div>
    </motion.div>
  );
}
