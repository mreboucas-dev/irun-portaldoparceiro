import { esgAnteDepois, saudeColetiva } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer } from "@/components/ui/chart";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Award, ArrowRight } from "lucide-react";
import { useState } from "react";

const radarConfig = {
  score: { label: "Score", color: "hsl(231 85% 32%)" },
};

export default function Relatorios() {
  const [carouselIdx, setCarouselIdx] = useState(0);

  const metrics = [
    { label: "Emissão CO₂ (ton/mês)", antes: esgAnteDepois.antes.co2, depois: esgAnteDepois.depois.co2, unit: "ton" },
    { label: "Deslocamento Motorizado (%)", antes: esgAnteDepois.antes.deslocamento, depois: esgAnteDepois.depois.deslocamento, unit: "%" },
    { label: "Sedentarismo (%)", antes: esgAnteDepois.antes.sedentarismo, depois: esgAnteDepois.depois.sedentarismo, unit: "%" },
  ];

  const current = metrics[carouselIdx];

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
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Antes e Depois — {current.label}</h3>
          <div className="flex items-center justify-center gap-4 sm:gap-8 py-6 sm:py-8">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Antes</p>
              <p className="text-2xl sm:text-4xl font-bold text-destructive">{current.antes}{current.unit === "%" ? "%" : ""}</p>
              {current.unit === "ton" && <p className="text-xs text-muted-foreground">ton/mês</p>}
            </div>
            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">Depois</p>
              <p className="text-2xl sm:text-4xl font-bold" style={{ color: "hsl(150 60% 45%)" }}>{current.depois}{current.unit === "%" ? "%" : ""}</p>
              {current.unit === "ton" && <p className="text-xs text-muted-foreground">ton/mês</p>}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            {metrics.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === carouselIdx ? "gold-gradient" : "bg-muted"}`}
              />
            ))}
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
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="area" stroke="rgba(255,255,255,0.4)" fontSize={10} />
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
