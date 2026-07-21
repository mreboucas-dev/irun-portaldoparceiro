import { Fragment, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  cuponsData,
  solicitacoesIniciais,
  type Solicitacao,
  type TipoDesconto,
  type LimiteResgate,
  type TipoCupom,
} from "@/data/mockData";
import { Send, History, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const schema = z
  .object({
    nomeCupom: z.string().trim().min(1, "Informe o nome").max(60),
    tipoDesconto: z.enum(["percentual", "valor", "brinde"], { message: "Selecione o tipo de desconto" }),
    valorDesconto: z.number().positive("Valor deve ser maior que 0").optional(),
    descricaoBrinde: z.string().trim().max(120).optional(),
    limiteResgate: z.enum(["ilimitado", "limitado"]),
    quantidadeLimite: z.number().int().positive("Quantidade deve ser > 0").optional(),
    tipoCupom: z.enum(["uso_unico", "recorrente"], { message: "Selecione o tipo de cupom" }),
    inicio: z.string().min(1, "Informe a data de início"),
    fim: z.string().min(1, "Informe a data de fim"),
    observacoes: z.string().max(500).optional(),
  })
  .refine((d) => d.tipoDesconto !== "percentual" || (d.valorDesconto !== undefined && d.valorDesconto <= 100), {
    message: "Percentual deve ser entre 1 e 100",
    path: ["valorDesconto"],
  })
  .refine((d) => d.tipoDesconto === "brinde" || d.valorDesconto !== undefined, {
    message: "Informe o valor do desconto",
    path: ["valorDesconto"],
  })
  .refine((d) => d.tipoDesconto !== "brinde" || (d.descricaoBrinde && d.descricaoBrinde.length > 0), {
    message: "Descreva o brinde",
    path: ["descricaoBrinde"],
  })
  .refine((d) => d.limiteResgate !== "limitado" || (d.quantidadeLimite !== undefined && d.quantidadeLimite > 0), {
    message: "Informe a quantidade limite",
    path: ["quantidadeLimite"],
  });

const statusColor: Record<Solicitacao["status"], string> = {
  Enviado: "bg-muted text-muted-foreground border-border",
  "Em Análise": "bg-accent/15 text-accent border-accent/30",
  Aprovado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
};

const tipoDescontoLabel: Record<TipoDesconto, string> = {
  percentual: "Percentual (%)",
  valor: "Valor fixo (R$)",
  brinde: "Brinde / cortesia",
};

const tipoCupomLabel: Record<TipoCupom, string> = {
  uso_unico: "Uso único",
  recorrente: "Recorrente",
};

function formatDesconto(d?: Solicitacao["detalhes"]): string {
  if (!d?.tipoDesconto) return "—";
  if (d.tipoDesconto === "percentual") return `${d.valorDesconto ?? 0}%`;
  if (d.tipoDesconto === "valor") return `R$ ${d.valorDesconto ?? 0}`;
  return `Brinde: ${d.descricaoBrinde ?? "—"}`;
}

export default function Solicitacoes() {
  const [modo, setModo] = useState<"novo" | "renovacao">("novo");
  const [nomeCupom, setNomeCupom] = useState("");
  const [tipoDesconto, setTipoDesconto] = useState<TipoDesconto | "">("");
  const [valorDesconto, setValorDesconto] = useState<string>("");
  const [descricaoBrinde, setDescricaoBrinde] = useState("");
  const [limiteResgate, setLimiteResgate] = useState<LimiteResgate>("limitado");
  const [quantidadeLimite, setQuantidadeLimite] = useState<string>("");
  const [tipoCupom, setTipoCupom] = useState<TipoCupom | "">("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [cupomRenovar, setCupomRenovar] = useState("");
  const [historico, setHistorico] = useState<Solicitacao[]>(solicitacoesIniciais);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cuponsExpirados = cuponsData.filter((c) => c.status === "Expirado");

  const handleEnviar = () => {
    if (modo === "renovacao") {
      if (!cupomRenovar) {
        toast.error("Selecione o cupom para renovar");
        return;
      }
      if (!inicio || !fim) {
        toast.error("Informe início e fim");
        return;
      }
      if (new Date(inicio) > new Date(fim)) {
        toast.error("Período inválido");
        return;
      }
      const nome = `Renovação ${cupomRenovar}`;
      const nova: Solicitacao = {
        id: `SOL-${String(Math.floor(Math.random() * 999) + 100)}`,
        data: new Date().toISOString().slice(0, 10),
        tipo: "Renovação",
        nomeCupom: nome,
        status: "Enviado",
        detalhes: { inicio, fim, observacoes },
      };
      setHistorico((prev) => [nova, ...prev]);
      toast.success("Solicitação enviada com sucesso");
      setInicio(""); setFim(""); setObservacoes(""); setCupomRenovar("");
      return;
    }

    const parsed = schema.safeParse({
      nomeCupom,
      tipoDesconto: tipoDesconto || undefined,
      valorDesconto: valorDesconto === "" ? undefined : Number(valorDesconto),
      descricaoBrinde: descricaoBrinde || undefined,
      limiteResgate,
      quantidadeLimite: quantidadeLimite === "" ? undefined : Number(quantidadeLimite),
      tipoCupom: tipoCupom || undefined,
      inicio,
      fim,
      observacoes,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (new Date(inicio) > new Date(fim)) {
      toast.error("Período inválido");
      return;
    }

    const d = parsed.data;
    const nova: Solicitacao = {
      id: `SOL-${String(Math.floor(Math.random() * 999) + 100)}`,
      data: new Date().toISOString().slice(0, 10),
      tipo: "Novo Cupom",
      nomeCupom,
      status: "Enviado",
      detalhes: {
        tipoDesconto: d.tipoDesconto,
        valorDesconto: d.valorDesconto,
        descricaoBrinde: d.descricaoBrinde,
        limiteResgate: d.limiteResgate,
        quantidadeLimite: d.quantidadeLimite,
        tipoCupom: d.tipoCupom,
        inicio: d.inicio,
        fim: d.fim,
        observacoes: d.observacoes,
      },
    };
    setHistorico((prev) => [nova, ...prev]);
    toast.success("Solicitação enviada com sucesso", {
      description: "Nossa equipe entrará em contato em breve.",
    });

    setNomeCupom("");
    setTipoDesconto("");
    setValorDesconto("");
    setDescricaoBrinde("");
    setLimiteResgate("limitado");
    setQuantidadeLimite("");
    setTipoCupom("");
    setInicio("");
    setFim("");
    setObservacoes("");
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

        {modo === "novo" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome do cupom</Label>
                <Input id="nome" value={nomeCupom} onChange={(e) => setNomeCupom(e.target.value)} maxLength={60} placeholder="Ex: Outono 12" />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de desconto</Label>
                <Select value={tipoDesconto} onValueChange={(v) => { setTipoDesconto(v as TipoDesconto); setValorDesconto(""); setDescricaoBrinde(""); }}>
                  <SelectTrigger id="tipo"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual (%)</SelectItem>
                    <SelectItem value="valor">Valor fixo (R$)</SelectItem>
                    <SelectItem value="brinde">Brinde / cortesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoDesconto === "percentual" && (
                <div>
                  <Label htmlFor="valor-pct">Valor do desconto (%)</Label>
                  <div className="relative">
                    <Input id="valor-pct" type="number" min={1} max={100} value={valorDesconto} onChange={(e) => setValorDesconto(e.target.value)} placeholder="10" className="pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              )}
              {tipoDesconto === "valor" && (
                <div>
                  <Label htmlFor="valor-fixo">Valor do desconto</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                    <Input id="valor-fixo" type="number" min={1} value={valorDesconto} onChange={(e) => setValorDesconto(e.target.value)} placeholder="20" className="pl-10" />
                  </div>
                </div>
              )}
              {tipoDesconto === "brinde" && (
                <div>
                  <Label htmlFor="brinde">Descrição do brinde</Label>
                  <Input id="brinde" value={descricaoBrinde} onChange={(e) => setDescricaoBrinde(e.target.value)} maxLength={120} placeholder="Ex: Amostra grátis do produto X" />
                </div>
              )}
            </div>

            <div>
              <Label>Limite de resgate</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">teto TOTAL da campanha — quantos cupons no total</p>
              <RadioGroup value={limiteResgate} onValueChange={(v) => setLimiteResgate(v as LimiteResgate)} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`flex flex-col gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${limiteResgate === "limitado" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="limitado" id="lim" className="mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Limitado</div>
                      <div className="text-xs text-muted-foreground">definir teto total de resgates</div>
                    </div>
                  </div>
                  {limiteResgate === "limitado" && (
                    <div className="pl-7">
                      <Label htmlFor="qtd" className="sr-only">Quantidade limite</Label>
                      <Input id="qtd" type="number" min={1} value={quantidadeLimite} onChange={(e) => setQuantidadeLimite(e.target.value)} placeholder="Ex: 500" />
                    </div>
                  )}
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${limiteResgate === "ilimitado" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="ilimitado" id="ilim" className="mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Ilimitado</div>
                    <div className="text-xs text-muted-foreground">sem teto de resgates</div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div>
              <Label>Tipo de cupom</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">como CADA usuário usa o cupom</p>
              <RadioGroup value={tipoCupom} onValueChange={(v) => setTipoCupom(v as TipoCupom)} className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${tipoCupom === "uso_unico" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="uso_unico" id="uso_unico" className="mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Uso único</div>
                    <div className="text-xs text-muted-foreground">some da conta do usuário após o uso — ideal pra aquisição/primeira compra.</div>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${tipoCupom === "recorrente" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="recorrente" id="recorrente" className="mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Recorrente</div>
                    <div className="text-xs text-muted-foreground">fica na conta e pode ser usado várias vezes — ideal pra fidelizar/recompra.</div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ini">Início</Label>
                <Input id="ini" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fim">Fim</Label>
                <Input id="fim" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="obs">Observações</Label>
              <Textarea id="obs" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} maxLength={500} placeholder="Detalhes da campanha, público-alvo, restrições..." />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="ini-r">Início</Label>
              <Input id="ini-r" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="fim-r">Fim</Label>
              <Input id="fim-r" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="obs-r">Observações</Label>
              <Textarea id="obs-r" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} maxLength={500} />
            </div>
          </div>
        )}

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
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Data</th>
                <th className="text-left py-2 font-medium">Tipo</th>
                <th className="text-left py-2 font-medium">Cupom</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {historico.map((s) => {
                const hasDetails = !!s.detalhes && Object.values(s.detalhes).some((v) => v !== undefined && v !== "");
                const open = expandedId === s.id;
                return (
                  <Fragment key={s.id}>
                    <tr
                      className={`border-b border-border/50 last:border-0 ${hasDetails ? "cursor-pointer hover:bg-muted/40" : ""}`}
                      onClick={() => hasDetails && setExpandedId(open ? null : s.id)}
                    >
                      <td className="py-2.5 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="py-2.5 text-foreground">{new Date(s.data).toLocaleDateString("pt-BR")}</td>
                      <td className="py-2.5 text-foreground">{s.tipo}</td>
                      <td className="py-2.5 text-foreground">{s.nomeCupom}</td>
                      <td className="py-2.5">
                        <Badge variant="outline" className={statusColor[s.status]}>{s.status}</Badge>
                      </td>
                      <td className="py-2.5 text-muted-foreground">
                        {hasDetails && <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />}
                      </td>
                    </tr>
                    {open && s.detalhes && (
                      <tr key={s.id + "-d"} className="border-b border-border/50 bg-muted/20">
                        <td colSpan={6} className="py-3 px-2">
                          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-xs">
                            {s.detalhes.tipoDesconto && (
                              <div>
                                <dt className="text-muted-foreground">Desconto</dt>
                                <dd className="text-foreground">{tipoDescontoLabel[s.detalhes.tipoDesconto]} — {formatDesconto(s.detalhes)}</dd>
                              </div>
                            )}
                            {s.detalhes.limiteResgate && (
                              <div>
                                <dt className="text-muted-foreground">Limite</dt>
                                <dd className="text-foreground">
                                  {s.detalhes.limiteResgate === "ilimitado" ? "Ilimitado" : `${s.detalhes.quantidadeLimite} resgates`}
                                </dd>
                              </div>
                            )}
                            {s.detalhes.tipoCupom && (
                              <div>
                                <dt className="text-muted-foreground">Tipo</dt>
                                <dd className="text-foreground">{tipoCupomLabel[s.detalhes.tipoCupom]}</dd>
                              </div>
                            )}
                            {(s.detalhes.inicio || s.detalhes.fim) && (
                              <div>
                                <dt className="text-muted-foreground">Vigência</dt>
                                <dd className="text-foreground">
                                  {s.detalhes.inicio ? new Date(s.detalhes.inicio).toLocaleDateString("pt-BR") : "—"} → {s.detalhes.fim ? new Date(s.detalhes.fim).toLocaleDateString("pt-BR") : "—"}
                                </dd>
                              </div>
                            )}
                            {s.detalhes.observacoes && (
                              <div className="col-span-2 md:col-span-4">
                                <dt className="text-muted-foreground">Observações</dt>
                                <dd className="text-foreground whitespace-pre-wrap">{s.detalhes.observacoes}</dd>
                              </div>
                            )}
                          </dl>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
