import { desafiosData, rankingData } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Desafios() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Desafios Corporativos</h1>
        <p className="text-sm text-muted-foreground">Gamificação e engajamento da equipe</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {desafiosData.map((d, i) => {
          const pct = Math.round((d.atual / d.meta) * 100);
          return (
            <GlassCard key={d.id} className="animate-fade-in-up" delay={i * 100}>
              <div className="text-center mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl">{d.icone}</span>
              </div>
              <h3 className="font-semibold text-foreground text-center text-sm sm:text-base">{d.nome}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">{d.participantes} participantes</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{d.atual.toLocaleString()} {d.unidade}</span>
                  <span className="font-medium text-foreground">{d.meta.toLocaleString()} {d.unidade}</span>
                </div>
                <Progress value={pct} className="h-2.5 sm:h-3" />
                <p className="text-center text-xs sm:text-sm font-semibold text-accent">{pct}% concluído</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="animate-fade-in-up stagger-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">🏆 Ranking Geral</h3>
        <div className="space-y-2 sm:space-y-3">
          {rankingData.map((r, i) => (
            <motion.div
              key={r.pos}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ x: 4, backgroundColor: "hsl(var(--muted) / 0.3)" }}
              className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg transition-colors"
            >
              <span className="text-xl sm:text-2xl w-7 sm:w-8 text-center flex-shrink-0">{r.medalha || `#${r.pos}`}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm sm:text-base truncate">{r.nome}</p>
              </div>
              <span className="font-bold font-mono text-accent text-sm sm:text-base flex-shrink-0">{r.pontos} pts</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
