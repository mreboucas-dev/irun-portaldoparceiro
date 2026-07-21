import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ScanLine, QrCode, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import {
  validarCodigoCupom,
  confirmarResgate,
  historicoValidacoes,
  type ResultadoValidacao,
  type ValidacaoLog,
} from "@/data/mockData";


const codigoSchema = z
  .string()
  .trim()
  .min(1, { message: "Digite o código do cupom" })
  .max(32, { message: "Código muito longo" })
  .regex(/^[A-Z0-9]{3,32}$/, { message: "Use apenas letras e números (ex: SAUDE10)" });

type Resultado =
  | { tipo: "idle" }
  | { tipo: "valido"; data: Extract<ResultadoValidacao, { valido: true }> }
  | { tipo: "invalido"; data: Extract<ResultadoValidacao, { valido: false }> };

const motivoLabel: Record<"expirado" | "ja_utilizado" | "invalido", string> = {
  expirado: "Este cupom está expirado.",
  ja_utilizado: "Este cupom já foi utilizado.",
  invalido: "Cupom inválido. Confira o código digitado.",
};

export default function ValidacaoCupom() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado>({ tipo: "idle" });
  const [historico, setHistorico] = useState<ValidacaoLog[]>(historicoValidacoes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = codigoSchema.safeParse(codigo);
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Código inválido");
      return;
    }
    setErro(null);
    const r = validarCodigoCupom(parsed.data);

    const log: ValidacaoLog = {
      id: `v${Date.now()}`,
      codigo: parsed.data,
      data: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      resultado: r.valido === true ? "Aprovado" : "Recusado",
      motivo: r.valido === true ? undefined : motivoLabel[r.motivo],
    };
    setHistorico((prev) => [log, ...prev].slice(0, 10));

    if (r.valido === true) {
      setResultado({ tipo: "valido", data: r });
      toast.success("Cupom validado com sucesso");
    } else {
      setResultado({ tipo: "invalido", data: r });
      toast.error("Cupom inválido");
    }
  };

  const reset = () => {
    setCodigo("");
    setErro(null);
    setResultado({ tipo: "idle" });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Validação de Cupom</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Digite o código do cupom para validar manualmente.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="rounded-xl bg-primary/10 p-4">
              <QrCode className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo">Código do cupom</Label>
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                if (erro) setErro(null);
              }}
              placeholder="Ex: SAUDE10"
              className="text-center text-lg tracking-widest font-mono uppercase"
              maxLength={32}
              autoComplete="off"
              autoFocus
            />
            {erro && <p className="text-sm text-destructive">{erro}</p>}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <ScanLine className="mr-2 h-4 w-4" />
            Validar
          </Button>
        </form>
      </GlassCard>

      <AnimatePresence mode="wait">
        {resultado.tipo === "valido" && (
          <motion.div
            key="valido"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-500/20 p-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-emerald-700">Cupom validado</h3>
                  <p className="font-medium text-foreground">
                    {resultado.data.cupom.nome} — {resultado.data.cupom.desconto}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Código: <span className="font-mono">{resultado.data.cupom.codigo}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Validade: {new Date(resultado.data.cupom.fim).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <Button onClick={reset} variant="outline" className="mt-4 w-full">
                Validar outro cupom
              </Button>
            </div>
          </motion.div>
        )}

        {resultado.tipo === "invalido" && (
          <motion.div
            key="invalido"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="rounded-xl border-2 border-destructive bg-destructive/10 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-destructive/20 p-2">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold text-destructive">Cupom inválido</h3>
                  <p className="text-sm text-foreground">{motivoLabel[resultado.data.motivo]}</p>
                  {resultado.data.cupom && (
                    <p className="text-sm text-muted-foreground">
                      {resultado.data.cupom.nome} — {resultado.data.cupom.desconto}
                    </p>
                  )}
                </div>
              </div>
              <Button onClick={reset} variant="outline" className="mt-4 w-full">
                Tentar novamente
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Histórico */}
      <GlassCard>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3">
          Histórico — últimas 10 validações
        </h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[420px]">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">Código</th>
                <th className="text-left py-2 font-medium">Data</th>
                <th className="text-left py-2 font-medium">Resultado</th>
                <th className="text-left py-2 font-medium">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((h) => (
                <tr key={h.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 font-mono text-foreground">{h.codigo}</td>
                  <td className="py-2.5 text-muted-foreground text-xs">{h.data}</td>
                  <td className="py-2.5">
                    <span
                      className={
                        h.resultado === "Aprovado"
                          ? "inline-flex items-center gap-1 text-emerald-600 text-xs font-medium"
                          : "inline-flex items-center gap-1 text-destructive text-xs font-medium"
                      }
                    >
                      {h.resultado === "Aprovado" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {h.resultado}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground text-xs">{h.motivo ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
