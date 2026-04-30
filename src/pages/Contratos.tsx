import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { contratosData, type Contrato, type StatusContrato } from "@/data/mockData";
import {
  FileText, Calendar, AlertTriangle, CheckCircle2, Clock, FileSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<StatusContrato, { color: string; icon: React.ElementType; label: string }> = {
  Ativo: { color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", icon: CheckCircle2, label: "Ativo" },
  "A Vencer": { color: "bg-accent/15 text-accent border-accent/30", icon: AlertTriangle, label: "A vencer" },
  Expirado: { color: "bg-muted text-muted-foreground border-border", icon: Clock, label: "Expirado" },
};

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("pt-BR");
}

export default function Contratos() {
  const [selecionado, setSelecionado] = useState<Contrato | null>(null);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Contratos</h1>
        <p className="text-sm text-muted-foreground">Acompanhe seus contratos com a iRun Clube+</p>
      </div>

      {contratosData.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">Nenhum contrato ativo no momento.</p>
          <p className="text-sm text-muted-foreground mt-1">Entre em contato com o time iRun.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {contratosData.map((c, i) => {
            const cfg = statusConfig[c.status];
            const Icon = cfg.icon;
            const alerta = c.status === "A Vencer" && c.diasRestantes < 30;
            return (
              <GlassCard key={c.id} delay={i * 80}>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1 mr-3">
                    <h3 className="font-semibold text-foreground">{c.nome}</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{c.id}</p>
                  </div>
                  <Badge variant="outline" className={cfg.color}>
                    <Icon className="w-3 h-3 mr-1" />
                    {cfg.label}
                  </Badge>
                </div>

                <p className="text-sm text-foreground mb-3 line-clamp-2">{c.objeto}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(c.inicio)} — {formatDate(c.fim)}</span>
                </div>

                {alerta && (
                  <div className={cn(
                    "rounded-lg border p-2.5 mb-3 flex items-center gap-2 text-xs",
                    "bg-accent/10 border-accent/30 text-foreground"
                  )}>
                    <AlertTriangle className="w-4 h-4 text-accent shrink-0" />
                    <span>Vence em <strong>{c.diasRestantes} dias</strong>. Solicite renovação.</span>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={() => setSelecionado(c)}>
                  <FileSearch className="w-4 h-4 mr-2" /> Ver detalhes
                </Button>
              </GlassCard>
            );
          })}
        </div>
      )}

      <Dialog open={!!selecionado} onOpenChange={(o) => !o && setSelecionado(null)}>
        <DialogContent className="max-w-lg">
          {selecionado && (
            <>
              <DialogHeader>
                <DialogTitle>{selecionado.nome}</DialogTitle>
                <DialogDescription className="font-mono text-xs">{selecionado.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm pt-2">
                <Field label="Objeto" value={selecionado.objeto} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Início" value={formatDate(selecionado.inicio)} />
                  <Field label="Fim" value={formatDate(selecionado.fim)} />
                </div>
                <Field label="Status" value={selecionado.status} />
                <Field label="Valor" value={selecionado.valor} />
                <Field label="Responsável iRun" value={selecionado.responsavel} />
                <Field label="Observações" value={selecionado.observacoes} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}
