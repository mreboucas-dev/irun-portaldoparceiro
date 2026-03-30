import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, boxShadow: "0 12px 32px -8px hsl(var(--primary) / 0.12)" }}
      className={cn(
        "glass-card rounded-3xl p-5 sm:p-8 transition-colors duration-200 overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
