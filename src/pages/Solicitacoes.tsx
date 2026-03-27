import { useState } from "react";
import { solicitacoesData } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; color: string }> = {
  Pendente: { icon: Clock, color: "bg-accent/10 text-accent border-accent/20" },
  "Em Análise": { icon: AlertCircle, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  Resolvido: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
};

export default function Solicitacoes() {
  const [selected, setSelected] = useState<string | null>(null);
  const ticket = solicitacoesData.find((s) => s.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Solicitações</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos de alteração</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4 mr-2" /> Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Solicitação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input id="titulo" placeholder="Ex: Alterar validade do cupom..." />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" placeholder="Descreva a alteração desejada..." rows={4} />
              </div>
              <Button className="w-full gold-gradient text-primary-foreground font-semibold">Enviar Solicitação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {solicitacoesData.map((sol, i) => {
            const cfg = statusConfig[sol.status];
            const Icon = cfg.icon;
            return (
              <GlassCard
                key={sol.id}
                className={`animate-fade-in-up cursor-pointer ${selected === sol.id ? "ring-2 ring-accent" : ""}`}
                delay={i * 100}
              >
                <div onClick={() => setSelected(sol.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-muted-foreground">{sol.id}</span>
                    <Badge variant="outline" className={cfg.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      {sol.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm text-foreground">{sol.titulo}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{sol.data}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          {ticket ? (
            <GlassCard className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{ticket.titulo}</h3>
                <Badge variant="outline" className={statusConfig[ticket.status].color}>{ticket.status}</Badge>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
                <div className="relative pl-6 space-y-4 border-l-2 border-border">
                  {ticket.updates.map((u, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[25px] w-3 h-3 rounded-full bg-accent border-2 border-background" />
                      <p className="text-xs text-muted-foreground">{u.data}</p>
                      <p className="text-sm text-foreground">{u.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Selecione uma solicitação para ver os detalhes</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
