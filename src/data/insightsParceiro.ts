// ============================================================================
// Insights e alertas acionáveis do Portal do Parceiro
// Deriva alertas + insights a partir dos cupons + utilizados atuais + ticket médio.
// Nada hardcode: tudo calculado a partir dos dados recebidos.
// ============================================================================
import type { Cupom } from "./mockData";

export type SeveridadeInsight = "info" | "atencao" | "critico";
export type TipoInsight = "insight" | "alerta";

export interface InsightItem {
  id: string;
  tipo: TipoInsight;
  severidade: SeveridadeInsight;
  titulo: string;
  descricao: string;
  cta?: { label: string; href: string };
}

interface Params {
  cupons: Cupom[];
  getUtilizados: (id: number) => number;
  ticketMedio: number;
  hoje?: Date;
}

const severidadeOrdem: Record<SeveridadeInsight, number> = {
  critico: 0,
  atencao: 1,
  info: 2,
};

function diasEntre(a: Date, b: Date): number {
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatPct(n: number, casas = 1): string {
  return `${n.toFixed(casas).replace(".", ",")}%`;
}

export function gerarInsightsParceiro({
  cupons,
  getUtilizados,
  hoje = new Date(),
}: Params): InsightItem[] {
  const items: InsightItem[] = [];

  const ativos = cupons.filter((c) => c.status === "Ativo");

  // 1) Alerta de esgotamento (>= 85% da meta)
  for (const c of ativos) {
    if (c.meta > 0) {
      const pct = c.resgates / c.meta;
      if (pct >= 0.85) {
        items.push({
          id: `esgot-${c.id}`,
          tipo: "alerta",
          severidade: pct >= 0.95 ? "critico" : "atencao",
          titulo: `'${c.nome}' está perto de esgotar`,
          descricao: `${Math.round(pct * 100)}% da meta (${c.resgates}/${c.meta} resgates). Considere ampliar ou renovar antes que acabe.`,
          cta: { label: "Solicitar renovação", href: "/solicitacoes" },
        });
      }
    }
  }

  // 2) Alerta de expiração (<= 14 dias)
  for (const c of ativos) {
    const fim = new Date(c.fim);
    if (!Number.isNaN(fim.getTime())) {
      const dias = diasEntre(fim, hoje);
      if (dias >= 0 && dias <= 14) {
        items.push({
          id: `expira-${c.id}`,
          tipo: "alerta",
          severidade: dias <= 7 ? "critico" : "atencao",
          titulo: `'${c.nome}' expira em ${dias} ${dias === 1 ? "dia" : "dias"}`,
          descricao: `Vigência termina em ${fim.toLocaleDateString("pt-BR")}. Solicite renovação com antecedência.`,
          cta: { label: "Renovar", href: "/solicitacoes" },
        });
      }
    }
  }

  // 3) Alerta de queda de conversão (uso único agregado)
  const uu = cupons.filter((c) => c.tipo === "uso_unico");
  const resAt = uu.reduce((a, c) => a + c.resgates, 0);
  const utAt = uu.reduce((a, c) => a + getUtilizados(c.id), 0);
  const resAnt = uu.reduce((a, c) => a + c.resgatesAnterior, 0);
  const utAnt = uu.reduce((a, c) => a + c.utilizadosAnterior, 0);
  if (resAt > 0 && resAnt > 0) {
    const convAt = (utAt / resAt) * 100;
    const convAnt = (utAnt / resAnt) * 100;
    const diffPP = convAt - convAnt;
    if (diffPP <= -1) {
      items.push({
        id: "queda-conversao",
        tipo: "alerta",
        severidade: diffPP <= -3 ? "critico" : "atencao",
        titulo: `Conversão caiu ${Math.abs(diffPP).toFixed(1).replace(".", ",")} p.p. vs mês anterior`,
        descricao: `Uso único: de ${formatPct(convAnt)} para ${formatPct(convAt)}. Revise divulgação e mecânica das ofertas.`,
      });
    }
  }

  // 4) Insight de melhor oferta (por conversão de uso único; fallback: recorrente com maior razão)
  const rankUU = [...uu]
    .map((c) => ({ c, ratio: c.resgates > 0 ? getUtilizados(c.id) / c.resgates : 0 }))
    .sort((a, b) => b.ratio - a.ratio);
  const melhor = rankUU[0];
  if (melhor && melhor.ratio > 0) {
    items.push({
      id: `melhor-${melhor.c.id}`,
      tipo: "insight",
      severidade: "info",
      titulo: `'${melhor.c.nome}' é sua melhor oferta`,
      descricao: `Conversão de ${formatPct(melhor.ratio * 100)} (${getUtilizados(melhor.c.id)} utilizados / ${melhor.c.resgates} resgates).`,
    });

    // 5) Insight de melhor horário/dia (da melhor oferta)
    if (melhor.c.melhorDia || melhor.c.melhorHorario) {
      items.push({
        id: `momento-${melhor.c.id}`,
        tipo: "insight",
        severidade: "info",
        titulo: `Seu melhor momento é ${melhor.c.melhorDia}${melhor.c.melhorHorario ? `, ${melhor.c.melhorHorario}` : ""}`,
        descricao: `Concentre campanhas de '${melhor.c.nome}' nessa janela para aproveitar o pico de resgates.`,
      });
    }
  }

  // 6) Insight de desconto: correlação % desconto × conversão (uso único)
  const uuDescontos = uu
    .map((c) => {
      const m = c.desconto.match(/(\d+)\s*%/);
      const pct = m ? parseInt(m[1], 10) : NaN;
      const conv = c.resgates > 0 ? (getUtilizados(c.id) / c.resgates) * 100 : 0;
      return { c, pctDesc: pct, conv };
    })
    .filter((x) => Number.isFinite(x.pctDesc));
  if (uuDescontos.length >= 2) {
    const sorted = [...uuDescontos].sort((a, b) => b.conv - a.conv);
    const top = sorted[0];
    const bot = sorted[sorted.length - 1];
    if (top.pctDesc !== bot.pctDesc && top.conv - bot.conv >= 2) {
      items.push({
        id: "desconto-conversao",
        tipo: "insight",
        severidade: "info",
        titulo: `Cupons de ${top.pctDesc}% convertem mais que os de ${bot.pctDesc}%`,
        descricao: `'${top.c.nome}' (${formatPct(top.conv)}) supera '${bot.c.nome}' (${formatPct(bot.conv)}). Considere calibrar novos cupons por aí.`,
      });
    }
  }

  // 7) Insight de recompra (recorrente com razão >= 1,5)
  const recorrentes = cupons.filter((c) => c.tipo === "recorrente");
  for (const c of recorrentes) {
    const usos = c.resgates > 0 ? getUtilizados(c.id) / c.resgates : 0;
    if (usos >= 1.5) {
      items.push({
        id: `recompra-${c.id}`,
        tipo: "insight",
        severidade: "info",
        titulo: `'${c.nome}' tem ${usos.toFixed(1).replace(".", ",")}× usos por usuário`,
        descricao: `Cupom recorrente gerando recompra — bom para fidelizar a base.`,
      });
    }
  }

  // Ordena por severidade (crítico > atenção > info), alertas primeiro
  items.sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === "alerta" ? -1 : 1;
    return severidadeOrdem[a.severidade] - severidadeOrdem[b.severidade];
  });

  // Limita entre 4 e 6 itens
  return items.slice(0, 6);
}
