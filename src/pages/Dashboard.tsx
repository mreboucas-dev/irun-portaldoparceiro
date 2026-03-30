import { kpiData, resgatesPorCategoria, engajamentoSemanal } from "@/data/mockData";
import { KpiCard } from "@/components/KpiCard";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

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
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do impacto iRun</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} delay={i * 100} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard className="animate-fade-in-up stagger-4">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Resgates por Categoria</h3>
          <ChartContainer config={barChartConfig} className="h-[220px] sm:h-[300px]">
            <BarChart data={resgatesPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={4} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="alimentacao" stackId="a" fill="var(--color-alimentacao)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="transporte" stackId="a" fill="var(--color-transporte)" />
              <Bar dataKey="lazer" stackId="a" fill="var(--color-lazer)" />
              <Bar dataKey="saude" stackId="a" fill="var(--color-saude)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard className="animate-fade-in-up stagger-5">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Engajamento Semanal</h3>
          <ChartContainer config={lineChartConfig} className="h-[220px] sm:h-[300px]">
            <LineChart data={engajamentoSemanal}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semana" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={4} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} width={35} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="ativos" stroke="var(--color-ativos)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="resgates" stroke="var(--color-resgates)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </GlassCard>
      </div>
    </div>
  );
}
