import { kpiData, resgatesPorCategoria, engajamentoSemanal } from "@/data/mockData";
import { KpiCard } from "@/components/KpiCard";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line } from "recharts";

const barChartConfig = {
  alimentacao: { label: "Alimentação", color: "hsl(231 85% 32%)" },
  transporte: { label: "Transporte", color: "hsl(43 75% 49%)" },
  lazer: { label: "Lazer", color: "hsl(200 70% 50%)" },
  saude: { label: "Saúde", color: "hsl(150 60% 45%)" },
};

const lineChartConfig = {
  ativos: { label: "Usuários Ativos", color: "hsl(231 85% 32%)" },
  resgates: { label: "Resgates", color: "hsl(43 75% 49%)" },
};

export default function Dashboard() {
  const kpis = Object.values(kpiData);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do impacto iRun</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 100} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        <GlassCard className="animate-fade-in-up stagger-4">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Resgates por Categoria</h3>
          <ChartContainer config={barChartConfig} className="h-[240px] sm:h-[320px]">
            <BarChart data={resgatesPorCategoria}>
              <defs>
                <linearGradient id="gradAlimentacao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a3a8f" />
                  <stop offset="100%" stopColor="#0b2297" />
                </linearGradient>
                <linearGradient id="gradTransporte" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#daa520" />
                  <stop offset="100%" stopColor="#c4952a" />
                </linearGradient>
                <linearGradient id="gradLazer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1a3a8f" />
                </linearGradient>
                <linearGradient id="gradSaude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#daa520" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>
              </defs>
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickMargin={4} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} width={30} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="alimentacao" stackId="a" fill="url(#gradAlimentacao)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="transporte" stackId="a" fill="url(#gradTransporte)" />
              <Bar dataKey="lazer" stackId="a" fill="url(#gradLazer)" />
              <Bar dataKey="saude" stackId="a" fill="url(#gradSaude)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard className="animate-fade-in-up stagger-5">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Engajamento Semanal</h3>
          <ChartContainer config={lineChartConfig} className="h-[240px] sm:h-[320px]">
            <LineChart data={engajamentoSemanal}>
              <defs>
                <linearGradient id="gradAtivos" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1a3a8f" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="gradResgates" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c4952a" />
                  <stop offset="100%" stopColor="#daa520" />
                </linearGradient>
              </defs>
              <XAxis dataKey="semana" stroke="rgba(255,255,255,0.4)" fontSize={11} tickMargin={4} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} width={30} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="ativos" stroke="url(#gradAtivos)" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6" }} strokeLinecap="round" />
              <Line type="monotone" dataKey="resgates" stroke="url(#gradResgates)" strokeWidth={2.5} dot={{ r: 3, fill: "#daa520" }} strokeLinecap="round" />
            </LineChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </div>
  );
}
