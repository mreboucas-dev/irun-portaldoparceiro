import { esgAnteDepois, saudeColetiva } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer } from "@/components/ui/chart";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Award, TrendingDown, Leaf, Car, Activity } from "lucide-react";
import { useState } from "react";

const radarConfig = {
  score: { label: "Score", color: "hsl(231 85% 32%)" },
};

export default function Relatorios() {
  const [carouselIdx, setCarouselIdx] = useState(0);

  const metrics = [
    { label: "Emissão CO₂ (ton/mês)", shortLabel: "CO₂", antes: esgAnteDepois.antes.co2, depois: esgAnteDepois.depois.co2, unit: "ton", icon: Leaf },
    { label: "Deslocamento Motorizado (%)", shortLabel: "Deslocamento", antes: esgAnteDepois.antes.deslocamento, depois: esgAnteDepois.depois.deslocamento, unit: "%", icon: Car },
    { label: "Sedentarismo (%)", shortLabel: "Sedentarismo", antes: esgAnteDepois.antes.sedentarismo, depois: esgAnteDepois.depois.sedentarismo, unit: "%", icon: Activity },
  ];

  const current = metrics[carouselIdx];
  const reduction = Math.round(((current.antes - current.depois) / current.antes) * 100);
  const maxVal = current.antes;
  const IconComponent = current.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Relatórios ESG & Life</h1>
          <p className="text-sm text-muted-foreground">Impacto ambiental e saúde coletiva</p>
        </div>
        <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => alert("Simulação: PDF seria gerado aqui")}>
          <Download className="w-4 h-4" /> Exportar PDF
        </Button>
      </div>

      <GlassCard className="animate-fade-in-up flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full gold-gradient flex items-center justify-center shadow-lg flex-shrink-0">
          <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base sm:text-lg">Empresa Saudável iRun</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Sua empresa atingiu o selo de excelência em saúde e sustentabilidade</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="animate-fade-in-up stagger-2">
          <h3 className="text-base sm:text-lg font-semibold text-foreground text-center mb-4">Antes e Depois</h3>

          <div className="flex items-center justify-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/50 mb-4 w-fit mx-auto max-w-full overflow-x-auto">
            {metrics.map((m, i) => {
              const TabIcon = m.icon;
              return (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
                    i === carouselIdx
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {m.shortLabel}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mb-3">{current.label}</p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card Antes */}
            <div className="bg-destructive/5 border border-destructive/15 rounded-2xl p-4 sm:p-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-destructive/70">Antes</span>
              <p className="text-2xl sm:text-3xl font-bold text-destructive mt-2">
                {current.antes}{current.unit === "%" ? "%" : ""}
              </p>
              {current.unit === "ton" && <p className="text-xs text-muted-foreground mt-1">ton/mês</p>}
              <div className="mt-3 h-2 rounded-full bg-destructive/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-destructive/60 transition-all duration-700"
                  style={{ width: `${(current.antes / maxVal) * 100}%` }}
                />
              </div>
            </div>

            {/* Card Depois */}
            <div className="bg-emerald-50 border border-emerald-200/50 rounded-2xl p-4 sm:p-5 dark:bg-emerald-950/20 dark:border-emerald-800/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Depois</span>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {current.depois}{current.unit === "%" ? "%" : ""}
              </p>
              {current.unit === "ton" && <p className="text-xs text-muted-foreground mt-1">ton/mês</p>}
              <div className="mt-3 h-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500/70 transition-all duration-700"
                  style={{ width: `${(current.depois / maxVal) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badge de redução */}
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <TrendingDown className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">Redução de {reduction}%</span>
            </div>
          </div>

        </GlassCard>

        <GlassCard className="animate-fade-in-up stagger-3">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Score de Saúde Coletivo</h3>
          <ChartContainer config={radarConfig} className="h-[240px] sm:h-[300px]">
            <RadarChart data={saudeColetiva} outerRadius="65%">
              <defs>
                <linearGradient id="gradRadar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a3a8f" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#daa520" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="area" stroke="#64748b" fontSize={10} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#3b82f6" fill="url(#gradRadar)" strokeWidth={2} />
            </RadarChart>
          </ChartContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Dados agregados e anonimizados — em conformidade com a LGPD
          </p>
        </GlassCard>
      </div>

      <GlassCard className="animate-fade-in-up stagger-4 border-accent/30">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🔒</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Dados individuais protegidos</p>
            <p className="text-xs text-muted-foreground">
              Relatórios individuais requerem consentimento explícito do colaborador. Aguardando consentimento para 12 colaboradores.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
