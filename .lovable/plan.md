

# Nova Aba "Validação de Cupom"

## Objetivo

Adicionar uma nova aba no topo da sidebar (acima de "Dashboard") onde o parceiro pode digitar manualmente o código do cupom para validá-lo, caso o usuário não consiga usar a câmera/QR Code.

## Fluxo da Tela

```text
┌──────────────────────────────────────────────────────┐
│  Validação de Cupom                                  │
│  Digite o código do cupom para validar manualmente   │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │   [ ícone QR ]                                 │  │
│  │                                                │  │
│  │   Código do cupom                              │  │
│  │   ┌──────────────────────────────────┐         │  │
│  │   │  IRUN-XXXX-XXXX                  │         │  │
│  │   └──────────────────────────────────┘         │  │
│  │                                                │  │
│  │           [   Validar Cupom   ]                │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ──── Após validação ────                            │
│                                                      │
│  ✅ VERDE (cupom válido)                             │
│  ┌────────────────────────────────────────────────┐  │
│  │  ✓  Cupom validado                             │  │
│  │     10% Off Corrida — Transporte               │  │
│  │     Validade: 30/04/2026                       │  │
│  │     [ Validar outro cupom ]                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ❌ VERMELHO (inválido / expirado)                    │
│  ┌────────────────────────────────────────────────┐  │
│  │  ✕  Cupom inválido                             │  │
│  │     Este cupom está expirado ou fora do prazo. │  │
│  │     [ Tentar novamente ]                       │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Alterações Técnicas

### 1. Mock de códigos válidos (`src/data/mockData.ts`)
Adicionar lista `codigosValidacao` com códigos de exemplo vinculados aos cupons existentes:
- `IRUN-CORR-2025` → "10% Off Corrida" (válido)
- `IRUN-SMTH-1138` → "Smoothie Grátis" (válido)
- `IRUN-MASS-9921` → "Massagem 20min" (válido)
- `IRUN-CAFE-0001` → "Café Premium" (expirado → inválido)
- `IRUN-YOGA-3344` → "Aula de Yoga" (status pausado → inválido)

A função de validação retornará `{ valido: boolean, cupom?: {...}, motivo?: string }` cruzando o código com `cuponsData` (status `Ativo` + validade futura = válido; caso contrário inválido).

### 2. Nova página (`src/pages/ValidacaoCupom.tsx`)
- Estado: `codigo` (string), `resultado` ('idle' | 'valido' | 'invalido'), info do cupom
- Card central com `Input` (código) usando validação Zod (uppercase, max 32 chars, formato `IRUN-XXXX-XXXX`)
- Botão "Validar Cupom" — submit por Enter também funciona
- Após submit: card de resultado abaixo do form
  - **Verde** (`bg-green-500/10 border-green-500`): ícone `CheckCircle2`, "Cupom validado" + nome/categoria/validade
  - **Vermelho** (`bg-red-500/10 border-red-500`): ícone `XCircle`, "Cupom inválido" + motivo (expirado / não encontrado / pausado)
- Botão para limpar e validar outro cupom
- Animação `framer-motion` no aparecimento do resultado
- Layout responsivo (max-width centralizado, full-width em mobile)

### 3. Sidebar (`src/components/layout/AppSidebar.tsx`)
- Adicionar novo item **acima** de "Dashboard" no array `mainItems`:
  - `{ title: "Validação de Cupom", url: "/validacao", icon: ScanLine }`
- Ícone sugerido: `ScanLine` ou `QrCode` do lucide-react

### 4. Rota (`src/App.tsx`)
- Importar `ValidacaoCupom` e adicionar `<Route path="/validacao" element={<AppLayout><ValidacaoCupom /></AppLayout>} />`

## Detalhes de UX
- Input em **uppercase automático** para facilitar a digitação
- Mensagem de erro inline se o formato do código for inválido antes de submeter
- Estado `idle` por padrão; resultado só aparece após clicar em "Validar"
- Toast de sucesso/erro complementar usando `sonner`

