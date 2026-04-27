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

// Códigos de validação manual de cupons
export const codigosValidacao: Record<string, number> = {
  "IRUN-CORR-2025": 1, // 10% Off Corrida (Ativo)
  "IRUN-SMTH-1138": 2, // Smoothie Grátis (Ativo)
  "IRUN-MASS-9921": 6, // Massagem 20min (Ativo)
  "IRUN-CAFE-0001": 5, // Café Premium (Expirado)
  "IRUN-YOGA-3344": 3, // Aula de Yoga (Pausado)
  "IRUN-TENS-7788": 4, // Desconto Tênis (Ativo)
};

export type ResultadoValidacao =
  | { valido: true; cupom: typeof cuponsData[number] }
  | { valido: false; motivo: "expirado" | "pausado" | "nao_encontrado"; cupom?: typeof cuponsData[number] };

export function validarCodigoCupom(codigo: string): ResultadoValidacao {
  const code = codigo.trim().toUpperCase();
  const cupomId = codigosValidacao[code];
  if (!cupomId) return { valido: false, motivo: "nao_encontrado" };
  const cupom = cuponsData.find((c) => c.id === cupomId);
  if (!cupom) return { valido: false, motivo: "nao_encontrado" };
  if (cupom.status === "Expirado" || new Date(cupom.validade) < new Date()) {
    return { valido: false, motivo: "expirado", cupom };
  }
  if (cupom.status === "Pausado") {
    return { valido: false, motivo: "pausado", cupom };
  }
  return { valido: true, cupom };
}

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

// Contratos de cupons
export const contratosData = [
  {
    id: "CTR-001",
    status: "Vigente" as const,
    inicio: "2026-03-01",
    fim: "2026-06-30",
    cupons: [
      { nome: "10% Off Corrida", categoria: "Transporte", resgates: 245 },
      { nome: "Smoothie Grátis", categoria: "Alimentação", resgates: 189 },
      { nome: "Massagem 20min", categoria: "Saúde", resgates: 98 },
    ],
    updates: [
      { data: "2026-03-01", msg: "Contrato ativado com sucesso." },
      { data: "2026-03-15", msg: "Primeiro relatório parcial gerado." },
    ],
  },
  {
    id: "CTR-000",
    status: "Encerrado" as const,
    inicio: "2025-11-01",
    fim: "2026-02-28",
    cupons: [
      { nome: "Café Premium", categoria: "Alimentação", resgates: 156 },
      { nome: "Desconto Tênis", categoria: "Esporte", resgates: 312 },
      { nome: "Aula de Yoga", categoria: "Saúde", resgates: 67 },
      { nome: "Desconto Farmácia", categoria: "Saúde", resgates: 203 },
    ],
    updates: [
      { data: "2025-11-01", msg: "Contrato ativado." },
      { data: "2026-02-28", msg: "Contrato encerrado conforme previsto." },
    ],
  },
];

export const solicitacaoNovoContrato = {
  id: "CTR-002",
  status: "Em Análise" as const,
  inicio: "2026-07-01",
  fim: "2026-09-30",
  cuponsPropostos: [
    { nome: "15% Off Corrida", categoria: "Transporte" },
    { nome: "Smoothie Grátis", categoria: "Alimentação" },
    { nome: "Aula de Pilates", categoria: "Saúde" },
    { nome: "Desconto Suplemento", categoria: "Nutrição" },
  ],
  updates: [
    { data: "2026-03-25", msg: "Solicitação de novo contrato enviada pelo parceiro." },
    { data: "2026-03-27", msg: "Em análise pela equipe comercial." },
  ],
};

// Equipe (colaboradores) — sem campo "nível" individual (LGPD)
export const equipeData = [
  { id: 1, nome: "Ana Silva", email: "ana.s@empresa.com", distanciaKm: 9.8, calorias: 620, tempoAtividadeMin: 75, pontos: 890 },
  { id: 2, nome: "Bruno Costa", email: "bruno.c@empresa.com", distanciaKm: 6.4, calorias: 410, tempoAtividadeMin: 52, pontos: 650 },
  { id: 3, nome: "Carla Mendes", email: "carla.m@empresa.com", distanciaKm: 2.1, calorias: 180, tempoAtividadeMin: 20, pontos: 210 },
  { id: 4, nome: "Diego Oliveira", email: "diego.o@empresa.com", distanciaKm: 5.9, calorias: 385, tempoAtividadeMin: 48, pontos: 580 },
  { id: 5, nome: "Elena Souza", email: "elena.s@empresa.com", distanciaKm: 12.3, calorias: 780, tempoAtividadeMin: 92, pontos: 950 },
  { id: 6, nome: "Felipe Santos", email: "felipe.s@empresa.com", distanciaKm: 4.8, calorias: 310, tempoAtividadeMin: 38, pontos: 430 },
  { id: 7, nome: "Gabriela Lima", email: "gabi.l@empresa.com", distanciaKm: 1.8, calorias: 140, tempoAtividadeMin: 15, pontos: 180 },
  { id: 8, nome: "Henrique Rocha", email: "henrique.r@empresa.com", distanciaKm: 11.2, calorias: 720, tempoAtividadeMin: 88, pontos: 920 },
  { id: 9, nome: "Isabela Ferreira", email: "isa.f@empresa.com", distanciaKm: 7.1, calorias: 460, tempoAtividadeMin: 58, pontos: 710 },
  { id: 10, nome: "João Pedro", email: "joao.p@empresa.com", distanciaKm: 3.0, calorias: 220, tempoAtividadeMin: 28, pontos: 290 },
];

// Base simulada de usuários do app iRun (em produção, viria via API)
export const usuariosAppIrun = [
  { id: 101, nome: "Ana Beatriz Souza", email: "ana.beatriz@gmail.com", username: "anabia", distanciaKm: 7.2, calorias: 450, tempoAtividadeMin: 55, pontos: 680 },
  { id: 102, nome: "Ana Paula Ferreira", email: "ana.p@outlook.com", username: "anapf", distanciaKm: 4.5, calorias: 290, tempoAtividadeMin: 35, pontos: 410 },
  { id: 103, nome: "Bruno Almeida", email: "bruno.almeida@gmail.com", username: "brunoalm", distanciaKm: 10.1, calorias: 640, tempoAtividadeMin: 78, pontos: 820 },
  { id: 104, nome: "Camila Ribeiro", email: "camila.r@hotmail.com", username: "camir", distanciaKm: 3.2, calorias: 220, tempoAtividadeMin: 28, pontos: 320 },
  { id: 105, nome: "Daniel Cardoso", email: "daniel.c@gmail.com", username: "danicard", distanciaKm: 8.6, calorias: 540, tempoAtividadeMin: 65, pontos: 730 },
  { id: 106, nome: "Eduarda Pinto", email: "duda.pinto@yahoo.com", username: "dudap", distanciaKm: 5.8, calorias: 380, tempoAtividadeMin: 47, pontos: 560 },
  { id: 107, nome: "Fernanda Castro", email: "fer.castro@gmail.com", username: "fercastro", distanciaKm: 11.4, calorias: 720, tempoAtividadeMin: 88, pontos: 910 },
  { id: 108, nome: "Gustavo Mello", email: "gustavo.m@outlook.com", username: "gusmello", distanciaKm: 2.4, calorias: 170, tempoAtividadeMin: 22, pontos: 240 },
  { id: 109, nome: "Helena Tavares", email: "helena.t@gmail.com", username: "helet", distanciaKm: 6.7, calorias: 430, tempoAtividadeMin: 53, pontos: 620 },
  { id: 110, nome: "Igor Nascimento", email: "igor.n@gmail.com", username: "igornas", distanciaKm: 9.3, calorias: 590, tempoAtividadeMin: 71, pontos: 790 },
  { id: 111, nome: "Juliana Pires", email: "ju.pires@gmail.com", username: "jupires", distanciaKm: 4.1, calorias: 270, tempoAtividadeMin: 33, pontos: 380 },
  { id: 112, nome: "Kaique Moreira", email: "kaique.m@hotmail.com", username: "kaiquem", distanciaKm: 7.9, calorias: 500, tempoAtividadeMin: 60, pontos: 690 },
  { id: 113, nome: "Larissa Duarte", email: "lari.duarte@gmail.com", username: "laridu", distanciaKm: 5.3, calorias: 350, tempoAtividadeMin: 42, pontos: 510 },
  { id: 114, nome: "Mateus Vieira", email: "mateus.v@outlook.com", username: "matvieira", distanciaKm: 12.8, calorias: 810, tempoAtividadeMin: 95, pontos: 980 },
  { id: 115, nome: "Renata Brito", email: "renata.b@gmail.com", username: "rebrito", distanciaKm: 6.0, calorias: 400, tempoAtividadeMin: 50, pontos: 590 },
];

export const csvSimulatedNames = [
  { nome: "Lucas Martins", email: "lucas.m@empresa.com", distanciaKm: 5.6, calorias: 370, tempoAtividadeMin: 45, pontos: 520 },
  { nome: "Marina Alves", email: "marina.a@empresa.com", distanciaKm: 2.4, calorias: 190, tempoAtividadeMin: 22, pontos: 240 },
  { nome: "Nicolas Barbosa", email: "nicolas.b@empresa.com", distanciaKm: 9.5, calorias: 610, tempoAtividadeMin: 72, pontos: 870 },
  { nome: "Olivia Campos", email: "olivia.c@empresa.com", distanciaKm: 5.2, calorias: 340, tempoAtividadeMin: 42, pontos: 480 },
  { nome: "Paulo Ribeiro", email: "paulo.r@empresa.com", distanciaKm: 6.8, calorias: 430, tempoAtividadeMin: 55, pontos: 630 },
];

// Distribuição de saúde corporativa — dados agregados e anônimos (LGPD)
export const distribuicaoSaude = [
  { nome: "Sedentários", valor: 30, cor: "#64748b" },
  { nome: "Ativos", valor: 50, cor: "#0b2297" },
  { nome: "Atletas", valor: 20, cor: "#daa520" },
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
