

# Atualização da Página "Gestão de Equipe" — LGPD + Métricas iRun

## O que muda

1. **Mock Data (`src/data/mockData.ts`)**: Substituir `passos` por `distanciaKm`, `calorias`, `tempoAtividadeMin` em `equipeData` e `csvSimulatedNames`. Adicionar export `distribuicaoSaude` com dados agregados para o PieChart (Sedentários 30%, Ativos 50%, Atletas 20%).

2. **Página Equipe (`src/pages/Equipe.tsx`)**:
   - **Remover**: coluna "Nível" da tabela, coluna "Passos/dia", filtro por nível, `nivelColors`
   - **Adicionar colunas**: "Distância (km)", "Calorias", "Tempo (min)"
   - **Novo card acima da tabela**: GlassCard com PieChart (Recharts) "Distribuição de Saúde Corporativa" mostrando dados anônimos agregados com cores da paleta iRun (dourado, azul marinho, complementar)
   - Manter busca por nome/email, importação CSV, pontos

## Detalhes técnicos

- PieChart usa `recharts` (já instalado) com `PieChart`, `Pie`, `Cell`, `Tooltip`, `Legend`
- Cores do pie: Atletas → `#daa520` (dourado), Ativos → `#0b2297` (azul marinho), Sedentários → `#64748b` (cinza-azulado)
- Filtro simplificado: apenas busca por texto (sem dropdown de nível)

