import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      {children}
    </div>
  );
}
