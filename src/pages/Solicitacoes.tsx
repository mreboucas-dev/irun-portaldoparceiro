import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cuponsData, solicitacoesIniciais, type Solicitacao } from "@/data/mockData";
import { Send, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  nomeCupom: z.string().trim().min(1, "Informe o nome").max(60),
  tipoDesconto: z.string().min(1, "Selecione o tipo"),
  inicio: z.string().min(1, "Informe a data de início"),
  fim: z.string().min(1, "Informe a data de fim"),
  observacoes: z.string().max(500).optional(),
});

const statusColor: Record<Solicitacao["status"], string> = {
  Enviado: "bg-muted text-muted-foreground border-border",
  "Em Análise": "bg-accent/15 text-accent border-accent/30",
  Aprovado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

export default function Solicitacoes() {
  const [modo, setModo] = useState<"novo" | "renovacao">("novo");
  const [nomeCupom, setNomeCupom] = useState("");
  const [tipoDesconto, setTipoDesconto] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [cupomRenovar, setCupomRenovar] = useState("");
  const [historico, setHistorico] = useState<Solicitacao[]>(solicitacoesIniciais);

  const cuponsExpirados = cuponsData.filter((c) => c.status === "Expirado");

  const handleEnviar = () => {
    let nome = nomeCupom;
    if (modo === "renovacao") {
      if (!cupomRenovar) {
        toast.error("Selecione o cupom para renovar");
        return;
      }
      nome = `Renovação ${cupomRenovar}`;
    }
    const result = schema.safeParse({
      nomeCupom: modo === "renovacao" ? "Renovação" : nome,
      tipoDesconto: modo === "renovacao" ? "renovacao" : tipoDesconto,
      inicio,
      fim,
      observacoes,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (new Date(inicio) > new Date(fim)) {
      toast.error("Período inválido");
      return;
    }

    const nova: Solicitacao = {
      id: `SOL-${String(Math.floor(Math.random() * 999) + 100)}`,
      data: new Date().toISOString().slice(0, 10),
      tipo: modo === "novo" ? "Novo Cupom" : "Renovação",
      nomeCupom: nome,
      status: "Enviado",
    };
    setHistorico((prev) => [nova, ...prev]);
    toast.success("Solicitação enviada com sucesso", {
      description: "Nossa equipe entrará em contato em breve.",
    });

    setNomeCupom("");
    setTipoDesconto("");
    setInicio("");
    setFim("");
    setObservacoes("");
    setCupomRenovar("");
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Solicitações</h1>
        <p className="text-sm text-muted-foreground">Solicite novos cupons ou renove cupons existentes</p>
      </div>

      <GlassCard>
        <div className="flex gap-2 mb-5">
          <Button
            size="sm"
            variant={modo === "novo" ? "default" : "outline"}
            onClick={() => setModo("novo")}
            className={modo === "novo" ? "bg-primary text-primary-foreground" : ""}
          >
            Novo cupom
          </Button>
          <Button
            size="sm"
            variant={modo === "renovacao" ? "default" : "outline"}
            onClick={() => setModo("renovacao")}
            className={modo === "renovacao" ? "bg-primary text-primary-foreground" : ""}
          >
            Renovar cupom existente
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modo === "novo" ? (
            <>
              <div>
                <Label htmlFor="nome">Nome do cupom</Label>
                <Input id="nome" value={nomeCupom} onChange={(e) => setNomeCupom(e.target.value)} maxLength={60} placeholder="Ex: Outono 12" />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de desconto</Label>
                <Select value={tipoDesconto} onValueChange={setTipoDesconto}>
                  <SelectTrigger id="tipo"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual (%)</SelectItem>
                    <SelectItem value="valor">Valor fixo (R$)</SelectItem>
                    <SelectItem value="brinde">Brinde / cortesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="md:col-span-2">
              <Label htmlFor="renovar">Cupom para renovar</Label>
              <Select value={cupomRenovar} onValueChange={setCupomRenovar}>
                <SelectTrigger id="renovar">
                  <SelectValue placeholder={cuponsExpirados.length === 0 ? "Nenhum cupom expirado" : "Selecione"} />
                </SelectTrigger>
                <SelectContent>
                  {cuponsExpirados.map((c) => (
                    <SelectItem key={c.codigo} value={c.codigo}>
                      {c.nome} ({c.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="ini">Início</Label>
            <Input id="ini" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fim">Fim</Label>
            <Input id="fim" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} maxLength={500} placeholder="Detalhes da campanha, público-alvo, restrições..." />
          </div>
        </div>

        <Button onClick={handleEnviar} className="mt-5 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Send className="w-4 h-4 mr-2" /> Enviar solicitação
        </Button>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Histórico de solicitações</h3>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Data</th>
                <th className="text-left py-2 font-medium">Tipo</th>
                <th className="text-left py-2 font-medium">Cupom</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((s) => (
                <tr key={s.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-2.5 text-foreground">{new Date(s.data).toLocaleDateString("pt-BR")}</td>
                  <td className="py-2.5 text-foreground">{s.tipo}</td>
                  <td className="py-2.5 text-foreground">{s.nomeCupom}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className={statusColor[s.status]}>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
