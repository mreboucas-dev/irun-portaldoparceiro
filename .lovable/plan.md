
# Portal do Parceiro iRun — Plano de Implementação

## Visão Geral
Portal frontend premium com dados simulados (mock data) para parceiros corporativos e de cupons da iRun. Estética glassmorphism com paleta azul marinho, dourado e branco.

---

## Fase 1: Fundação (Design System + Layout)
- Configurar paleta de cores (Azul Marinho `#0b2297`, Dourado `#daa520`, Branco) e variáveis CSS
- Adicionar fonte **Inter** via Google Fonts
- Criar layout principal com **sidebar de navegação** glassmorphism (translúcida com blur)
- Implementar componentes base: cards glassmorphism, botões com micro-animações, badges
- Configurar animações de entrada (fade-in, slide-up) no Tailwind

## Fase 2: Camada de Dados Mock
- Criar pasta `src/data/` com todos os dados simulados em JSON/TS:
  - KPIs (resgates, CO2, score de saúde)
  - Lista de cupons com métricas de CTR e horários
  - Colaboradores fictícios (equipe)
  - Rankings de desafios (distância, calorias, tempo)
  - Dados de relatórios ESG/Life
- Criar serviços mock (`src/services/`) que retornam esses dados

## Fase 3: Dashboard (`/dashboard`)
- Cards de KPI animados: Resgates Totais, Economia de CO2 (Eco), Score de Saúde (Life) com indicadores de tendência
- Gráfico de barras empilhadas (Recharts) — resgates por categoria
- Gráfico de linhas — engajamento semanal
- Empty state premium para novos parceiros com ilustração e mensagem de boas-vindas

## Fase 4: Gestão de Cupons (`/cupons`)
- Lista visual de cupons em cards glassmorphism com status e métricas
- Gráfico de CTR por cupom
- Heatmap de horários de resgate (grade visual de dias × horas)
- Dados sempre anonimizados (sem nomes de usuários)

## Fase 5: Central de Solicitações (`/solicitacoes`)
- Sistema de tickets simulado com lista de solicitações e status (Pendente, Em Análise, Resolvido)
- Formulário "Request Change" para edição de cupons
- Timeline de atualizações por ticket

## Fase 6: Gestão de Equipe (`/equipe`) — Corporativo
- Tabela moderna com busca e filtros por Nível de Atividade (Sedentário, Ativo, Atleta)
- Modal de importação CSV com drag & drop que simula upload e preenche 5 nomes fictícios
- Paginação e contadores

## Fase 7: Desafios (`/desafios`) — Corporativo
- Dashboard de gamificação com rankings (top colaboradores)
- Cards de desafios ativos com barras de progresso (distância, calorias, tempo)
- Medalhas e badges visuais

## Fase 8: Relatórios ESG & Life (`/relatorios`) — Corporativo
- Carrossel "Antes e Depois" de pegada de carbono
- Gráfico de Radar (Recharts) — Score de Saúde Coletivo (Sono, Movimento, Nutrição)
- Selos visuais "Empresa Saudável"
- Botões de "Exportar PDF" (simulados)
- Placeholders LGPD: "Aguardando consentimento do colaborador"

## Fase 9: Polimento Final
- Responsividade mobile em todas as telas
- Micro-animações em hover de cards e botões
- Transições de página suaves
- Revisão geral de consistência visual
