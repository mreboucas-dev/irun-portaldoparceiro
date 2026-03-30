

# Gradientes nos Gráficos + Visual Linear.app Minimalista

## Resumo
Aplicar gradientes lineares (azul-dourado) nas barras e linhas dos gráficos Recharts, remover grades cinzas (CartesianGrid, PolarGrid), e limpar eixos para um visual minimalista estilo Linear.app.

## Alterações

### 1. `src/pages/Dashboard.tsx`
- Adicionar SVG `<defs>` com `<linearGradient>` para cada barra (azul→dourado) e para as linhas
- Remover `<CartesianGrid>` de ambos os gráficos
- Barras: `fill="url(#gradAlimentacao)"` etc. com gradientes azul (#1a3a8f) → dourado (#daa520)
- Linhas: `stroke="url(#gradAtivos)"` com gradientes vibrantes, adicionar `strokeLinecap="round"`
- Eixos XAxis/YAxis: `axisLine={false}` e `tickLine={false}` para visual limpo, cor `rgba(255,255,255,0.4)`

### 2. `src/pages/Cupons.tsx`
- Remover `<CartesianGrid>` do BarChart horizontal
- Adicionar `<defs>` com gradiente dourado para a barra CTR
- Eixos: `axisLine={false}`, `tickLine={false}`

### 3. `src/pages/Equipe.tsx`
- PieChart: aplicar gradientes nas células via `<defs>` (azul→dourado para cada fatia)

### 4. `src/pages/Relatorios.tsx`
- RadarChart: remover `<PolarGrid>` ou trocar por `stroke="rgba(255,255,255,0.08)"` ultra sutil
- Radar fill: usar gradiente azul com opacidade

### 5. `src/components/ui/table.tsx` (se necessário)
- Remover/atenuar bordas de linhas da tabela para visual mais limpo

### Detalhes técnicos
- Gradientes definidos inline via SVG `<defs>` dentro de cada chart
- Cores da marca: Azul `#1a3a8f` / `#0b2297`, Dourado `#daa520` / `#c4952a`
- 4-5 arquivos editados, zero dependências

