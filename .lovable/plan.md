# Busca e Filtro de Nível de Atividade na Aba Equipe

## Objetivo
Facilitar a localização de colaboradores na aba **Equipe** com uma busca por nome/email mais organizada e um filtro rápido por nível de engajamento (baseado em pontos, métrica de gamificação — não saúde individual).

## O que será alterado

### `src/pages/Equipe.tsx`

1. **Novo estado de filtro**
   - `filtroEngajamento`: `"todos" | "alto" | "medio" | "baixo"`

2. **Seção de busca + filtros reorganizada**
   - Input de busca por nome/email (existente, reposicionado)
   - Chips de filtro rápido ao lado ou abaixo do input:
     - **Todos** (default)
     - **Alto engajamento** (pontos > 700)
     - **Médio engajamento** (pontos 300–700)
     - **Baixo engajamento** (pontos < 300)
   - Chips estilo ToggleGroup ou buttons com Badge de contagem

3. **Lógica de filtro combinada**
   - `filtered` aplica **ambos** os filtros: busca textual (`nome` ou `email`) + faixa de pontos.
   - Ordenação secundária: maior pontuação primeiro.

4. **Contadores visuais**
   - Cada chip exibe a quantidade de colaboradores naquela faixa (ex: "Alto engajamento · 4").
   - Total de resultados visíveis atualizados dinamicamente.

5. **Ícones**
   - `Filter` do lucide-react para o input de busca (já existe `Search`)
   - `TrendingUp`, `Minus`, `TrendingDown` (ou similar) para os chips de nível

## Regras de Negócio / LGPD
- O filtro utiliza **pontos** (gamificação), nunca classifica saúde individual.
- Não exibe rótulos de saúde como "Sedentário" ou "Atleta" por pessoa.

## Layout (textual)
```text
┌────────────────────────────────────────────────────┐
│ Gestão de Equipe          [Buscar no app] [CSV]  │
│ 12 colaboradores                                   │
├────────────────────────────────────────────────────┤
│ ┌──────────────────┐  [Todos·12] [Alto·4]        │
│ │ 🔍 Buscar nome...│  [Médio·3] [Baixo·3]         │
│ └──────────────────┘                               │
├────────────────────────────────────────────────────┤
│ Tabela de colaboradores (filtered)                 │
│ Nome    Email    Dist    Cal    Tempo    Pontos  🗑️ │
└────────────────────────────────────────────────────┘
```

## Dependências
- Nenhuma nova — usa `Badge`, `Button`, `Input`, ícones do lucide-react já disponíveis.
