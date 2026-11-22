# HANDOFF — Nateliê Hair / Salon App

> Documento de continuidade para outro assistente. Leia antes de alterar código.

## 1. Objetivo do projeto

Finalizar o site de agendamento do salão **Nateliê Hair** e o painel administrativo:

- Agendamento de serviços.
- Integração com backend/SQLite através da API.
- WhatsApp para confirmações, lembretes e cancelamento com `cancelar CODIGO`.
- Taxa de sinal de **R$ 50,00** para agendamentos de dezembro, abatida do total.
- Tema natalino com neve e efeito do Papai Noel sincronizado com scroll.
- Painel admin profissional, inspirado no Stripe: sidebar escuro, índigo, botões pill, tabelas e valores com números tabulares.
- Layout responsivo e sem sidebars duplicados.

O usuário quer evolução visual e funcional real, não somente troca de cores. Evitar afirmar que algo está pronto sem testar.

## 2. Projeto e execução

- Diretório: `C:\Users\guiil\salon-app`
- Frontend: React + TypeScript + Vite + Tailwind CSS v4.
- Estado: Zustand.
- Rotas: React Router.
- Ícones: `lucide-react`.
- Animações: `framer-motion`.
- Datas: `date-fns`.
- Build:

```powershell
cd C:\Users\guiil\salon-app
npm run build
```

O último build executado antes deste handoff passou. Existe apenas o aviso normal do Vite sobre bundle maior que 500 kB.

## 3. Links e ambiente

- Produção/Vercel: <https://salon-frontend-opal.vercel.app>
- Painel admin: <https://salon-frontend-opal.vercel.app/admin>
- Ngrok usado para a API: <https://cocoa-oblivion-throng.ngrok-free.dev>
- Backend esperado: `localhost:3001`
- Variável Vercel: `VITE_API_URL=https://cocoa-oblivion-throng.ngrok-free.dev`

A URL do ngrok pode expirar ou mudar. Se o financeiro não carregar, primeiro verifique o backend e o túnel antes de alterar o frontend.

**Importante:** não há autenticação implementada nas rotas atuais. `/admin` é acessível diretamente. As credenciais mencionadas anteriormente pelo assistente não foram confirmadas e não devem ser tratadas como reais.

## 4. Estado Git no momento do handoff

Último commit existente:

```text
e2e38b6 feat: apply Stripe design system tokens (dark sidebar, indigo primary, pill buttons, tabular nums, surface refinement)
```

Há alterações locais ainda não commitadas:

```text
M  src/App.tsx
M  src/components/layout/AdminLayout.tsx
M  src/index.css
M  src/pages/admin/AdminDashboard.tsx
M  src/pages/admin/AdminFinancial.tsx
M  src/pages/admin/AdminSettings.tsx
?? src/pages/ProfileSettings.tsx
```

Não faça reset, checkout ou limpeza automática dessas alterações sem confirmar. Elas são trabalho recente do usuário/agentes.

## 5. Alterações recentes

### `src/components/layout/AdminLayout.tsx`

- Sidebar administrativo unificado.
- Topbar com busca, notificações e perfil.
- Navegação para painel, agenda, financeiro, clientes, serviços e ajustes.
- Sidebar mobile com overlay.
- Botão de saída volta para `/`.

### `src/pages/admin/AdminDashboard.tsx`

- Removido padding/layout duplicado que deixava o painel espremido dentro do `AdminLayout`.
- Dashboard com KPIs, tabela de agendamentos e ações rápidas.
- Ações rápidas navegam para as páginas correspondentes.

### `src/pages/admin/AdminFinancial.tsx`

- Busca dados em `/api/admin/financials`.
- Adição de transação via `POST /api/admin/financials`.
- Validação de formulário com erro inline, sem `alert()`.
- Botão Exportar gera CSV do mês filtrado.
- Ainda depende de backend/ngrok ativo.

### `src/pages/admin/AdminSettings.tsx`

- Página refeita com abas: Geral, Aparência, Notificações e Segurança.
- Formulários de informações e horário de funcionamento funcionam apenas no estado local.
- Botão de salvar mostra feedback visual, mas não persiste em API/localStorage.
- Ações de segurança mostram feedback visual de placeholder; não alteram senha nem encerram sessões de verdade.
- Não adicionar backend fictício para essas ações sem requisito/API definido.

### `src/pages/ProfileSettings.tsx`

- Nova página pública `/perfil` adicionada recentemente.
- Contém nome, e-mail, senha, confirmação, foto e botão salvar.
- O arquivo apresenta caracteres portugueses corrompidos (`Configura����es`, etc.); corrigir a codificação UTF-8 antes de publicar.
- Ainda não existe persistência real de perfil.

### `src/App.tsx`

Rotas públicas atuais:

- `/`
- `/agendar`
- `/servicos`
- `/perfil`

Rotas administrativas:

- `/admin`
- `/admin/agenda`
- `/admin/financeiro`
- `/admin/clientes`
- `/admin/servicos`
- `/admin/ajustes`

### `src/index.css`

- Tokens de design Stripe existentes.
- Adicionado `--color-stripe-ruby: #ea2261`.

## 6. Arquivos importantes

- `src/App.tsx` — rotas.
- `src/components/layout/AdminLayout.tsx` — layout do admin.
- `src/components/layout/MainLayout.tsx` — layout público.
- `src/pages/admin/AdminDashboard.tsx` — painel.
- `src/pages/admin/AdminAgenda.tsx` — agenda.
- `src/pages/admin/AdminFinancial.tsx` — financeiro/API/CSV.
- `src/pages/admin/AdminClients.tsx` — clientes.
- `src/pages/admin/AdminServices.tsx` — serviços.
- `src/pages/admin/AdminSettings.tsx` — ajustes.
- `src/pages/ProfileSettings.tsx` — perfil recém-criado.
- `src/store/salonStore.ts` — Zustand, dados e base da API.
- `src/data/mockData.ts` — dados mock.
- `src/types/index.ts` — tipos e status.
- `src/components/ui/` — Button, Input, Card, Tabs, Modal etc.
- `vercel.json` — rewrite da SPA.
- `design/stripe.md` — referência visual Stripe.
- `design/linear.md` e `design/vercel.md` — referências adicionais.

## 7. API e backend

O frontend monta a base usando:

```ts
import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

`src/store/salonStore.ts` adiciona `/api` quando necessário e envia o header:

```text
ngrok-skip-browser-warning
```

O financeiro usa diretamente:

```text
GET  /api/admin/financials
POST /api/admin/financials
```

O backend `server.js` não está presente no diretório atual do frontend. Ele pode estar em outro diretório/processo. Não inventar rotas; confirmar no backend real.

## 8. Pendências prioritárias

1. Corrigir UTF-8 de `src/pages/ProfileSettings.tsx`.
2. Rodar `npm run build` depois de qualquer correção.
3. Testar manualmente todas as rotas admin em desktop e mobile.
4. Confirmar se o `POST /api/admin/financials` realmente salva no SQLite e se a resposta retorna o ID/registro persistido; hoje o frontend adiciona o objeto localmente após `res.ok`.
5. Verificar se o ngrok continua ativo e se a Vercel está usando a variável correta.
6. Decidir se `/perfil` é perfil do cliente, perfil do administrador ou ambos; atualmente está em layout público.
7. Definir API real para persistir configurações, perfil, senha e sessões antes de dizer que essas funções estão prontas.
8. Melhorar o design estrutural conforme a referência do usuário, não apenas trocar cores.
9. Criar autenticação/admin guard se o painel for exposto publicamente.
10. Commitar somente depois de revisar o diff e testar.

## 9. Comandos úteis

```powershell
# Ver estado e alterações
git status --short
git diff --stat
git diff --check

# Build
npm run build

# Desenvolvimento
npm run dev

# Verificar alertas/placeholders
# Usar a busca do editor ou rg/Select-String em src
```

O shell desta máquina é PowerShell; não usar sintaxe Bash como `||`, `&&`, `head` ou `grep` sem executar através de uma ferramenta compatível.

## 10. GSD instalado

O pacote `get-shit-done-cc@1.42.3` foi instalado globalmente para OpenCode com:

```powershell
npx get-shit-done-cc@latest --opencode --yes
```

Foram instalados comandos e agentes em `~/.config/opencode`.

Aviso do instalador: o `gsd-sdk` não está no PATH. Os fluxos que chamarem `gsd-sdk query` podem falhar. Para instalar o shim persistente:

```powershell
npm install -g get-shit-done-cc
```

Comandos GSD relevantes:

```text
/gsd-map-codebase
/gsd-new-project
/gsd-discuss-phase 1
/gsd-plan-phase 1
/gsd-execute-phase 1
/gsd-verify-work 1
```

Para um projeto existente, começar por `/gsd-map-codebase` antes de `/gsd-new-project`.

## 11. Instrução pronta para o próximo assistente

Cole este texto junto com o arquivo:

> Leia `HANDOFF.md` na raiz de `C:\Users\guiil\salon-app`. Continue o projeto sem apagar alterações locais. Primeiro rode `git status --short`, leia os arquivos listados na seção de pendências e execute `npm run build`. Corrija primeiro a codificação de `src/pages/ProfileSettings.tsx`, depois faça uma revisão objetiva das rotas admin, do financeiro e da integração com a API. Não declare funções como prontas se forem apenas estado local ou placeholder. Preserve o design Stripe, mas priorize UX/layout real em vez de somente trocar cores.

## 12. Regra de trabalho

- Alterações pequenas e verificáveis.
- Não adicionar dependências sem necessidade.
- Não sobrescrever arquivos inteiros para uma mudança pequena.
- Não fazer reset de alterações locais.
- Validar input em fronteiras de confiança.
- Não expor credenciais ou segredos no frontend.
- Rodar build após mudanças relevantes.
