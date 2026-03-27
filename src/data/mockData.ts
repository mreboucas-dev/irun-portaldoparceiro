// KPI Data
export const kpiData = {
  resgatesTotais: { label: "Resgates Totais", value: 1247, trend: "+12%", icon: "gift" },
  economiaCO2: { label: "Economia de CO₂", value: "3.2 ton", trend: "+8%", icon: "leaf" },
  scoreSaude: { label: "Score de Saúde", value: 87, trend: "+5%", icon: "heart" },
  colaboradoresAtivos: { label: "Colaboradores Ativos", value: 342, trend: "+3%", icon: "users" },
};

// Resgates por categoria (barras empilhadas)
export const resgatesPorCategoria = [
  { mes: "Jan", alimentacao: 120, transporte: 80, lazer: 45, saude: 30 },
  { mes: "Fev", alimentacao: 140, transporte: 95, lazer: 52, saude: 38 },
  { mes: "Mar", alimentacao: 160, transporte: 88, lazer: 60, saude: 42 },
  { mes: "Abr", alimentacao: 135, transporte: 102, lazer: 48, saude: 35 },
  { mes: "Mai", alimentacao: 175, transporte: 110, lazer: 65, saude: 50 },
  { mes: "Jun", alimentacao: 190, transporte: 125, lazer: 70, saude: 55 },
];

// Engajamento semanal (linhas)
export const engajamentoSemanal = [
  { semana: "Sem 1", ativos: 210, resgates: 85 },
  { semana: "Sem 2", ativos: 245, resgates: 102 },
  { semana: "Sem 3", ativos: 230, resgates: 95 },
  { semana: "Sem 4", ativos: 280, resgates: 130 },
  { semana: "Sem 5", ativos: 310, resgates: 148 },
  { semana: "Sem 6", ativos: 295, resgates: 138 },
  { semana: "Sem 7", ativos: 340, resgates: 165 },
  { semana: "Sem 8", ativos: 325, resgates: 155 },
];

// Cupons
export const cuponsData = [
  { id: 1, nome: "10% Off Corrida", categoria: "Transporte", status: "Ativo", ctr: 12.5, resgates: 245, validade: "2026-04-30" },
  { id: 2, nome: "Smoothie Grátis", categoria: "Alimentação", status: "Ativo", ctr: 18.3, resgates: 189, validade: "2026-05-15" },
  { id: 3, nome: "Aula de Yoga", categoria: "Saúde", status: "Pausado", ctr: 8.7, resgates: 67, validade: "2026-04-20" },
  { id: 4, nome: "Desconto Tênis", categoria: "Esporte", status: "Ativo", ctr: 22.1, resgates: 312, validade: "2026-06-01" },
  { id: 5, nome: "Café Premium", categoria: "Alimentação", status: "Expirado", ctr: 15.4, resgates: 156, validade: "2026-03-01" },
  { id: 6, nome: "Massagem 20min", categoria: "Saúde", status: "Ativo", ctr: 9.2, resgates: 98, validade: "2026-07-10" },
];

// Heatmap de horários de resgate (hora x dia)
export const heatmapData: { dia: string; hora: number; valor: number }[] = [];
const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
for (const dia of dias) {
  for (let hora = 6; hora <= 22; hora++) {
    const base = dia === "Sáb" || dia === "Dom" ? 3 : 8;
    const peakBonus = (hora >= 12 && hora <= 13) || (hora >= 18 && hora <= 19) ? 15 : 0;
    heatmapData.push({ dia, hora, valor: Math.floor(Math.random() * base + peakBonus + Math.random() * 5) });
  }
}

// Solicitações / Tickets
export const solicitacoesData = [
  { id: "SOL-001", titulo: "Alterar validade do cupom 'Smoothie Grátis'", status: "Pendente", data: "2026-03-25", prioridade: "Alta", updates: [
    { data: "2026-03-25", msg: "Solicitação criada pelo parceiro." },
  ]},
  { id: "SOL-002", titulo: "Aumentar desconto do cupom 'Corrida'", status: "Em Análise", data: "2026-03-22", prioridade: "Média", updates: [
    { data: "2026-03-22", msg: "Solicitação criada pelo parceiro." },
    { data: "2026-03-23", msg: "Em análise pela equipe comercial." },
  ]},
  { id: "SOL-003", titulo: "Criar novo cupom de hidratação", status: "Resolvido", data: "2026-03-18", prioridade: "Baixa", updates: [
    { data: "2026-03-18", msg: "Solicitação criada pelo parceiro." },
    { data: "2026-03-19", msg: "Aprovado pela equipe." },
    { data: "2026-03-20", msg: "Cupom criado e ativado com sucesso." },
  ]},
];

// Equipe (colaboradores)
export const equipeData = [
  { id: 1, nome: "Ana Silva", email: "ana.s@empresa.com", nivel: "Atleta", passos: 12500, pontos: 890 },
  { id: 2, nome: "Bruno Costa", email: "bruno.c@empresa.com", nivel: "Ativo", passos: 8200, pontos: 650 },
  { id: 3, nome: "Carla Mendes", email: "carla.m@empresa.com", nivel: "Sedentário", passos: 3100, pontos: 210 },
  { id: 4, nome: "Diego Oliveira", email: "diego.o@empresa.com", nivel: "Ativo", passos: 7800, pontos: 580 },
  { id: 5, nome: "Elena Souza", email: "elena.s@empresa.com", nivel: "Atleta", passos: 15200, pontos: 950 },
  { id: 6, nome: "Felipe Santos", email: "felipe.s@empresa.com", nivel: "Ativo", passos: 6500, pontos: 430 },
  { id: 7, nome: "Gabriela Lima", email: "gabi.l@empresa.com", nivel: "Sedentário", passos: 2800, pontos: 180 },
  { id: 8, nome: "Henrique Rocha", email: "henrique.r@empresa.com", nivel: "Atleta", passos: 14000, pontos: 920 },
  { id: 9, nome: "Isabela Ferreira", email: "isa.f@empresa.com", nivel: "Ativo", passos: 9100, pontos: 710 },
  { id: 10, nome: "João Pedro", email: "joao.p@empresa.com", nivel: "Sedentário", passos: 4200, pontos: 290 },
];

export const csvSimulatedNames = [
  { nome: "Lucas Martins", email: "lucas.m@empresa.com", nivel: "Ativo", passos: 7400, pontos: 520 },
  { nome: "Marina Alves", email: "marina.a@empresa.com", nivel: "Sedentário", passos: 3500, pontos: 240 },
  { nome: "Nicolas Barbosa", email: "nicolas.b@empresa.com", nivel: "Atleta", passos: 11800, pontos: 870 },
  { nome: "Olivia Campos", email: "olivia.c@empresa.com", nivel: "Ativo", passos: 6900, pontos: 480 },
  { nome: "Paulo Ribeiro", email: "paulo.r@empresa.com", nivel: "Ativo", passos: 8600, pontos: 630 },
];

// Desafios
export const desafiosData = [
  { id: 1, nome: "Maratona do Mês", tipo: "Distância", meta: 100, atual: 72, unidade: "km", participantes: 45, icone: "🏃" },
  { id: 2, nome: "Queima Calórica", tipo: "Calorias", meta: 50000, atual: 38500, unidade: "kcal", participantes: 38, icone: "🔥" },
  { id: 3, nome: "Minutos Ativos", tipo: "Tempo", meta: 3000, atual: 2150, unidade: "min", participantes: 52, icone: "⏱️" },
];

export const rankingData = [
  { pos: 1, nome: "Elena Souza", pontos: 950, medalha: "🥇" },
  { pos: 2, nome: "Henrique Rocha", pontos: 920, medalha: "🥈" },
  { pos: 3, nome: "Ana Silva", pontos: 890, medalha: "🥉" },
  { pos: 4, nome: "Isabela Ferreira", pontos: 710, medalha: "" },
  { pos: 5, nome: "Bruno Costa", pontos: 650, medalha: "" },
  { pos: 6, nome: "Paulo Ribeiro", pontos: 630, medalha: "" },
  { pos: 7, nome: "Diego Oliveira", pontos: 580, medalha: "" },
  { pos: 8, nome: "Lucas Martins", pontos: 520, medalha: "" },
];

// Relatórios ESG & Life
export const esgAnteDepois = {
  antes: { co2: 12.5, deslocamento: 85, sedentarismo: 72 },
  depois: { co2: 9.3, deslocamento: 45, sedentarismo: 38 },
};

export const saudeColetiva = [
  { area: "Movimento", score: 82, fullMark: 100 },
  { area: "Sono", score: 68, fullMark: 100 },
  { area: "Nutrição", score: 75, fullMark: 100 },
  { area: "Bem-estar", score: 79, fullMark: 100 },
  { area: "Energia", score: 71, fullMark: 100 },
  { area: "Hidratação", score: 65, fullMark: 100 },
];
