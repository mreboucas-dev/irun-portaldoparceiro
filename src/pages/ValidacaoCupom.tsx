import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, XCircle, QrCode, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/PageTransition";
import { validarCodigoCupom, type ResultadoValidacao } from "@/data/mockData";

const codigoSchema = z
  .string()
  .trim()
  .min(1, { message: "Digite o código do cupom" })
  .max(32, { message: "Código muito longo" })
  .regex(/^IRUN-[A-Z0-9]{3,6}-[A-Z0-9]{3,6}$/, {
    message: "Formato inválido. Use IRUN-XXXX-XXXX",
  });

type Resultado =
  | { tipo: "idle" }
  | { tipo: "valido"; data: Extract<ResultadoValidacao, { valido: true }> }
  | { tipo: "invalido"; data: Extract<ResultadoValidacao, { valido: false }> };

const motivoLabel: Record<"expirado" | "pausado" | "nao_encontrado", string> = {
  expirado: "Este cupom está expirado ou fora do prazo.",
  pausado: "Este cupom está pausado no momento.",
  nao_encontrado: "Cupom não encontrado. Confira o código digitado.",
};

export default function ValidacaoCupom() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado>({ tipo: "idle" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = codigoSchema.safeParse(codigo);
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Código inválido");
      return;
    }
    setErro(null);
    const r = validarCodigoCupom(parsed.data);
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
    <PageTransition>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validação de Cupom</h1>
          <p className="text-muted-foreground mt-1">
            Digite o código do cupom para validar manualmente quando o QR Code não estiver disponível.
          </p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-2xl bg-primary/10 p-4">
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
                placeholder="IRUN-XXXX-XXXX"
                className="text-center text-lg tracking-widest font-mono uppercase"
                maxLength={32}
                autoComplete="off"
                autoFocus
              />
              {erro && <p className="text-sm text-destructive">{erro}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg">
              <ScanLine className="mr-2 h-4 w-4" />
              Validar Cupom
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
              <div className="rounded-2xl border-2 border-green-500 bg-green-500/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Cupom validado
                    </h3>
                    <p className="font-medium">
                      {resultado.data.cupom.nome} — {resultado.data.cupom.categoria}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Validade:{" "}
                      {new Date(resultado.data.cupom.validade).toLocaleDateString("pt-BR")}
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
              <div className="rounded-2xl border-2 border-red-500 bg-red-500/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-red-500/20 p-2">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                      Cupom inválido
                    </h3>
                    <p className="text-sm">
                      {motivoLabel[resultado.data.motivo]}
                    </p>
                    {resultado.data.cupom && (
                      <p className="text-sm text-muted-foreground">
                        {resultado.data.cupom.nome} — {resultado.data.cupom.categoria}
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
      </div>
    </PageTransition>
  );
}
