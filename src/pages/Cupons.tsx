import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cuponsData, type StatusCupom, type TipoCupom } from "@/data/mockData";
import { useUtilizados } from "@/hooks/useUtilizados";
import { ChevronLeft, ChevronRight, Ticket, Send, Repeat, Tag, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";


const statusColors: Record<StatusCupom, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  Expirado: "bg-muted text-muted-foreground border-border",
  Esgotado: "bg-destructive/10 text-destructive border-destructive/30",
};

const tipoLabel: Record<TipoCupom, string> = {
  uso_unico: "Uso único",
  recorrente: "Recorrente",
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

function UtilizadosInput({
  id,
  value,
  onSave,
}: {
  id: number;
  value: number;
  onSave: (v: number) => void;
}) {
  const [local, setLocal] = useState(String(value));

  // Sincroniza se o valor externo mudar (ex.: outro tab)
  useEffect(() => setLocal(String(value)), [value]);

  return (
    <Input
      id={`utilizados-${id}`}
      type="number"
      inputMode="numeric"
      min={0}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        const n = parseInt(local, 10);
        if (Number.isFinite(n) && n >= 0) onSave(n);
        else setLocal(String(value));
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className="h-8 text-sm"
    />
  );
}

export default function Cupons() {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const { getUtilizados, setUtilizados } = useUtilizados();

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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Meus Cupons</h1>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Entenda resgatados vs utilizados"
                  className="w-6 h-6 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 text-xs leading-relaxed">
                <p className="font-semibold text-foreground mb-1">Resgatados × Utilizados</p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Resgatados</span> são cupons que o cliente pegou no app iRun.{" "}
                  <span className="font-medium text-foreground">Utilizados</span> são os que foram efetivamente usados na sua
                  plataforma (você informa aqui). A <span className="font-medium text-foreground">conversão</span> só faz
                  sentido em cupons de <span className="font-medium">uso único</span>; em recorrentes, medimos usos por usuário.
                </p>
              </PopoverContent>
            </Popover>
          </div>
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
            const utilizados = getUtilizados(c.id);
            const razao = c.resgates > 0 ? utilizados / c.resgates : 0;
            const conversaoPct = Math.min(100, Math.round(razao * 100));
            const usosPorUsuario = razao.toLocaleString("pt-BR", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            });
            const barraPct = c.tipo === "uso_unico"
              ? conversaoPct
              : Math.min(100, Math.round((razao / 3) * 100)); // escala visual: 3× = cheio

            return (
              <GlassCard key={c.id} delay={i * 60}>
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{c.nome}</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{c.codigo}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={statusColors[c.status]}>{c.status}</Badge>
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20 gap-1"
                    >
                      {c.tipo === "recorrente" ? <Repeat className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                      {tipoLabel[c.tipo]}
                    </Badge>
                  </div>
                </div>

                <p className="text-2xl font-bold text-primary mb-3">{c.desconto}</p>

                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <p>Início: {new Date(c.inicio).toLocaleDateString("pt-BR")}</p>
                  <p>Fim: {new Date(c.fim).toLocaleDateString("pt-BR")}</p>
                </div>

                {/* Campo editável: Cupons utilizados */}
                <div className="mb-3">
                  <label
                    htmlFor={`utilizados-${c.id}`}
                    className="text-xs font-medium text-foreground block mb-1"
                  >
                    Cupons utilizados
                  </label>
                  <UtilizadosInput
                    id={c.id}
                    value={utilizados}
                    onSave={(v) => setUtilizados(c.id, v)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Some online + físico. Salva automaticamente ao sair do campo.
                  </p>
                </div>

                {/* Métricas por tipo */}
                {c.tipo === "uso_unico" ? (
                  <div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Resgatados</p>
                        <p className="text-sm font-semibold text-foreground">{c.resgates}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Utilizados</p>
                        <p className="text-sm font-semibold text-foreground">{utilizados}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Conversão</p>
                        <p className="text-sm font-semibold text-primary">{conversaoPct}%</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-[width]"
                        style={{ width: `${conversaoPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Funil: resgatados → utilizados
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Resgatados</p>
                        <p className="text-sm font-semibold text-foreground">{c.resgates}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Utilizados</p>
                        <p className="text-sm font-semibold text-foreground">{utilizados}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Por usuário</p>
                        <p className="text-sm font-semibold text-primary">{usosPorUsuario}×</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-[width]"
                        style={{ width: `${barraPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Recompra média — não é conversão.
                    </p>
                  </div>
                )}
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
