

# Redesign da Aba Solicitações — Modelo de Contratos

## Contexto

A aba atual funciona como um sistema de tickets abertos, onde o parceiro pode solicitar alterações pontuais em cupons a qualquer momento. A nova proposta substitui isso por um modelo de **contratos com período determinado**, onde o parceiro define antecipadamente quais cupons serão oferecidos e por quanto tempo, solicitando renovação com antecedência.

## Novo Conceito

A página "Solicitações" passa a se chamar **"Contratos"** (ou "Gestão de Contratos") e terá duas áreas principais:

```text
┌──────────────────────────────────────────────────────┐
│  Gestão de Contratos                                 │
│  Acompanhe seus contratos de cupons vigentes         │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  CONTRATO VIGENTE                   #CTR-001   │  │
│  │  Período: 01/03/2026 — 30/06/2026             │  │
│  │  ████████████████████░░░░░  68% concluído     │  │
│  │                                                │  │
│  │  Cupons incluídos:                            │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐       │  │
│  │  │10% Corrida│ │Smoothie │ │Massagem  │       │  │
│  │  │Transporte │ │Alimentaç│ │Saúde     │       │  │
│  │  │245 resg.  │ │189 resg.│ │98 resg.  │       │  │
│  │  └──────────┘ └──────────┘ └──────────┘       │  │
│  │                                                │  │
│  │  Dias restantes: 83     Próx. renovação: 15/06│  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [📋 Solicitar Novo Contrato]                        │
│                                                      │
│  HISTÓRICO DE CONTRATOS                              │
│  ┌─────────┬─────────────┬──────────┬───────────┐   │
│  │ #CTR-000│ Nov-Fev 2026│ 4 cupons │ Encerrado │   │
│  └─────────┴─────────────┴──────────┴───────────┘   │
│                                                      │
│  SOLICITAÇÃO PENDENTE (se houver)                    │
│  ┌────────────────────────────────────────────────┐  │
│  │  #CTR-002 (Novo Contrato)    Em Análise       │  │
│  │  Período solicitado: 01/07 — 30/09/2026       │  │
│  │  Timeline: Enviado em 25/03 → Em análise...   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Alteracoes Tecnicas

### 1. Mock Data (`src/data/mockData.ts`)
- Remover `solicitacoesData` (tickets avulsos)
- Adicionar `contratosData` com:
  - Contrato vigente: id, periodo (inicio/fim), status ("Vigente"), lista de cupons vinculados (nome, categoria, resgates), timeline de updates
  - Contrato encerrado: mesmo formato, status "Encerrado"
  - Solicitacao de novo contrato: status "Em Analise" ou "Pendente", periodo solicitado, cupons propostos, timeline

### 2. Pagina (`src/pages/Solicitacoes.tsx` — renomear para `Contratos.tsx`)
- **Card do contrato vigente** no topo: periodo com barra de progresso temporal, lista de cupons incluidos como mini-cards, dias restantes e data sugerida para renovacao
- **Botao "Solicitar Novo Contrato"**: abre Dialog com campos para periodo desejado (date pickers) e lista de cupons desejados (checkboxes ou inputs). Botao fica desabilitado se ja existir solicitacao pendente
- **Card de solicitacao pendente** (condicional): mostra o novo contrato em analise com timeline igual a atual
- **Historico de contratos**: lista simples com contratos anteriores encerrados

### 3. Sidebar (`src/components/layout/AppSidebar.tsx`)
- Alterar label de "Solicitacoes" para "Contratos"
- Trocar icone de `MessageSquare` para `FileText` ou `ScrollText`

### 4. Rota (`src/App.tsx`)
- Atualizar path `/solicitacoes` para `/contratos` (ou manter path e so trocar componente)

## Beneficios do Design
- O parceiro ve claramente o contrato vigente e quanto tempo falta
- So pode solicitar um novo contrato, nao alteracoes avulsas
- A timeline mostra o andamento da analise sem gerar expectativa de mudancas imediatas
- Historico da transparencia sobre contratos anteriores

