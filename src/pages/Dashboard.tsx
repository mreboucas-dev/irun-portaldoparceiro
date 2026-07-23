import {
  kpisDashboard,
  resgatesPorDia,
  resgatesPorHora,
  comparativoCupons,
  avaliacaoEstabelecimento,
  empresaParceira,
  cuponsData,
  type TipoCupom,
} from "@/data/mockData";
import { publicoDoCupom, publicoTodos, type PublicoAgregado } from "@/data/publicoPorCupom";
import { useUtilizados, useUtilizadosLastUpdate } from "@/hooks/useUtilizados";
import { useTicketMedio, formatBRL } from "@/hooks/useTicketMedio";
import { GlassCard } from "@/components/GlassCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowUp,
  ArrowDown,
  Minus,
  Crown,
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  Send,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { gerarInsightsParceiro, type InsightItem } from "@/data/insightsParceiro";

function HelpPopover({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="w-6 h-6 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 text-xs leading-relaxed">
        {children}
      </PopoverContent>
    </Popover>
  );
}


type DeltaKind = "pct" | "pp";

function Delta({ current, previous, kind = "pct" }: { current: number | null; previous: number | null; kind?: DeltaKind }) {
  if (current === null || previous === null || !Number.isFinite(current) || !Number.isFinite(previous)) return null;
  let diff: number;
  let label: string;
  if (kind === "pp") {
    diff = current - previous;
    label = `${diff >= 0 ? "+" : ""}${diff.toFixed(1).replace(".", ",")} p.p. vs mês anterior`;
  } else {
    if (previous === 0) return null;
    diff = ((current - previous) / previous) * 100;
    label = `${Math.abs(diff).toFixed(0)}% vs mês anterior`;
  }
  const isUp = diff > 0.05;
  const isDown = diff < -0.05;
  const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;
  const color = isUp ? "text-emerald-600" : isDown ? "text-destructive" : "text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs sm:text-sm font-medium mt-1", color)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  Icon,
  delay = 0,
  highlight = false,
  action,
  delta,
}: {
  label: string;
  value: string | number;
  hint?: string;
  Icon: React.ElementType;
  delay?: number;
  highlight?: boolean;
  action?: React.ReactNode;
  delta?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: delay / 1000 }}
      whileHover={{ y: -3 }}
      className={cn(
        "glass-card rounded-xl p-4 sm:p-6",
        highlight && "ring-1 ring-primary/30 bg-primary/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 font-medium">{label}</p>
          <p className={cn(
            "font-bold text-foreground tracking-tight break-words",
            highlight
              ? "text-lg sm:text-xl lg:text-2xl"
              : "text-xl sm:text-2xl"
          )}>{value}</p>

          {delta}
          {hint && (
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{hint}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            highlight ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          )}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          {action}
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

const severidadeStyle: Record<InsightItem["severidade"], { ring: string; bg: string; icon: string; badge: string; label: string }> = {
  critico: {
    ring: "ring-destructive/30",
    bg: "bg-destructive/[0.04]",
    icon: "bg-destructive/10 text-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/30",
    label: "Crítico",
  },
  atencao: {
    ring: "ring-accent/40",
    bg: "bg-accent/[0.05]",
    icon: "bg-accent/15 text-accent",
    badge: "bg-accent/10 text-accent border-accent/30",
    label: "Atenção",
  },
  info: {
    ring: "ring-primary/20",
    bg: "bg-primary/[0.03]",
    icon: "bg-primary/10 text-primary",
    badge: "bg-primary/5 text-primary border-primary/20",
    label: "Insight",
  },
};

function InsightCard({ item, delay = 0 }: { item: InsightItem; delay?: number }) {
  const s = severidadeStyle[item.severidade];
  const Icon =
    item.tipo === "alerta"
      ? item.severidade === "critico"
        ? AlertOctagon
        : AlertTriangle
      : Lightbulb;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className={cn("glass-card rounded-xl p-4 sm:p-5 ring-1", s.ring, s.bg)}
    >
      <div className="flex items-start gap-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.icon)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] py-0", s.badge)}>
              {s.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {item.tipo === "alerta" ? "Alerta" : "Insight"}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-snug">{item.titulo}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.descricao}</p>
          {item.cta && (
            <div className="mt-3">
              <Button asChild size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                <Link to={item.cta.href}>
                  {item.cta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function UpdateReminder() {
  const lastUpdate = useUtilizadosLastUpdate();
  const dias = lastUpdate
    ? Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const precisa = lastUpdate === null || (dias !== null && dias >= 7);
  if (!precisa) return null;
  const msg =
    lastUpdate === null
      ? "Você ainda não atualizou os cupons utilizados."
      : `Última atualização há ${dias} dias.`;
  return (
    <div className="glass-card rounded-xl px-4 py-3 ring-1 ring-accent/30 bg-accent/[0.05] flex items-start sm:items-center gap-3 flex-col sm:flex-row">
      <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
        <Info className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Atualize os cupons utilizados para manter os números precisos
        </p>
        <p className="text-xs text-muted-foreground">{msg}</p>
      </div>
      <Button asChild size="sm" variant="outline" className="h-8 text-xs shrink-0 self-end sm:self-auto">
        <Link to="/cupons">
          Atualizar agora <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

function PerfilPublicoSection() {
  const [escopo, setEscopo] = useState<string>("todos");
  const cupomSel = cuponsData.find((c) => String(c.id) === escopo);
  const publico: PublicoAgregado = useMemo(
    () => (cupomSel ? publicoDoCupom(cupomSel) : publicoTodos()),
    [cupomSel]
  );
  const faixaTop = [...publico.faixaEtaria].sort((a, b) => b.percentual - a.percentual)[0];
  const cidadeTop = publico.topCidades[0];
  const escopoLabel = cupomSel ? `do cupom "${cupomSel.nome}"` : "geral (todos os cupons)";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Perfil anonimizado do resgatador
          </h2>
          <p className="text-xs text-muted-foreground">
            Dados agregados e anônimos, conforme LGPD. Sem identificação individual.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">Ver público de</span>
          <Select value={escopo} onValueChange={setEscopo}>
            <SelectTrigger className="h-8 text-xs w-[210px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cupons</SelectItem>
              {cuponsData.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {publico.amostraPequena && (
        <div className="mb-3 text-[11px] text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
          Amostra pequena ({publico.amostra} resgates) — dados agregados, use com cautela.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <GlassCard delay={500}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Faixa etária</h4>
          </div>
          <div className="space-y-2">
            {publico.faixaEtaria.map((f) => (
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
            <h4 className="text-sm font-semibold text-foreground">Top cidades</h4>
          </div>
          <ol className="space-y-3">
            {publico.topCidades.map((c, i) => (
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
            Agregado anônimo do grupo:
          </p>
          <div className="px-3 py-2 rounded-lg text-sm bg-primary/10 border border-primary/30 text-primary font-semibold flex items-center justify-between">
            <span>{publico.atividadePredominante}</span>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-[10px]">
              predominante
            </Badge>
          </div>
        </GlassCard>
      </div>

      {/* Ponte público → ação */}
      <GlassCard className="mt-4" delay={800}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <Lightbulb className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">Como usar esse público</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Público {escopoLabel}: majoritariamente <span className="font-medium text-foreground">{faixaTop.faixa}</span>{" "}
                em <span className="font-medium text-foreground">{cidadeTop.cidade}</span>, praticando{" "}
                <span className="font-medium text-foreground">{publico.atividadePredominante}</span> —
                considere ofertas alinhadas a esse perfil.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-primary text-primary-foreground shrink-0">
            <Link to="/solicitacoes">
              <Send className="w-3.5 h-3.5 mr-1.5" /> Criar oferta
            </Link>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}



export default function Dashboard() {
  const { getUtilizados } = useUtilizados();
  const { ticketMedio, setTicketMedio } = useTicketMedio();

  const totalUtilizados = cuponsData.reduce((acc, c) => acc + getUtilizados(c.id), 0);
  const totalUtilizadosAnterior = cuponsData.reduce((acc, c) => acc + c.utilizadosAnterior, 0);
  const faturamentoEstimado = totalUtilizados * ticketMedio;
  const faturamentoAnterior = totalUtilizadosAnterior * ticketMedio;

  const totalResgates = cuponsData.reduce((acc, c) => acc + c.resgates, 0);
  const totalResgatesAnterior = cuponsData.reduce((acc, c) => acc + c.resgatesAnterior, 0);

  const usoUnico = cuponsData.filter((c) => c.tipo === "uso_unico");
  const somaResgatesUU = usoUnico.reduce((a, c) => a + c.resgates, 0);
  const somaUtilizadosUU = usoUnico.reduce((a, c) => a + getUtilizados(c.id), 0);
  const somaResgatesUUAnt = usoUnico.reduce((a, c) => a + c.resgatesAnterior, 0);
  const somaUtilizadosUUAnt = usoUnico.reduce((a, c) => a + c.utilizadosAnterior, 0);
  const conversaoReal =
    usoUnico.length === 0 || somaResgatesUU === 0
      ? null
      : (somaUtilizadosUU / somaResgatesUU) * 100;
  const conversaoAnterior =
    usoUnico.length === 0 || somaResgatesUUAnt === 0
      ? null
      : (somaUtilizadosUUAnt / somaResgatesUUAnt) * 100;

  type OrderKey = "receita" | "utilizados" | "conversao" | "resgates";
  const [orderBy, setOrderBy] = useState<OrderKey>("receita");

  const cuponsOrdenados = useMemo(() => {
    const arr = cuponsData.map((c) => {
      const utilizados = getUtilizados(c.id);
      const razao = c.resgates > 0 ? utilizados / c.resgates : 0;
      return {
        cupom: c,
        utilizados,
        razao,
        receita: utilizados * ticketMedio,
      };
    });
    arr.sort((a, b) => {
      switch (orderBy) {
        case "receita": return b.receita - a.receita;
        case "utilizados": return b.utilizados - a.utilizados;
        case "conversao": return b.razao - a.razao;
        case "resgates": return b.cupom.resgates - a.cupom.resgates;
      }
    });
    return arr;
  }, [orderBy, ticketMedio, getUtilizados]);

  const insights = useMemo(
    () => gerarInsightsParceiro({ cupons: cuponsData, getUtilizados, ticketMedio }),
    [getUtilizados, ticketMedio]
  );

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {empresaParceira.nome} · Visão geral de desempenho dos seus cupons
          </p>
        </div>
        <HelpPopover ariaLabel="Entenda as métricas do funil">
          <p className="font-semibold text-foreground mb-1">Entenda as métricas</p>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Resgatados</span> = cupons que o cliente pegou no app iRun.{" "}
            <span className="font-medium text-foreground">Utilizados</span> = cupons efetivamente usados na sua plataforma (você
            informa em Meus Cupons). A <span className="font-medium text-foreground">conversão</span> só é calculada em cupons de{" "}
            <span className="font-medium">uso único</span>; nos <span className="font-medium">recorrentes</span> medimos usos por
            usuário (recompra).
          </p>
        </HelpPopover>
      </div>

      <UpdateReminder />

      {/* KPIs — Cupons utilizados + Faturamento estimado em destaque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-4 sm:gap-5">

        <KpiCard
          label="Cupons utilizados"
          value={totalUtilizados.toLocaleString("pt-BR")}
          hint="Soma editada em Meus Cupons"
          Icon={CheckCircle2}
          highlight
          delay={0}
          delta={<Delta current={totalUtilizados} previous={totalUtilizadosAnterior} />}
        />
        <KpiCard
          label="Faturamento estimado"
          value={formatBRL(faturamentoEstimado)}
          hint={`estimativa · ticket médio ${formatBRL(ticketMedio)} × cupons utilizados`}
          Icon={DollarSign}
          highlight
          delay={60}
          action={<TicketMedioEditor value={ticketMedio} onChange={setTicketMedio} />}
          delta={<Delta current={faturamentoEstimado} previous={faturamentoAnterior} />}
        />
        <KpiCard
          label="Cupons resgatados (mês)"
          value={totalResgates.toLocaleString("pt-BR")}
          Icon={Gift}
          delay={120}
          delta={<Delta current={totalResgates} previous={totalResgatesAnterior} />}
        />
        <KpiCard
          label={kpisDashboard.cuponsAtivos.label}
          value={kpisDashboard.cuponsAtivos.value}
          Icon={Ticket}
          delay={180}
        />
        <KpiCard
          label="Taxa de conversão"
          value={conversaoReal === null ? "—" : `${conversaoReal.toFixed(1).replace(".", ",")}%`}
          hint="cupons de uso único"
          Icon={Percent}
          delay={240}
          delta={<Delta current={conversaoReal} previous={conversaoAnterior} kind="pp" />}
        />
      </div>

      {/* Insights e alertas acionáveis */}
      {insights.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Insights e alertas
              </h2>
              <p className="text-xs text-muted-foreground">
                O que está acontecendo nos seus cupons agora e o que fazer a respeito.
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] bg-muted/40">
              {insights.length} {insights.length === 1 ? "item" : "itens"}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {insights.map((it, i) => (
              <InsightCard key={it.id} item={it} delay={i * 60} />
            ))}
          </div>
        </section>
      )}





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

      {/* Perfil Anonimizado — SEGMENTÁVEL POR CUPOM (LGPD: só agregados) */}
      <PerfilPublicoSection />


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
          <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <h4 className="text-sm sm:text-base font-semibold text-foreground">Conversão por cupom</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Ordenar por</span>
              <Select value={orderBy} onValueChange={(v) => setOrderBy(v as typeof orderBy)}>
                <SelectTrigger className="h-8 text-xs w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita estimada</SelectItem>
                  <SelectItem value="utilizados">Cupons utilizados</SelectItem>
                  <SelectItem value="conversao">Conversão</SelectItem>
                  <SelectItem value="resgates">Resgatados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Uso único: % de conversão. Recorrente: usos por usuário. Receita est. = ticket médio ({formatBRL(ticketMedio)}) × utilizados.
          </p>
          <div className="space-y-4">
            {cuponsOrdenados.map(({ cupom: c, utilizados, razao, receita: receitaEst }, idx) => {
              const isUU = c.tipo === "uso_unico";
              const conversaoPct = Math.min(100, Math.round(razao * 100));
              const usosPorUsuario = razao.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              });
              const barraPct = isUU
                ? conversaoPct
                : Math.min(100, Math.round((razao / 3) * 100));
              const isBest = idx === 0;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-lg transition-colors",
                    isBest && "bg-accent/5 ring-1 ring-accent/30 p-3 -mx-1"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-sm font-medium text-foreground truncate">{c.nome}</span>
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 gap-1 shrink-0 text-[10px] py-0"
                      >
                        {isUU ? <Tag className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
                        {tipoLabel[c.tipo]}
                      </Badge>
                      {isBest && (
                        <Badge className="bg-accent text-accent-foreground gap-1 shrink-0 text-[10px] py-0">
                          <Crown className="w-3 h-3" />
                          Melhor desempenho
                        </Badge>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-bold shrink-0",
                      isUU ? "text-primary" : "text-accent"
                    )}>
                      {isUU ? `${conversaoPct}%` : `${usosPorUsuario}×`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1 gap-2">
                    <span className="truncate">{c.resgates} resgatados · {utilizados} utilizados</span>
                    <span className="shrink-0">
                      Receita est. <span className="font-semibold text-foreground">{formatBRL(receitaEst)}</span>
                    </span>
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
