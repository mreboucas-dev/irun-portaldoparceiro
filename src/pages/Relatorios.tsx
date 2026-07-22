import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cuponsData, empresaParceira } from "@/data/mockData";
import { useUtilizados } from "@/hooks/useUtilizados";
import { useTicketMedio, formatBRL } from "@/hooks/useTicketMedio";
import { FileBarChart, Download, FileText, CalendarClock, Info } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RelatorioRow {
  codigo: string;
  nome: string;
  tipo: "uso_unico" | "recorrente";
  resgatados: number;
  utilizados: number;
  conversaoLabel: string; // "71%" ou "2,1×/usuário"
  conversaoNum: number;
  receitaEstimada: number;
  melhorHorario: string;
}

const AGENDA_KEY = "portal-parceiro:relatorios-agenda";
type Agenda = { frequencia: "semanal" | "mensal"; email: string; salvoEm: string } | null;

function readAgenda(): Agenda {
  try {
    const raw = localStorage.getItem(AGENDA_KEY);
    return raw ? (JSON.parse(raw) as Agenda) : null;
  } catch {
    return null;
  }
}

export default function Relatorios() {
  const { getUtilizados } = useUtilizados();
  const { ticketMedio } = useTicketMedio();

  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [cupom, setCupom] = useState("todos");
  const [resultado, setResultado] = useState<RelatorioRow[] | null>(null);
  const [periodoLabel, setPeriodoLabel] = useState("");

  const [frequencia, setFrequencia] = useState<"semanal" | "mensal">("semanal");
  const [email, setEmail] = useState("");
  const [agenda, setAgenda] = useState<Agenda>(() => readAgenda());

  useEffect(() => {
    if (agenda) {
      setFrequencia(agenda.frequencia);
      setEmail(agenda.email);
    }
  }, [agenda]);

  const gerarLinhas = useMemo(() => {
    return (codigo: string): RelatorioRow[] => {
      const cupons =
        codigo === "todos" ? cuponsData : cuponsData.filter((c) => c.codigo === codigo);
      return cupons.map((c) => {
        const utilizados = getUtilizados(c.id);
        const receita = utilizados * ticketMedio;
        let conversaoLabel = "—";
        let conversaoNum = 0;
        if (c.resgates > 0) {
          if (c.tipo === "uso_unico") {
            const pct = (utilizados / c.resgates) * 100;
            conversaoNum = pct;
            conversaoLabel = `${pct.toFixed(1).replace(".", ",")}%`;
          } else {
            const ratio = utilizados / c.resgates;
            conversaoNum = ratio;
            conversaoLabel = `${ratio.toFixed(1).replace(".", ",")}×/usuário`;
          }
        }
        return {
          codigo: c.codigo,
          nome: c.nome,
          tipo: c.tipo,
          resgatados: c.resgates,
          utilizados,
          conversaoLabel,
          conversaoNum,
          receitaEstimada: receita,
          melhorHorario: c.melhorHorario,
        };
      });
    };
  }, [getUtilizados, ticketMedio]);

  const handleGerar = () => {
    if (!inicio || !fim) {
      toast.error("Selecione data de início e fim");
      return;
    }
    if (new Date(inicio) > new Date(fim)) {
      toast.error("Data de início deve ser anterior à data de fim");
      return;
    }
    const label = `${new Date(inicio).toLocaleDateString("pt-BR")} – ${new Date(fim).toLocaleDateString("pt-BR")}`;
    setPeriodoLabel(label);
    setResultado(gerarLinhas(cupom));
    toast.success("Relatório gerado");
  };

  const exportCSV = () => {
    if (!resultado) return;
    const header = [
      "Período",
      "Cupom",
      "Tipo",
      "Resgatados",
      "Utilizados",
      "Conversão",
      "Receita estimada (R$)",
      "Horário de pico",
    ];
    const lines = [header.join(";")].concat(
      resultado.map((r) =>
        [
          periodoLabel,
          r.codigo,
          r.tipo === "uso_unico" ? "Uso único" : "Recorrente",
          r.resgatados,
          r.utilizados,
          r.conversaoLabel,
          r.receitaEstimada.toFixed(2).replace(".", ","),
          r.melhorHorario,
        ].join(";")
      )
    );
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-cupons-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  const exportPDF = () => {
    if (!resultado) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relatório de Cupons", 40, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(`${empresaParceira.nome} — CNPJ ${empresaParceira.cnpj}`, 40, 66);
    doc.text(`Período: ${periodoLabel}`, 40, 80);
    doc.text(
      `Ticket médio (premissa): ${formatBRL(ticketMedio)} • Gerado em ${new Date().toLocaleString("pt-BR")}`,
      40,
      94
    );

    autoTable(doc, {
      startY: 112,
      head: [[
        "Cupom",
        "Tipo",
        "Resgatados",
        "Utilizados",
        "Conversão",
        "Receita est. (R$)",
        "Horário de pico",
      ]],
      body: resultado.map((r) => [
        `${r.codigo}\n${r.nome}`,
        r.tipo === "uso_unico" ? "Uso único" : "Recorrente",
        String(r.resgatados),
        String(r.utilizados),
        r.conversaoLabel,
        formatBRL(r.receitaEstimada),
        r.melhorHorario,
      ]),
      styles: { font: "helvetica", fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [11, 34, 151], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 40, right: 40 },
    });

    // Rodapé
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 200;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Receita estimada = ticket médio (premissa informada pelo parceiro) × cupons utilizados. Não representa venda real medida.",
      40,
      Math.min(finalY + 24, doc.internal.pageSize.getHeight() - 30),
      { maxWidth: pageWidth - 80 }
    );

    doc.save(`relatorio-cupons-${Date.now()}.pdf`);
    toast.success("PDF gerado");
  };

  const salvarAgenda = () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Informe um e-mail válido");
      return;
    }
    const nova: Agenda = { frequencia, email, salvoEm: new Date().toISOString() };
    localStorage.setItem(AGENDA_KEY, JSON.stringify(nova));
    setAgenda(nova);
    toast.success("Preferência de agendamento salva", {
      description: "Envio automático por e-mail depende de backend (fase futura).",
    });
  };

  const removerAgenda = () => {
    localStorage.removeItem(AGENDA_KEY);
    setAgenda(null);
    setEmail("");
    toast.success("Agendamento removido");
  };

  const totais = useMemo(() => {
    if (!resultado) return null;
    return {
      resgatados: resultado.reduce((s, r) => s + r.resgatados, 0),
      utilizados: resultado.reduce((s, r) => s + r.utilizados, 0),
      receita: resultado.reduce((s, r) => s + r.receitaEstimada, 0),
    };
  }, [resultado]);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">
          Gere relatórios de desempenho por período e cupom (resgatados, utilizados, conversão e
          receita estimada).
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
                  <SelectItem key={c.codigo} value={c.codigo}>
                    {c.codigo}
                  </SelectItem>
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
        <p className="mt-3 text-xs text-muted-foreground flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          Receita é <strong className="font-semibold">estimativa</strong> (ticket médio ×
          utilizados). Ticket médio atual: {formatBRL(ticketMedio)} — editável no Dashboard.
        </p>
      </GlassCard>

      {resultado === null ? (
        <GlassCard className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium">
            Selecione o período e clique em Gerar Relatório
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Os resultados aparecerão aqui em formato de tabela.
          </p>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Resultado</h3>
              <p className="text-xs text-muted-foreground">Período: {periodoLabel}</p>
            </div>
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
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left py-2 font-medium">Cupom</th>
                  <th className="text-left py-2 font-medium">Tipo</th>
                  <th className="text-right py-2 font-medium">Resgatados</th>
                  <th className="text-right py-2 font-medium">Utilizados</th>
                  <th className="text-right py-2 font-medium">Conversão</th>
                  <th className="text-right py-2 font-medium">Receita est.</th>
                  <th className="text-left py-2 font-medium pl-4">Horário de pico</th>
                </tr>
              </thead>
              <tbody>
                {resultado.map((r) => (
                  <tr key={r.codigo} className="border-b border-border/50 last:border-0">
                    <td className="py-3">
                      <div className="font-mono text-foreground">{r.codigo}</div>
                      <div className="text-xs text-muted-foreground">{r.nome}</div>
                    </td>
                    <td className="py-3 text-foreground text-xs">
                      {r.tipo === "uso_unico" ? "Uso único" : "Recorrente"}
                    </td>
                    <td className="py-3 text-right text-foreground">{r.resgatados}</td>
                    <td className="py-3 text-right font-semibold text-foreground">
                      {r.utilizados}
                    </td>
                    <td className="py-3 text-right font-bold text-primary">{r.conversaoLabel}</td>
                    <td className="py-3 text-right font-semibold text-foreground">
                      {formatBRL(r.receitaEstimada)}
                    </td>
                    <td className="py-3 pl-4 text-foreground">{r.melhorHorario}</td>
                  </tr>
                ))}
                {totais && (
                  <tr className="bg-muted/30">
                    <td className="py-3 font-semibold text-foreground" colSpan={2}>
                      Total
                    </td>
                    <td className="py-3 text-right font-semibold text-foreground">
                      {totais.resgatados}
                    </td>
                    <td className="py-3 text-right font-semibold text-foreground">
                      {totais.utilizados}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">—</td>
                    <td className="py-3 text-right font-bold text-primary">
                      {formatBRL(totais.receita)}
                    </td>
                    <td className="py-3 pl-4 text-muted-foreground">—</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Receita estimada = ticket médio ({formatBRL(ticketMedio)}) × cupons utilizados. Não
            representa venda real medida.
          </p>
        </GlassCard>
      )}

      <GlassCard>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Agendar envio</h3>
            <p className="text-xs text-muted-foreground">
              Salve sua preferência de frequência e e-mail. Preview: o envio automático depende de
              backend (fase futura) — nada é enviado agora.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="freq">Frequência</Label>
            <Select value={frequencia} onValueChange={(v) => setFrequencia(v as "semanal" | "mensal")}>
              <SelectTrigger id="freq">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mail">E-mail de destino</Label>
            <Input
              id="mail"
              type="email"
              placeholder="parceiro@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={salvarAgenda} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Salvar preferência
            </Button>
            {agenda && (
              <Button variant="outline" onClick={removerAgenda}>
                Remover
              </Button>
            )}
          </div>
        </div>

        {agenda && (
          <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border text-sm">
            <p className="text-foreground">
              Preferência salva: <strong>{agenda.frequencia === "semanal" ? "Semanal" : "Mensal"}</strong> →{" "}
              <span className="font-mono">{agenda.email}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Salvo em {new Date(agenda.salvoEm).toLocaleString("pt-BR")}. Envio automático será
              ativado quando o backend de e-mail estiver disponível.
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
