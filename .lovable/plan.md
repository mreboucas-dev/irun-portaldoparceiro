

# Correção de Gráficos no Mobile — Overflow

## Problema
Os gráficos transbordam dos cards no mobile (390px). A causa raiz é dupla:
1. `ChartContainer` aplica `aspect-video` (16:9) que força largura mínima maior que o viewport
2. `GlassCard` tem `p-6` fixo, reduzindo o espaço disponível para os gráficos

## Correções

### 1. `src/components/GlassCard.tsx`
- Reduzir padding no mobile: `p-4 sm:p-6`
- Adicionar `overflow-hidden` para conter qualquer overflow filho

### 2. `src/components/ui/chart.tsx` (ChartContainer)
- Remover `aspect-video` padrão, substituir por `aspect-auto` — as páginas já definem alturas explícitas (`h-[220px]`)
- Adicionar `w-full overflow-hidden` ao container

### 3. `src/pages/Dashboard.tsx`
- Envolver cada chart em `div` com `overflow-hidden w-full`
- Reduzir `YAxis width` para `30` e `fontSize` para `10` no mobile

### 4. `src/pages/Cupons.tsx`
- Mesmo tratamento no gráfico CTR (BarChart vertical)
- Reduzir `YAxis width` de `70` para `55` para nomes mais curtos

### 5. `src/pages/Equipe.tsx`
- PieChart: reduzir `outerRadius` para `60` e `innerRadius` para `30` no mobile
- Adicionar `overflow-hidden` ao container do pie

### 6. `src/pages/Relatorios.tsx`
- RadarChart: adicionar `overflow-hidden` ao container
- Reduzir `outerRadius` de `70%` para `65%`

### Resumo técnico
- 6 arquivos editados
- Zero dependências novas
- Foco em `overflow-hidden`, remoção de `aspect-video`, e padding responsivo

