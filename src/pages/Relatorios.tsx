import { useState } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cuponsData } from "@/data/mockData";
import { FileBarChart, Download, FileText } from "lucide-react";

interface RelatorioRow {
  data: string;
  codigo: string;
  resgates: number;
  clientesUnicos: number;
  horarioPico: string;
}

function gerarRelatorio(inicio: string, fim: string, codigo: string): RelatorioRow[] {
  const cupons = codigo === "todos" ? cuponsData : cuponsData.filter((c) => c.codigo === codigo);
  const startDate = new Date(inicio);
  const endDate = new Date(fim);
  const rows: RelatorioRow[] = [];
  for (const c of cupons) {
    const dias = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const total = Math.floor(c.resgates * (dias / 30));
    rows.push({
      data: `${startDate.toLocaleDateString("pt-BR")} – ${endDate.toLocaleDateString("pt-BR")}`,
      codigo: c.codigo,
      resgates: total,
      clientesUnicos: Math.floor(total * 0.78),
      horarioPico: c.melhorHorario,
    });
  }
  return rows;
}

export default function Relatorios() {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [cupom, setCupom] = useState("todos");
  const [resultado, setResultado] = useState<RelatorioRow[] | null>(null);

  const handleGerar = () => {
    if (!inicio || !fim) {
      toast.error("Selecione data de início e fim");
      return;
    }
    if (new Date(inicio) > new Date(fim)) {
      toast.error("Data de início deve ser anterior à data de fim");
      return;
    }
    setResultado(gerarRelatorio(inicio, fim, cupom));
    toast.success("Relatório gerado");
  };

  const exportCSV = () => {
    if (!resultado) return;
    const header = ["Data", "Código", "Resgates", "Clientes únicos", "Horário de pico"];
    const lines = [header.join(",")].concat(
      resultado.map((r) => [r.data, r.codigo, r.resgates, r.clientesUnicos, r.horarioPico].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-cupons-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  const exportPDF = () => {
    toast.success("Geração de PDF iniciada", {
      description: "O arquivo será disponibilizado em instantes.",
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Gere relatórios detalhados de resgates por período e cupom
        </p>
      </div>

      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="ini">Data início</Label>
            <Input id="ini" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="fim">Data fim</Label>
            <Input id="fim" type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cup">Cupom</Label>
            <Select value={cupom} onValueChange={setCupom}>
              <SelectTrigger id="cup">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cupons</SelectItem>
                {cuponsData.map((c) => (
                  <SelectItem key={c.codigo} value={c.codigo}>{c.codigo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleGerar}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <FileBarChart className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </GlassCard>

      {resultado === null ? (
        <GlassCard className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">Selecione o período e clique em Gerar Relatório</p>
          <p className="text-sm text-muted-foreground mt-1">
            Os resultados aparecerão aqui em formato de tabela.
          </p>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Resultado</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportCSV}>
                <Download className="w-4 h-4 mr-2" /> CSV
              </Button>
              <Button size="sm" variant="outline" onClick={exportPDF}>
                <Download className="w-4 h-4 mr-2" /> PDF
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Período</th>
                  <th className="text-left py-2 font-medium">Cupom</th>
                  <th className="text-right py-2 font-medium">Resgates</th>
                  <th className="text-right py-2 font-medium">Clientes únicos</th>
                  <th className="text-left py-2 font-medium pl-4">Horário de pico</th>
                </tr>
              </thead>
              <tbody>
                {resultado.map((r) => (
                  <tr key={r.codigo} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-foreground text-xs">{r.data}</td>
                    <td className="py-3 font-mono text-foreground">{r.codigo}</td>
                    <td className="py-3 text-right font-bold text-primary">{r.resgates}</td>
                    <td className="py-3 text-right text-foreground">{r.clientesUnicos}</td>
                    <td className="py-3 pl-4 text-foreground">{r.horarioPico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
