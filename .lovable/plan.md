

# Redesign do Card "Antes e Depois" — Relatórios

## Resumo
Transformar o card atual (que mostra apenas dois números com uma seta) em um card visualmente rico e premium, com barras de progresso comparativas, badges coloridos, cálculo de redução percentual e layout mais sofisticado.

## Design Proposto

```text
┌──────────────────────────────────────────────┐
│  Antes e Depois — Emissão CO₂ (ton/mês)     │
│                                              │
│  ┌─────────────────────┐  ┌────────────────┐ │
│  │  ANTES              │  │  DEPOIS        │ │
│  │  bg vermelho sutil  │  │  bg verde sutil│ │
│  │                     │  │                │ │
│  │   12.5 ton/mês      │  │  9.3 ton/mês   │ │
│  │  ████████████████   │  │  ██████████     │ │
│  │  (barra vermelha)   │  │  (barra verde) │ │
│  └─────────────────────┘  └────────────────┘ │
│                                              │
│        ▼ Redução de 25.6%  ↓ badge dourado   │
│                                              │
│  ● ● ●  (dots do carousel)                  │
└──────────────────────────────────────────────┘
```

## Alterações — `src/pages/Relatorios.tsx` (único arquivo)

1. **Dois sub-cards lado a lado** com fundos sutis: vermelho/rosa para "Antes" (`bg-destructive/5 border border-destructive/15 rounded-2xl p-4`) e verde para "Depois" (`bg-emerald-50 border border-emerald-200/50 rounded-2xl p-4`)

2. **Barras de progresso visuais** abaixo de cada valor — barra proporcional ao valor máximo (o "antes"), com cores correspondentes (vermelho e verde)

3. **Badge de redução percentual** centralizado entre os dois blocos, calculado dinamicamente: `Math.round(((antes - depois) / antes) * 100)` — com ícone `TrendingDown` e fundo dourado sutil

4. **Ícones contextuais** por métrica (CO₂ → Leaf, Deslocamento → Car, Sedentarismo → Activity) adicionados ao título de cada slide do carousel

5. **Labels "Antes" e "Depois"** como badges pequenos (`text-xs font-semibold uppercase tracking-wider`) em vez de texto simples

6. Importar `TrendingDown`, `Leaf`, `Car`, `Activity` do lucide-react

