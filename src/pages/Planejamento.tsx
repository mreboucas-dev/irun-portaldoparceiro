import { useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cuponsData, type Cupom } from "@/data/mockData";
import { useUtilizados } from "@/hooks/useUtilizados";
import { useTicketMedio, formatBRL } from "@/hooks/useTicketMedio";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarRange, Clock } from "lucide-react";

const HOJE = new Date();
const MESES_JANELA = 6; // total (3 antes / 3 depois — aproximado)

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function diffDays(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / 86400000);
}

function statusPlanejamento(c: Cupom): "Ativo" | "Expirado" | "Agendado" {
  const inicio = new Date(c.inicio);
  const fim = new Date(c.fim);
  if (inicio > HOJE) return "Agendado";
  if (fim < HOJE) return "Expirado";
  return c.status === "Expirado" ? "Expirado" : "Ativo";
}

const statusStyle: Record<"Ativo" | "Expirado" | "Agendado", string> = {
  Ativo: "bg-primary text-primary-foreground",
  Expirado: "bg-muted text-muted-foreground",
  Agendado: "bg-accent text-accent-foreground",
};

function Timeline() {
  const inicioJanela = addMonths(startOfMonth(HOJE), -Math.floor(MESES_JANELA / 2));
  const fimJanela = addMonths(inicioJanela, MESES_JANELA);
  const totalDias = diffDays(fimJanela, inicioJanela);

  const meses = Array.from({ length: MESES_JANELA }, (_, i) => addMonths(inicioJanela, i));
  const hojeOffsetPct = (diffDays(HOJE, inicioJanela) / totalDias) * 100;

  return (
    <div className="space-y-4">
      {/* eixo de meses */}
      <div className="relative h-6 border-b border-border">
        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${MESES_JANELA}, 1fr)` }}>
          {meses.map((m, i) => (
            <div key={i} className="text-xs text-muted-foreground px-2">
              {m.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })}
            </div>
          ))}
        </div>
        {/* marcador HOJE */}
        <div
          className="absolute top-0 bottom-0 w-px bg-primary"
          style={{ left: `${hojeOffsetPct}%` }}
        >
          <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold text-primary whitespace-nowrap">
            Hoje
          </span>
        </div>
      </div>

      {/* linhas de cupons */}
      <div className="relative space-y-2">
        {/* linha de HOJE atravessando as barras */}
        <div
          className="absolute top-0 bottom-0 w-px bg-primary/40 z-0 pointer-events-none"
          style={{ left: `${hojeOffsetPct}%` }}
        />
        {cuponsData.map((c) => {
          const inicio = new Date(c.inicio);
          const fim = new Date(c.fim);
          const startClamp = inicio < inicioJanela ? inicioJanela : inicio;
          const endClamp = fim > fimJanela ? fimJanela : fim;
          const visivel = endClamp > inicioJanela && startClamp < fimJanela;
          const leftPct = (diffDays(startClamp, inicioJanela) / totalDias) * 100;
          const widthPct = Math.max(
            2,
            (diffDays(endClamp, startClamp) / totalDias) * 100,
          );
          const status = statusPlanejamento(c);
          return (
            <div key={c.id} className="relative h-10">
              {visivel ? (
                <div
                  className={cn(
                    "absolute top-0 h-10 rounded-lg px-3 flex items-center gap-2 text-xs font-medium shadow-sm z-10 overflow-hidden",
                    statusStyle[status],
                  )}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, minWidth: 80 }}
                  title={`${c.nome} • ${c.codigo} • ${c.desconto} • ${c.inicio} → ${c.fim}`}
                >
                  <span className="truncate">
                    {c.nome} <span className="opacity-75">({c.codigo})</span>
                  </span>
                  <span className="ml-auto whitespace-nowrap opacity-90">{c.desconto}</span>
                </div>
              ) : (
                <div className="h-10 text-xs text-muted-foreground italic pl-2 flex items-center">
                  {c.nome} — fora da janela
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* legenda */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Ativo</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-accent" /> Agendado</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-muted" /> Expirado</span>
      </div>
    </div>
  );
}

function ProximasExpiracoes() {
  const ativos = cuponsData
    .filter((c) => statusPlanejamento(c) === "Ativo")
    .map((c) => ({ ...c, dias: diffDays(new Date(c.fim), HOJE) }))
    .sort((a, b) => a.dias - b.dias);

  if (ativos.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum cupom ativo no momento.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {ativos.map((c) => (
        <li key={c.id} className="py-3 flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{c.nome} <span className="text-muted-foreground font-normal">({c.codigo})</span></p>
            <p className="text-xs text-muted-foreground">Expira em {new Date(c.fim).toLocaleDateString("pt-BR")}</p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              c.dias <= 14 && "border-destructive/40 text-destructive",
              c.dias > 14 && c.dias <= 30 && "border-amber-500/40 text-amber-600",
            )}
          >
            {c.dias} {c.dias === 1 ? "dia" : "dias"}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

type MetricaComp = {
  label: string;
  a: number | string;
  b: number | string;
  winner: "a" | "b" | "tie";
  fmt?: (v: number | string) => string;
};

function CompararOfertas() {
  const { getUtilizados } = useUtilizados();
  const { ticketMedio } = useTicketMedio();

  const [idA, setIdA] = useState<number>(cuponsData[0]?.id ?? 0);
  const [idB, setIdB] = useState<number>(cuponsData[1]?.id ?? cuponsData[0]?.id ?? 0);

  const a = cuponsData.find((c) => c.id === idA);
  const b = cuponsData.find((c) => c.id === idB);

  const metricas = useMemo<MetricaComp[]>(() => {
    if (!a || !b) return [];
    const utA = getUtilizados(a.id);
    const utB = getUtilizados(b.id);
    const convA = a.resgates > 0 ? utA / a.resgates : 0;
    const convB = b.resgates > 0 ? utB / b.resgates : 0;
    const recA = utA * ticketMedio;
    const recB = utB * ticketMedio;

    const decideNum = (x: number, y: number): "a" | "b" | "tie" =>
      x === y ? "tie" : x > y ? "a" : "b";

    return [
      { label: "Tipo", a: a.tipo === "uso_unico" ? "Uso único" : "Recorrente", b: b.tipo === "uso_unico" ? "Uso único" : "Recorrente", winner: "tie" },
      { label: "Desconto", a: a.desconto, b: b.desconto, winner: "tie" },
      { label: "Resgatados", a: a.resgates, b: b.resgates, winner: decideNum(a.resgates, b.resgates) },
      { label: "Utilizados", a: utA, b: utB, winner: decideNum(utA, utB) },
      {
        label: a.tipo === b.tipo && a.tipo === "recorrente" ? "Usos por usuário" : "Conversão",
        a: a.tipo === "recorrente" ? `${(a.resgates > 0 ? utA / a.resgates : 0).toFixed(2)}×` : `${(convA * 100).toFixed(1)}%`,
        b: b.tipo === "recorrente" ? `${(b.resgates > 0 ? utB / b.resgates : 0).toFixed(2)}×` : `${(convB * 100).toFixed(1)}%`,
        winner: decideNum(convA, convB),
      },
      { label: "Receita estimada", a: formatBRL(recA), b: formatBRL(recB), winner: decideNum(recA, recB) },
    ];
  }, [a, b, getUtilizados, ticketMedio]);

  if (!a || !b) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        <Select value={String(idA)} onValueChange={(v) => setIdA(Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {cuponsData.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.nome} ({c.codigo})</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto rotate-90 sm:rotate-0" />
        <Select value={String(idB)} onValueChange={(v) => setIdB(Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {cuponsData.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.nome} ({c.codigo})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="text-left px-4 py-2 font-medium">Métrica</th>
              <th className="text-left px-4 py-2 font-medium">{a.nome}</th>
              <th className="text-left px-4 py-2 font-medium">{b.nome}</th>
            </tr>
          </thead>
          <tbody>
            {metricas.map((m) => (
              <tr key={m.label} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">{m.label}</td>
                <td className={cn("px-4 py-3", m.winner === "a" && "font-semibold text-primary")}>
                  <span className="inline-flex items-center gap-1.5">
                    {m.winner === "a" && <span aria-hidden>▲</span>}
                    {m.a}
                  </span>
                </td>
                <td className={cn("px-4 py-3", m.winner === "b" && "font-semibold text-primary")}>
                  <span className="inline-flex items-center gap-1.5">
                    {m.winner === "b" && <span aria-hidden>▲</span>}
                    {m.b}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Receita é uma estimativa (ticket médio × utilizados). Ajuste o ticket médio no Dashboard.
      </p>
    </div>
  );
}

export default function Planejamento() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" />
          Planejamento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize suas campanhas na linha do tempo e compare o desempenho entre ofertas.
        </p>
      </div>

      <GlassCard>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Calendário de campanhas</h2>
          <p className="text-xs text-muted-foreground">Janela de {MESES_JANELA} meses ao redor de hoje.</p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <Timeline />
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Próximas expirações</h2>
            <p className="text-xs text-muted-foreground">Cupons ativos ordenados pelo fim mais próximo.</p>
          </div>
          <ProximasExpiracoes />
        </GlassCard>

        <GlassCard>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Comparar ofertas</h2>
            <p className="text-xs text-muted-foreground">Escolha dois cupons para ver quem vence em cada métrica.</p>
          </div>
          <CompararOfertas />
        </GlassCard>
      </div>
    </div>
  );
}
