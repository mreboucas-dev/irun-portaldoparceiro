import {
  kpisDashboard,
  resgatesPorDia,
  resgatesPorHora,
  perfilFaixaEtaria,
  perfilTopCidades,
  perfilAtividadePredominante,
  comparativoCupons,
  benchmarking,
  avaliacaoEstabelecimento,
  empresaParceira,
} from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import {
  Gift,
  Ticket,
  Percent,
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  Activity,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const kpiIcons = [Gift, Ticket, Percent, Users];

function KpiCard({
  label,
  value,
  trend,
  Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  trend: string;
  Icon: React.ElementType;
  delay?: number;
}) {
  const isPositive = !trend.startsWith("-");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: delay / 1000 }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-xl p-5 sm:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</p>
          <span className={cn("text-xs sm:text-sm font-medium mt-1 inline-block", isPositive ? "text-emerald-600" : "text-destructive")}>
            {trend} vs mês anterior
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

const dayChartConfig = { resgates: { label: "Resgates", color: "hsl(var(--primary))" } };
const hourChartConfig = { resgates: { label: "Resgates", color: "hsl(var(--accent))" } };

export default function Dashboard() {
  const kpis = Object.values(kpisDashboard);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {empresaParceira.nome} · Visão geral de desempenho dos seus cupons
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} {...kpi} Icon={kpiIcons[i]} delay={i * 80} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        <GlassCard delay={300}>
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">
            Resgates por dia da semana
          </h3>
          <ChartContainer config={dayChartConfig} className="h-[240px] sm:h-[300px]">
            <BarChart data={resgatesPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={32} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="resgates" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </GlassCard>

        <GlassCard delay={400}>
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">
            Resgates por hora do dia
          </h3>
          <ChartContainer config={hourChartConfig} className="h-[240px] sm:h-[300px]">
            <LineChart data={resgatesPorHora}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="hora" stroke="hsl(var(--muted-foreground))" fontSize={9} interval={2} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} width={32} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="resgates" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 2.5, fill: "hsl(var(--accent))" }} />
            </LineChart>
          </ChartContainer>
        </GlassCard>
      </div>

      {/* Perfil Anonimizado */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">
          Perfil anonimizado do resgatador
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Dados agregados e anônimos, conforme LGPD.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <GlassCard delay={500}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Faixa etária</h4>
            </div>
            <div className="space-y-2">
              {perfilFaixaEtaria.map((f) => (
                <div key={f.faixa}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{f.faixa}</span>
                    <span className="text-muted-foreground">{f.percentual}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${f.percentual}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={600}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Top 3 cidades</h4>
            </div>
            <ol className="space-y-3">
              {perfilTopCidades.map((c, i) => (
                <li key={c.cidade} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{c.cidade}</p>
                    <p className="text-xs text-muted-foreground">{c.percentual}% dos resgates</p>
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>

          <GlassCard delay={700}>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold text-foreground">Nível de atividade predominante</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Escala iRun (agregado anônimo do grupo):
            </p>
            <div className="space-y-1.5">
              {perfilAtividadePredominante.escala.map((nivel) => {
                const ativo = nivel === perfilAtividadePredominante.predominante;
                return (
                  <div
                    key={nivel}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs flex items-center justify-between",
                      ativo ? "bg-primary/10 border border-primary/30 text-primary font-semibold" : "bg-muted/50 text-muted-foreground"
                    )}
                  >
                    <span>{nivel}</span>
                    {ativo && <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-[10px]">predominante</Badge>}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Comparativo + Benchmarking + Avaliação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <GlassCard className="lg:col-span-2" delay={800}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-accent" />
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              Comparativo de performance entre cupons
            </h4>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">Cupom</th>
                  <th className="text-right py-2 font-medium">Taxa de resgate</th>
                  <th className="text-left py-2 font-medium pl-4">Melhor dia</th>
                  <th className="text-left py-2 font-medium">Melhor horário</th>
                </tr>
              </thead>
              <tbody>
                {comparativoCupons.map((c, i) => (
                  <tr key={c.codigo} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-muted-foreground">{i + 1}º</td>
                    <td className="py-3">
                      <p className="font-medium text-foreground">{c.nome}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{c.codigo}</p>
                    </td>
                    <td className="py-3 text-right font-bold text-primary">{c.taxaResgate}%</td>
                    <td className="py-3 pl-4 text-foreground">{c.melhorDia}</td>
                    <td className="py-3 text-foreground">{c.melhorHorario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard delay={900}>
          <div className="flex items-center gap-2 mb-3">
            {benchmarking.diferencaPct >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <h4 className="text-sm font-semibold text-foreground">Benchmarking de mercado</h4>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {benchmarking.diferencaPct.toFixed(1)}%
          </p>
          <p className="text-sm text-emerald-600 font-medium mb-3">acima da média do segmento</p>
          <p className="text-xs text-muted-foreground">
            Sua taxa de conversão ({benchmarking.taxaEmpresa}%) está {benchmarking.diferencaPct.toFixed(1)}% acima da média do segmento <strong>{benchmarking.segmento}</strong> ({benchmarking.mediaSegmento}%).
          </p>
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Dado anônimo agregado do segmento.
          </p>
        </GlassCard>
      </div>

      {/* Avaliação do Estabelecimento */}
      <GlassCard delay={1000}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <h4 className="text-sm sm:text-base font-semibold text-foreground">
                Avaliação do estabelecimento
              </h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Avaliações enviadas por usuários iRun após o uso do cupom.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground leading-none">
                {avaliacaoEstabelecimento.media.toFixed(1)}
              </p>
              <div className="flex gap-0.5 justify-end mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-3.5 h-3.5",
                      s <= Math.round(avaliacaoEstabelecimento.media)
                        ? "text-accent fill-accent"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {avaliacaoEstabelecimento.total} avaliações
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
