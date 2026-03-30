import { cuponsData, heatmapData } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pausado: "bg-accent/10 text-accent border-accent/20",
  Expirado: "bg-destructive/10 text-destructive border-destructive/20",
};

const ctrConfig = {
  ctr: { label: "CTR %", color: "hsl(43 75% 49%)" },
};

export default function Cupons() {
  const ctrData = cuponsData.map((c) => ({ nome: c.nome.split(" ").slice(0, 2).join(" "), ctr: c.ctr }));

  const maxHeat = Math.max(...heatmapData.map((h) => h.valor));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Cupons</h1>
        <p className="text-sm text-muted-foreground">Acompanhe o desempenho das suas recompensas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cuponsData.map((cupom, i) => (
          <GlassCard key={cupom.id} className="animate-fade-in-up" delay={i * 80}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{cupom.nome}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{cupom.categoria}</p>
              </div>
              <Badge variant="outline" className={statusColors[cupom.status]}>{cupom.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">CTR</p>
                <p className="font-bold text-foreground">{cupom.ctr}%</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Resgates</p>
                <p className="font-bold text-foreground">{cupom.resgates}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Validade: {cupom.validade}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="animate-fade-in-up stagger-4">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">CTR por Cupom</h3>
          <ChartContainer config={ctrConfig} className="h-[220px] sm:h-[250px]">
            <BarChart data={ctrData} layout="vertical">
              <defs>
                <linearGradient id="gradCtr" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c4952a" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              <XAxis type="number" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis dataKey="nome" type="category" width={55} stroke="#94a3b8" fontSize={9} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ctr" fill="url(#gradCtr)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard className="animate-fade-in-up stagger-5">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Heatmap de Resgates</h3>
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="min-w-[500px]">
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `40px repeat(17, 1fr)` }}>
                <div />
                {Array.from({ length: 17 }, (_, i) => (
                  <div key={i} className="text-[10px] text-center text-muted-foreground">{i + 6}h</div>
                ))}
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
                  <>
                    <div key={dia} className="text-[10px] text-muted-foreground flex items-center">{dia}</div>
                    {heatmapData
                      .filter((h) => h.dia === dia)
                      .map((h, i) => {
                        const intensity = h.valor / maxHeat;
                        return (
                          <div
                            key={`${dia}-${i}`}
                            className="aspect-square rounded-sm transition-all hover:scale-125"
                            style={{ backgroundColor: `hsl(231 85% 32% / ${0.1 + intensity * 0.8})` }}
                            title={`${h.dia} ${h.hora}h: ${h.valor} resgates`}
                          />
                        );
                      })}
                  </>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
