# Adicionar colaboradores via busca no app iRun

## Objetivo

Na aba **Equipe**, complementar o "Importar CSV" com uma nova opção **"Buscar usuário no app"**, que simula a integração via API com a base de usuários do aplicativo iRun. O parceiro digita nome ou email, vê resultados em tempo real e adiciona o colaborador à equipe da empresa com 1 clique.

## Fluxo do usuário

```text
Header da página Equipe
┌──────────────────────────────────────────────────────────┐
│ Gestão de Equipe                                         │
│ 10 colaboradores cadastrados                             │
│                          [ Buscar no app ] [Importar CSV]│
└──────────────────────────────────────────────────────────┘

Clique em "Buscar no app" → abre Dialog
┌──────────────────────────────────────────────────────────┐
│ Adicionar colaborador                                    │
│ Busque por nome ou email na base de usuários do iRun     │
│                                                          │
│ 🔍 [ ana                                          ]      │
│                                                          │
│ Resultados (3)                                           │
│ ┌──────────────────────────────────────────────────┐     │
│ │ 👤 Ana Beatriz Souza                             │     │
│ │    ana.beatriz@gmail.com · @anabia               │     │
│ │                                  [ + Adicionar ] │     │
│ ├──────────────────────────────────────────────────┤     │
│ │ 👤 Ana Carolina Lima        ✓ Já na equipe       │     │
│ │    ana.lima@empresa.com · @anacarol              │     │
│ ├──────────────────────────────────────────────────┤     │
│ │ 👤 Ana Paula Ferreira                            │     │
│ │    ana.p@outlook.com · @anapf                    │     │
│ │                                  [ + Adicionar ] │     │
│ └──────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

- Busca **debounced** (300ms), filtra por nome, email **ou** username (`@handle`).
- Se já é colaborador da empresa, mostra badge "Já na equipe" e desabilita botão.
- Ao clicar **+ Adicionar**: o usuário entra na lista, toast verde "X adicionado à equipe", e o item passa a mostrar "Já na equipe".
- Estado vazio: ilustração + texto "Digite ao menos 2 caracteres para buscar".
- Estado sem resultados: "Nenhum usuário encontrado para 'xyz'".

## Alterações técnicas

### 1. `src/data/mockData.ts`
Adicionar uma base simulada de usuários do app (≈15 entradas), separada da `equipeData`:
```ts
export const usuariosAppIrun = [
  { id: 101, nome: "Ana Beatriz Souza", email: "ana.beatriz@gmail.com", username: "anabia", distanciaKm: 7.2, calorias: 450, tempoAtividadeMin: 55, pontos: 680 },
  { id: 102, nome: "Ana Paula Ferreira", email: "ana.p@outlook.com", username: "anapf", ... },
  // ... mais usuários variados (Bruno, Carla, Daniel, Fernanda, etc.)
];
```
Cada usuário tem os mesmos campos de métrica que `equipeData` para se integrar à tabela após adicionado.

### 2. `src/pages/Equipe.tsx`
- Novo botão **"Buscar no app"** ao lado de "Importar CSV" (variant `outline`, ícone `UserPlus` ou `Search`).
- Novo `Dialog` controlado com:
  - `Input` de busca com ícone, autofocus.
  - `useMemo` que filtra `usuariosAppIrun` por `nome | email | username` (case-insensitive) quando query ≥ 2 chars.
  - Lista rolável (`max-h-[60vh] overflow-y-auto`) de cards de resultado.
  - Cada card: avatar circular com inicial, nome, email · @username, botão **+ Adicionar** ou badge "Já na equipe" (compara por `email` ou `id` contra `membros`).
- `handleAdicionarUsuario(usuario)`: faz `setMembros(prev => [...prev, { ...usuario, id: prev.length + 1 }])` + `toast.success("X adicionado à equipe")`.
- Layout responsivo: no mobile os botões empilham (já está em `flex-col sm:flex-row`).

### 3. Imports
- Adicionar `UserPlus`, `Check` do `lucide-react`.
- Importar `toast` de `sonner`.

## Detalhes de UX
- Busca instantânea (sem botão "buscar"), debounce leve só para evitar flicker.
- Botão "+ Adicionar" usa `gold-gradient` discreto; após adicionar, vira badge verde "✓ Já na equipe".
- Dialog fecha automaticamente? **Não** — fica aberto para adicionar vários usuários em sequência. Botão "Concluir" no rodapé fecha.
- Mantém o botão **Importar CSV** existente intacto (os dois fluxos coexistem).
- Mock data deixa claro no copy: *"Busca na base de usuários do app iRun (simulação — em produção será via API)"*.

## Fora do escopo
- Integração real com API do iRun (apenas mock).
- Convite por email para usuários ainda não cadastrados no app.
- Remoção de colaboradores (não foi pedido).