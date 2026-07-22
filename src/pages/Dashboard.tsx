import {
  kpisDashboard,
  resgatesPorDia,
  resgatesPorHora,
  perfilFaixaEtaria,
  perfilTopCidades,
  perfilAtividadePredominante,
  comparativoCupons,
  avaliacaoEstabelecimento,
  empresaParceira,
  cuponsData,
  type TipoCupom,
} from "@/data/mockData";
import { useUtilizados } from "@/hooks/useUtilizados";
import { useTicketMedio, formatBRL } from "@/hooks/useTicketMedio";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Gift,
  Ticket,
  Percent,
  CheckCircle2,
  Star,
  MapPin,
  Activity,
  Trophy,
  Users,
  Repeat,
  Tag,
  DollarSign,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

function KpiCard({
  label,
  value,
  trend,
  hint,
  Icon,
  delay = 0,
  highlight = false,
  action,
}: {
  label: string;
  value: string | number;
  trend?: string;
  hint?: string;
  Icon: React.ElementType;
  delay?: number;
  highlight?: boolean;
  action?: React.ReactNode;
}) {
  const isPositive = !trend || !trend.startsWith("-");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: delay / 1000 }}
      whileHover={{ y: -3 }}
      className={cn(
        "glass-card rounded-xl p-5 sm:p-7",
        highlight && "ring-1 ring-primary/30 bg-primary/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</p>
            {action}
          </div>
          <p className={cn(
            "font-bold text-foreground tracking-tight",
            highlight ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
          )}>{value}</p>
          {trend && (
            <span className={cn("text-xs sm:text-sm font-medium mt-1 inline-block", isPositive ? "text-emerald-600" : "text-destructive")}>
              {trend} vs mês anterior
            </span>
          )}
          {hint && (
            <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

function TicketMedioEditor({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(String(value));

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setLocal(String(value));
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Editar ticket médio"
          className="w-5 h-5 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Pencil className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="space-y-3">
          <div>
            <Label htmlFor="ticket-medio" className="text-sm font-semibold">
              Ticket médio (R$)
            </Label>
            <p className="text-[11px] text-muted-foreground mt-1">
              Premissa informada por você. Usada para estimar faturamento —
              não é dado real de venda.
            </p>
          </div>
          <Input
            id="ticket-medio"
            type="number"
            min={0}
            inputMode="decimal"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const n = parseFloat(local);
                if (Number.isFinite(n) && n >= 0) {
                  onChange(n);
                  setOpen(false);
                }
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground"
              onClick={() => {
                const n = parseFloat(local);
                if (Number.isFinite(n) && n >= 0) {
                  onChange(n);
                  setOpen(false);
                }
              }}
            >
              Salvar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const dayChartConfig = { resgates: { label: "Resgates", color: "hsl(var(--primary))" } };
const hourChartConfig = { resgates: { label: "Resgates", color: "hsl(var(--accent))" } };

const tipoLabel: Record<TipoCupom, string> = {
  uso_unico: "Uso único",
  recorrente: "Recorrente",
};

export default function Dashboard() {
  const { getUtilizados } = useUtilizados();
  const { ticketMedio, setTicketMedio } = useTicketMedio();

  const totalUtilizados = cuponsData.reduce((acc, c) => acc + getUtilizados(c.id), 0);
  const faturamentoEstimado = totalUtilizados * ticketMedio;

  const usoUnico = cuponsData.filter((c) => c.tipo === "uso_unico");
  const somaResgatesUU = usoUnico.reduce((a, c) => a + c.resgates, 0);
  const somaUtilizadosUU = usoUnico.reduce((a, c) => a + getUtilizados(c.id), 0);
  const conversaoReal =
    usoUnico.length === 0 || somaResgatesUU === 0
      ? null
      : (somaUtilizadosUU / somaResgatesUU) * 100;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {empresaParceira.nome} · Visão geral de desempenho dos seus cupons
        </p>
      </div>

      {/* KPIs — Cupons utilizados + Faturamento estimado em destaque */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <KpiCard
          label="Cupons utilizados"
          value={totalUtilizados.toLocaleString("pt-BR")}
          hint="Soma editada em Meus Cupons"
          Icon={CheckCircle2}
          highlight
          delay={0}
        />
        <KpiCard
          label="Faturamento estimado"
          value={formatBRL(faturamentoEstimado)}
          hint={`estimativa · ticket médio ${formatBRL(ticketMedio)} × cupons utilizados`}
          Icon={DollarSign}
          highlight
          delay={60}
          action={<TicketMedioEditor value={ticketMedio} onChange={setTicketMedio} />}
        />
        <KpiCard
          label={kpisDashboard.resgatesMes.label}
          value={kpisDashboard.resgatesMes.value}
          trend={kpisDashboard.resgatesMes.trend}
          Icon={Gift}
          delay={120}
        />
        <KpiCard
          label={kpisDashboard.cuponsAtivos.label}
          value={kpisDashboard.cuponsAtivos.value}
          trend={kpisDashboard.cuponsAtivos.trend}
          Icon={Ticket}
          delay={180}
        />
        <KpiCard
          label="Taxa de conversão"
          value={conversaoReal === null ? "—" : `${conversaoReal.toFixed(1).replace(".", ",")}%`}
          hint="cupons de uso único"
          Icon={Percent}
          delay={240}
        />
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

      {/* Comparativo + Conversão por cupom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <GlassCard delay={800}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-accent" />
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              Comparativo de performance
            </h4>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">#</th>
                  <th className="text-left py-2 font-medium">Cupom</th>
                  <th className="text-right py-2 font-medium">Taxa resgate</th>
                  <th className="text-left py-2 font-medium pl-4">Melhor dia</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard delay={900}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h4 className="text-sm sm:text-base font-semibold text-foreground">Conversão por cupom</h4>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Uso único: % de conversão. Recorrente: usos por usuário.
          </p>
          <div className="space-y-4">
            {cuponsData.map((c) => {
              const utilizados = getUtilizados(c.id);
              const razao = c.resgates > 0 ? utilizados / c.resgates : 0;
              const isUU = c.tipo === "uso_unico";
              const conversaoPct = Math.min(100, Math.round(razao * 100));
              const usosPorUsuario = razao.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              });
              const barraPct = isUU
                ? conversaoPct
                : Math.min(100, Math.round((razao / 3) * 100));
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">{c.nome}</span>
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 gap-1 shrink-0 text-[10px] py-0"
                      >
                        {isUU ? <Tag className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
                        {tipoLabel[c.tipo]}
                      </Badge>
                    </div>
                    <span className={cn(
                      "text-sm font-bold shrink-0",
                      isUU ? "text-primary" : "text-accent"
                    )}>
                      {isUU ? `${conversaoPct}%` : `${usosPorUsuario}×`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span>{c.resgates} resgatados · {utilizados} utilizados</span>
                    <span>{isUU ? "conversão" : "por usuário"}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full", isUU ? "bg-primary" : "bg-accent")}
                      style={{ width: `${barraPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
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
