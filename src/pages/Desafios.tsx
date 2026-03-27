import { desafiosData, rankingData } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Progress } from "@/components/ui/progress";

export default function Desafios() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Desafios Corporativos</h1>
        <p className="text-muted-foreground">Gamificação e engajamento da equipe</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {desafiosData.map((d, i) => {
          const pct = Math.round((d.atual / d.meta) * 100);
          return (
            <GlassCard key={d.id} className="animate-fade-in-up" delay={i * 100}>
              <div className="text-center mb-4">
                <span className="text-4xl">{d.icone}</span>
              </div>
              <h3 className="font-semibold text-foreground text-center">{d.nome}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">{d.participantes} participantes</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{d.atual.toLocaleString()} {d.unidade}</span>
                  <span className="font-medium text-foreground">{d.meta.toLocaleString()} {d.unidade}</span>
                </div>
                <Progress value={pct} className="h-3" />
                <p className="text-center text-sm font-semibold text-accent">{pct}% concluído</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="animate-fade-in-up stagger-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">🏆 Ranking Geral</h3>
        <div className="space-y-3">
          {rankingData.map((r) => (
            <div key={r.pos} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-2xl w-8 text-center">{r.medalha || `#${r.pos}`}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{r.nome}</p>
              </div>
              <span className="font-bold font-mono text-accent">{r.pontos} pts</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
