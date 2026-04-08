import { useState } from "react";
import { contratosData, solicitacaoNovoContrato, cuponsData } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Package,
  History,
} from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  Vigente: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Vigente" },
  "Em Análise": { icon: AlertCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "Em Análise" },
  Encerrado: { icon: Clock, color: "bg-muted text-muted-foreground border-border", label: "Encerrado" },
};

function calcProgress(inicio: string, fim: string) {
  const start = new Date(inicio).getTime();
  const end = new Date(fim).getTime();
  const now = Date.now();
  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

function diasRestantes(fim: string) {
  const end = new Date(fim).getTime();
  const now = Date.now();
  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatPeriodo(inicio: string, fim: string) {
  return `${formatDate(inicio)} — ${formatDate(fim)}`;
}

export default function Contratos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const contratoVigente = contratosData.find((c) => c.status === "Vigente");
  const contratosEncerrados = contratosData.filter((c) => c.status === "Encerrado");
  const pendente = solicitacaoNovoContrato;
  const hasPendente = !!pendente;

  const progress = contratoVigente ? calcProgress(contratoVigente.inicio, contratoVigente.fim) : 0;
  const dias = contratoVigente ? diasRestantes(contratoVigente.fim) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Contratos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus contratos de cupons vigentes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
              disabled={hasPendente}
              title={hasPendente ? "Já existe uma solicitação pendente" : undefined}
            >
              <Plus className="w-4 h-4 mr-2" /> Solicitar Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Solicitar Novo Contrato</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="inicio">Início</Label>
                  <Input id="inicio" type="date" />
                </div>
                <div>
                  <Label htmlFor="fim">Fim</Label>
                  <Input id="fim" type="date" />
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Cupons desejados</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cuponsData.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox />
                      <span className="text-foreground">{c.nome}</span>
                      <span className="text-muted-foreground text-xs">({c.categoria})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="obs">Observações</Label>
                <Input id="obs" placeholder="Algo a acrescentar..." />
              </div>
              <Button className="w-full gold-gradient text-primary-foreground font-semibold">
                Enviar Solicitação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contrato Vigente */}
      {contratoVigente && (
        <GlassCard className="animate-fade-in-up" delay={0}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Contrato Vigente</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{contratoVigente.id}</span>
              <Badge variant="outline" className={statusConfig.Vigente.color}>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Vigente
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CalendarDays className="w-4 h-4" />
            <span>Período: {formatPeriodo(contratoVigente.inicio, contratoVigente.fim)}</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{progress}% concluído</span>
              <span>{dias} dias restantes</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-accent" />
              Cupons incluídos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {contratoVigente.cupons.map((cupom, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/30 p-3 text-center"
                >
                  <p className="text-sm font-medium text-foreground">{cupom.nome}</p>
                  <p className="text-xs text-muted-foreground">{cupom.categoria}</p>
                  <p className="text-lg font-bold text-primary mt-1">{cupom.resgates}</p>
                  <p className="text-[10px] text-muted-foreground">resgates</p>
                </div>
              ))}
            </div>
          </div>

          {dias <= 30 && (
            <div className="rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm text-accent-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span>
                O contrato está próximo do vencimento. Solicite a renovação com antecedência.
              </span>
            </div>
          )}
        </GlassCard>
      )}

      {/* Solicitação Pendente */}
      {pendente && (
        <GlassCard className="animate-fade-in-up" delay={100}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Solicitação Pendente</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{pendente.id}</span>
              <Badge variant="outline" className={statusConfig["Em Análise"].color}>
                <AlertCircle className="w-3 h-3 mr-1" />
                {pendente.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CalendarDays className="w-4 h-4" />
            <span>Período solicitado: {formatPeriodo(pendente.inicio, pendente.fim)}</span>
          </div>

          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Cupons propostos:</p>
            <div className="flex flex-wrap gap-2">
              {pendente.cuponsPropostos.map((c, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {c.nome} · {c.categoria}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Timeline</h4>
            <div className="relative pl-6 space-y-3 border-l-2 border-border">
              {pendente.updates.map((u, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  <p className="text-xs text-muted-foreground">{formatDate(u.data)}</p>
                  <p className="text-sm text-foreground">{u.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Histórico */}
      {contratosEncerrados.length > 0 && (
        <GlassCard className="animate-fade-in-up" delay={200}>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Histórico de Contratos</h2>
          </div>

          <div className="space-y-3">
            {contratosEncerrados.map((contrato) => (
              <div
                key={contrato.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border bg-muted/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{contrato.id}</span>
                  <span className="text-sm text-foreground">
                    {formatPeriodo(contrato.inicio, contrato.fim)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {contrato.cupons.length} cupons
                  </span>
                  <Badge variant="outline" className={statusConfig.Encerrado.color}>
                    Encerrado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
