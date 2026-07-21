// ============================================================================
// Portal do Parceiro iRun Clube+ — Mock Data (B2B Anunciante de Cupom)
// Empresa parceira: Farmácia Saúde Total (segmento Saúde)
// REGRA LGPD: Nenhum dado individual de saúde, atividade física, distância,
// calorias, CO₂ ou desafios. Todos os perfis são agregados e anônimos.
// ============================================================================

export const empresaParceira = {
  nome: "Farmácia Saúde Total",
  segmento: "Saúde",
  cnpj: "12.345.678/0001-90",
};

// ---------------------------------------------------------------------------
// KPIs do Dashboard
// ---------------------------------------------------------------------------
export const kpisDashboard = {
  resgatesMes: { label: "Cupons resgatados (mês)", value: 847, trend: "+14%" },
  cuponsAtivos: { label: "Cupons ativos", value: 2, trend: "+0" },
  taxaConversao: { label: "Taxa de conversão", value: "18,4%", trend: "+2,1%" },
  clientesUnicos: { label: "Clientes únicos alcançados", value: 623, trend: "+9%" },
};

// ---------------------------------------------------------------------------
// Resgates por dia da semana
// ---------------------------------------------------------------------------
export const resgatesPorDia = [
  { dia: "Seg", resgates: 98 },
  { dia: "Ter", resgates: 112 },
  { dia: "Qua", resgates: 187 }, // pico
  { dia: "Qui", resgates: 134 },
  { dia: "Sex", resgates: 142 },
  { dia: "Sáb", resgates: 102 },
  { dia: "Dom", resgates: 72 },
];

// ---------------------------------------------------------------------------
// Resgates por hora do dia
// ---------------------------------------------------------------------------
export const resgatesPorHora = Array.from({ length: 24 }, (_, h) => {
  let base = 5;
  if (h >= 12 && h <= 14) base = 55; // pico almoço
  else if (h >= 18 && h <= 20) base = 38;
  else if (h >= 8 && h <= 11) base = 22;
  else if (h >= 15 && h <= 17) base = 28;
  else if (h >= 21 && h <= 22) base = 18;
  else if (h < 6) base = 2;
  return { hora: `${String(h).padStart(2, "0")}h`, resgates: base + Math.floor(Math.random() * 8) };
});

// ---------------------------------------------------------------------------
// Perfil Anonimizado do Resgatador (LGPD: somente agregados)
// ---------------------------------------------------------------------------
export const perfilFaixaEtaria = [
  { faixa: "18–25", percentual: 22 },
  { faixa: "26–35", percentual: 41 },
  { faixa: "36–45", percentual: 24 },
  { faixa: "45+", percentual: 13 },
];

export const perfilTopCidades = [
  { cidade: "São Paulo, SP", percentual: 48 },
  { cidade: "Rio de Janeiro, RJ", percentual: 19 },
  { cidade: "Belo Horizonte, MG", percentual: 12 },
];

// LGPD: nível agregado predominante do grupo (não individualizado)
export const perfilAtividadePredominante = {
  predominante: "Moderadamente Ativo",
  escala: [
    "Sedentário",
    "Levemente Ativo",
    "Moderadamente Ativo",
    "Ativo",
    "Altamente Ativo",
  ],
};

// ---------------------------------------------------------------------------
// Cupons da empresa
// ---------------------------------------------------------------------------
export type StatusCupom = "Ativo" | "Expirado" | "Esgotado";
export type TipoCupom = "uso_unico" | "recorrente";

export interface Cupom {
  id: number;
  nome: string;
  codigo: string;
  desconto: string;
  status: StatusCupom;
  tipo: TipoCupom;
  inicio: string;
  fim: string;
  resgates: number;
  utilizados: number;
  meta: number;
  taxaResgate: number; // %
  melhorDia: string;
  melhorHorario: string;
}

export const cuponsData: Cupom[] = [
  {
    id: 1,
    nome: "Saúde 10",
    codigo: "SAUDE10",
    desconto: "10% OFF",
    status: "Ativo",
    tipo: "uso_unico",
    inicio: "2026-05-01",
    fim: "2026-09-30",
    resgates: 412,
    utilizados: 291, // ~71% de conversão
    meta: 600,
    taxaResgate: 22.7,
    melhorDia: "Quarta-feira",
    melhorHorario: "12h–14h",
  },
  {
    id: 2,
    nome: "Verão 20",
    codigo: "VERAO20",
    desconto: "20% OFF",
    status: "Expirado",
    tipo: "uso_unico",
    inicio: "2025-12-01",
    fim: "2026-03-15",
    resgates: 289,
    utilizados: 187, // ~65% de conversão
    meta: 400,
    taxaResgate: 14.3,
    melhorDia: "Sábado",
    melhorHorario: "10h–12h",
  },
  {
    id: 3,
    nome: "Fidelidade 15",
    codigo: "FIDELIDADE15",
    desconto: "15% OFF",
    status: "Ativo",
    tipo: "recorrente",
    inicio: "2026-03-01",
    fim: "2026-05-31",
    resgates: 425,
    utilizados: 892, // ~2,1× por usuário (recompra)
    meta: 500,
    taxaResgate: 19.8,
    melhorDia: "Quarta-feira",
    melhorHorario: "13h",
  },
];

// ---------------------------------------------------------------------------
// Validação de cupom
// ---------------------------------------------------------------------------
export type ResultadoValidacao =
  | { valido: true; cupom: Cupom }
  | { valido: false; motivo: "expirado" | "ja_utilizado" | "invalido"; cupom?: Cupom };

const codigosUtilizados = new Set<string>(["VERAO20-USADO"]);

export const RESGATES_CONFIRMADOS_KEY = "portal-parceiro:resgates-confirmados";

function lerResgatesConfirmados(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(RESGATES_CONFIRMADOS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

export function confirmarResgate(codigo: string): void {
  if (typeof window === "undefined") return;
  const code = codigo.trim().toUpperCase();
  const set = lerResgatesConfirmados();
  set.add(code);
  window.localStorage.setItem(RESGATES_CONFIRMADOS_KEY, JSON.stringify([...set]));
}

export function isResgateConfirmado(codigo: string): boolean {
  return lerResgatesConfirmados().has(codigo.trim().toUpperCase());
}

export function validarCodigoCupom(codigo: string): ResultadoValidacao {
  const code = codigo.trim().toUpperCase();
  if (codigosUtilizados.has(code) || lerResgatesConfirmados().has(code)) {
    const cupom = cuponsData.find((c) => c.codigo === code);
    return { valido: false, motivo: "ja_utilizado", cupom };
  }
  const cupom = cuponsData.find((c) => c.codigo === code);
  if (!cupom) return { valido: false, motivo: "invalido" };
  if (cupom.status === "Expirado" || new Date(cupom.fim) < new Date()) {
    return { valido: false, motivo: "expirado", cupom };
  }
  return { valido: true, cupom };
}


// Histórico das últimas validações
export interface ValidacaoLog {
  id: string;
  codigo: string;
  data: string;
  resultado: "Aprovado" | "Recusado";
  motivo?: string;
}

export const historicoValidacoes: ValidacaoLog[] = [
  { id: "v1", codigo: "SAUDE10", data: "2026-04-29 14:32", resultado: "Aprovado" },
  { id: "v2", codigo: "FIDELIDADE15", data: "2026-04-29 13:18", resultado: "Aprovado" },
  { id: "v3", codigo: "VERAO20", data: "2026-04-29 11:05", resultado: "Recusado", motivo: "Expirado" },
  { id: "v4", codigo: "SAUDE10", data: "2026-04-28 18:47", resultado: "Aprovado" },
  { id: "v5", codigo: "INVAL01", data: "2026-04-28 17:22", resultado: "Recusado", motivo: "Inválido" },
  { id: "v6", codigo: "FIDELIDADE15", data: "2026-04-28 13:55", resultado: "Aprovado" },
  { id: "v7", codigo: "SAUDE10", data: "2026-04-28 12:39", resultado: "Aprovado" },
  { id: "v8", codigo: "FIDELIDADE15", data: "2026-04-27 15:12", resultado: "Aprovado" },
  { id: "v9", codigo: "SAUDE10", data: "2026-04-27 13:08", resultado: "Aprovado" },
  { id: "v10", codigo: "VERAO20", data: "2026-04-27 09:45", resultado: "Recusado", motivo: "Expirado" },
];

// ---------------------------------------------------------------------------
// Comparativo de Performance entre Cupons
// ---------------------------------------------------------------------------
export const comparativoCupons = cuponsData
  .filter((c) => c.status === "Ativo")
  .sort((a, b) => b.taxaResgate - a.taxaResgate)
  .map((c) => ({
    nome: c.nome,
    codigo: c.codigo,
    taxaResgate: c.taxaResgate,
    melhorDia: c.melhorDia,
    melhorHorario: c.melhorHorario,
  }));

// ---------------------------------------------------------------------------
// Benchmarking de Mercado (anônimo)
// ---------------------------------------------------------------------------
export const benchmarking = {
  taxaEmpresa: 18.4,
  mediaSegmento: 14.8,
  diferencaPct: 24.3, // % acima da média
  segmento: "Saúde",
};

// ---------------------------------------------------------------------------
// Avaliação do Estabelecimento
// ---------------------------------------------------------------------------
export const avaliacaoEstabelecimento = {
  media: 4.3,
  total: 127,
  distribuicao: [
    { estrelas: 5, qtd: 78 },
    { estrelas: 4, qtd: 31 },
    { estrelas: 3, qtd: 12 },
    { estrelas: 2, qtd: 4 },
    { estrelas: 1, qtd: 2 },
  ],
};

// ---------------------------------------------------------------------------
// Contratos
// ---------------------------------------------------------------------------
export type StatusContrato = "Ativo" | "A Vencer" | "Expirado";

export interface Contrato {
  id: string;
  nome: string;
  objeto: string;
  inicio: string;
  fim: string;
  status: StatusContrato;
  diasRestantes: number;
  valor: string;
  responsavel: string;
  observacoes: string;
}

export const contratosData: Contrato[] = [
  {
    id: "CTR-2026-001",
    nome: "Contrato de Veiculação 2026/01",
    objeto: "Veiculação de cupons promocionais no app iRun Clube+",
    inicio: "2026-01-01",
    fim: "2026-05-18",
    status: "A Vencer",
    diasRestantes: 18,
    valor: "R$ 24.000,00 / trimestre",
    responsavel: "Equipe Comercial iRun",
    observacoes: "Renovação automática mediante aprovação. Contate o time iRun em até 30 dias do vencimento.",
  },
  {
    id: "CTR-2025-003",
    nome: "Contrato Sazonal Verão 2025/26",
    objeto: "Campanha de cupons sazonais (dez/2025 a mar/2026)",
    inicio: "2025-12-01",
    fim: "2026-03-15",
    status: "Expirado",
    diasRestantes: 0,
    valor: "R$ 12.000,00",
    responsavel: "Equipe Comercial iRun",
    observacoes: "Contrato encerrado conforme prazo previsto.",
  },
];

// ---------------------------------------------------------------------------
// Solicitações de novo cupom
// ---------------------------------------------------------------------------
export type TipoDesconto = "percentual" | "valor" | "brinde";
export type LimiteResgate = "ilimitado" | "limitado";

export interface SolicitacaoDetalhes {
  tipoDesconto?: TipoDesconto;
  valorDesconto?: number;
  descricaoBrinde?: string;
  limiteResgate?: LimiteResgate;
  quantidadeLimite?: number;
  tipoCupom?: TipoCupom;
  inicio?: string;
  fim?: string;
  observacoes?: string;
}

export interface Solicitacao {
  id: string;
  data: string;
  tipo: "Novo Cupom" | "Renovação";
  nomeCupom: string;
  status: "Enviado" | "Em Análise" | "Aprovado";
  detalhes?: SolicitacaoDetalhes;
}

export const solicitacoesIniciais: Solicitacao[] = [
  { id: "SOL-007", data: "2026-04-22", tipo: "Novo Cupom", nomeCupom: "Outono 12", status: "Em Análise" },
  { id: "SOL-006", data: "2026-04-10", tipo: "Renovação", nomeCupom: "Verão 20", status: "Aprovado" },
  { id: "SOL-005", data: "2026-03-28", tipo: "Novo Cupom", nomeCupom: "Saúde 10", status: "Aprovado" },
];

// ---------------------------------------------------------------------------
// Notificações (drawer)
// ---------------------------------------------------------------------------
export type TipoNotificacao =
  | "cupom_expirando"
  | "cupom_alto_uso"
  | "estoque_baixo"
  | "nova_avaliacao"
  | "contrato_vencendo";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  descricao: string;
  data: string;
  link: string;
  lida: boolean;
}

export const notificacoesIniciais: Notificacao[] = [
  {
    id: "n1",
    tipo: "contrato_vencendo",
    titulo: "Contrato vencendo em 18 dias",
    descricao: "Contrato CTR-2026-001 vence em 18/05/2026.",
    data: "2026-04-29",
    link: "/contratos",
    lida: false,
  },
  {
    id: "n2",
    tipo: "cupom_alto_uso",
    titulo: "Cupom FIDELIDADE15 com 85% de uso",
    descricao: "Restam 75 resgates antes de esgotar.",
    data: "2026-04-29",
    link: "/cupons",
    lida: false,
  },
  {
    id: "n3",
    tipo: "nova_avaliacao",
    titulo: "Nova avaliação 5 estrelas",
    descricao: "Você recebeu uma nova avaliação após o uso de SAUDE10.",
    data: "2026-04-28",
    link: "/dashboard",
    lida: false,
  },
  {
    id: "n4",
    tipo: "estoque_baixo",
    titulo: "Estoque de cupons baixo",
    descricao: "FIDELIDADE15 está com menos de 20% disponível.",
    data: "2026-04-27",
    link: "/cupons",
    lida: true,
  },
];
