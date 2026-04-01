

# Substituir Dots por Tabs Nomeadas no "Antes e Depois"

## Problema
As 3 bolinhas (dots) não comunicam o que cada slide contém, dificultando a navegação.

## Solução
Substituir os dots por **3 botões/tabs** com ícone + nome curto da métrica, posicionados acima do conteúdo do card (abaixo do título). O botão ativo terá destaque visual (fundo accent, texto bold).

```text
┌──────────────────────────────────────────────────┐
│  Antes e Depois                                  │
│                                                  │
│  [🌿 CO₂]  [🚗 Deslocamento]  [🏃 Sedentarismo]  │
│   ativo ▲                                        │
│                                                  │
│  ┌── ANTES ──┐  ┌── DEPOIS ──┐                   │
│  │  12.5 ton │  │  9.3 ton   │                   │
│  │  ████████ │  │  ██████    │                   │
│  └───────────┘  └────────────┘                   │
│         ▼ Redução de 25%                         │
└──────────────────────────────────────────────────┘
```

## Alterações — `src/pages/Relatorios.tsx`

1. **Remover os dots** (o bloco `flex justify-center gap-2 mt-4` com os 3 `<button>` circulares)

2. **Adicionar tabs** logo após o título do card — uma row de 3 botões com:
   - Ícone da métrica (Leaf/Car/Activity, `w-3.5 h-3.5`)
   - Label curto: "CO₂", "Deslocamento", "Sedentarismo"
   - Estilo ativo: `bg-primary text-primary-foreground shadow-sm`
   - Estilo inativo: `bg-muted/50 text-muted-foreground hover:bg-muted`
   - Classes comuns: `px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all`

3. Cada botão chama `setCarouselIdx(i)` como antes

