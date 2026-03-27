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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios ESG & Life</h1>
          <p className="text-muted-foreground">Impacto ambiental e saúde coletiva</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => alert("Simulação: PDF seria gerado aqui")}>
          <Download className="w-4 h-4" /> Exportar PDF
        </Button>
      </div>

      {/* Selo */}
      <GlassCard className="animate-fade-in-up flex items-center gap-4">
        <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center shadow-lg">
          <Award className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Empresa Saudável iRun</h3>
          <p className="text-sm text-muted-foreground">Sua empresa atingiu o selo de excelência em saúde e sustentabilidade</p>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antes e Depois carousel */}
        <GlassCard className="animate-fade-in-up stagger-2">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Antes e Depois — {current.label}</h3>
          <div className="flex items-center justify-center gap-8 py-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Antes</p>
              <p className="text-4xl font-bold text-destructive">{current.antes}{current.unit === "%" ? "%" : ""}</p>
              {current.unit === "ton" && <p className="text-xs text-muted-foreground">ton/mês</p>}
            </div>
            <ArrowRight className="w-8 h-8 text-accent" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Depois</p>
              <p className="text-4xl font-bold text-emerald-500">{current.depois}{current.unit === "%" ? "%" : ""}</p>
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

        {/* Radar Chart */}
        <GlassCard className="animate-fade-in-up stagger-3">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Score de Saúde Coletivo</h3>
          <ChartContainer config={radarConfig} className="h-[300px]">
            <RadarChart data={saudeColetiva} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="area" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="var(--color-score)" fill="var(--color-score)" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ChartContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Dados agregados e anonimizados — em conformidade com a LGPD
          </p>
        </GlassCard>
      </div>

      {/* LGPD Placeholder */}
      <GlassCard className="animate-fade-in-up stagger-4 border-accent/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
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
