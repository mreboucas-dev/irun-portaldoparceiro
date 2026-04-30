import { useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cuponsData, type StatusCupom } from "@/data/mockData";
import { ChevronLeft, ChevronRight, Ticket, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const statusColors: Record<StatusCupom, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Expirado: "bg-muted text-muted-foreground border-border",
  Esgotado: "bg-destructive/10 text-destructive border-destructive/30",
};

type Filtro = "todos" | StatusCupom;

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getDiasNoMes(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isCupomAtivoNoDia(inicio: string, fim: string, year: number, month: number, dia: number) {
  const d = new Date(year, month, dia).getTime();
  return new Date(inicio).getTime() <= d && d <= new Date(fim).getTime();
}

export default function Cupons() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const filtered = useMemo(
    () => (filtro === "todos" ? cuponsData : cuponsData.filter((c) => c.status === filtro)),
    [filtro]
  );

  const filtros: { key: Filtro; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "Ativo", label: "Ativos" },
    { key: "Expirado", label: "Expirados" },
    { key: "Esgotado", label: "Esgotados" },
  ];

  const diasNoMes = getDiasNoMes(calYear, calMonth);
  const primeiroDiaSemana = new Date(calYear, calMonth, 1).getDay();

  const navMonth = (delta: number) => {
    const novo = new Date(calYear, calMonth + delta, 1);
    setCalMonth(novo.getMonth());
    setCalYear(novo.getFullYear());
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Meus Cupons</h1>
          <p className="text-sm text-muted-foreground">Gerencie todos os cupons da sua empresa</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link to="/solicitacoes"><Send className="w-4 h-4 mr-2" />Solicitar novo cupom</Link>
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <Button
            key={f.key}
            size="sm"
            variant={filtro === f.key ? "default" : "outline"}
            onClick={() => setFiltro(f.key)}
            className={filtro === f.key ? "bg-primary text-primary-foreground" : ""}
          >
            {f.label}
            <Badge variant="secondary" className="ml-2 bg-background/50">
              {f.key === "todos" ? cuponsData.length : cuponsData.filter((c) => c.status === f.key).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <GlassCard className="text-center py-12">
          <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium mb-1">Nenhum cupom cadastrado ainda.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Solicite um novo cupom na seção Solicitações.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/solicitacoes">Solicitar cupom</Link>
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((c, i) => {
            const utilizadoPct = Math.min(100, Math.round((c.resgates / c.meta) * 100));
            return (
              <GlassCard key={c.id} delay={i * 60}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{c.nome}</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{c.codigo}</p>
                  </div>
                  <Badge variant="outline" className={statusColors[c.status]}>{c.status}</Badge>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{c.desconto}</p>
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <p>Início: {new Date(c.inicio).toLocaleDateString("pt-BR")}</p>
                  <p>Fim: {new Date(c.fim).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{c.resgates} resgates</span>
                    <span className="font-medium text-foreground">{utilizadoPct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full", utilizadoPct >= 80 ? "bg-accent" : "bg-primary")}
                      style={{ width: `${utilizadoPct}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Calendário */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Calendário de vigência</h3>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => navMonth(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[140px] text-center">
              {meses[calMonth]} {calYear}
            </span>
            <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => navMonth(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-[10px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
          {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: diasNoMes }, (_, i) => i + 1).map((dia) => {
            const ativos = cuponsData.filter((c) =>
              isCupomAtivoNoDia(c.inicio, c.fim, calYear, calMonth, dia)
            );
            const isToday =
              dia === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
            return (
              <div
                key={dia}
                className={cn(
                  "aspect-square rounded-lg p-1 flex flex-col items-center justify-start text-xs border transition-colors",
                  ativos.length > 0
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/20 border-transparent",
                  isToday && "ring-2 ring-accent"
                )}
                title={ativos.map((c) => c.nome).join(", ")}
              >
                <span className={cn("font-medium", ativos.length > 0 ? "text-primary" : "text-muted-foreground")}>
                  {dia}
                </span>
                {ativos.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {ativos.slice(0, 3).map((c) => (
                      <span key={c.id} className="w-1 h-1 rounded-full bg-accent" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          {cuponsData.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>{c.nome}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
