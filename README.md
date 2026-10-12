# FinanFlow - Gestor de Orçamento Pessoal

Aplicação moderna e completa de **Orçamento Pessoal e Finanças** desenvolvida com **Next.js (App Router)**, **Supabase (PostgreSQL, Auth e RLS)**, **TypeScript**, **Tailwind CSS**, **Recharts** e **Lucide React**.

---

## 🚀 Funcionalidades

- **Dashboard Financeiro Completo:**
  - Métricas rápidas: Saldo Geral, Receitas do Mês, Despesas do Mês e Taxa de Poupança (%).
  - Gráfico de evolução mensal das finanças (Receitas vs. Despesas) dos últimos 6 meses.
  - Gráfico de distribuição de despesas por categoria.
  - Listagem das 5 transações mais recentes com badges dinâmicos.
  - Widget com acompanhamento de limites e barras de progresso.
- **Gestão de Transações:**
  - Registro de receitas, despesas e transferências.
  - Busca textual em tempo real e filtros combinados (tipo, categoria, conta).
  - Modal de cadastro e edição rápida.
- **Orçamentos & Metas Mensais:**
  - Definição de limites máximos de gastos por categoria.
  - Indicadores de alerta visual ao atingir 80% e aviso de limite estourado.
- **Contas & Carteiras:**
  - Suporte a múltiplas contas (Conta Corrente, Poupança, Carteira Física, Investimentos).
  - Cálculo automático e determinístico de saldo real.
- **Segurança Máxima com Supabase RLS:**
  - Isolamento estrito de dados por usuário via Row Level Security no PostgreSQL.
  - Autenticação por e-mail e senha com `@supabase/ssr` e cookies seguros.
  - Trigger automático que cria o perfil, uma conta padrão e categorias padrão (Alimentação, Moradia, Transporte, etc.) no primeiro login do usuário.

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js (App Router, Server Actions, React Server Components)
- **Linguagem:** TypeScript (Tipagem estrita)
- **Estilização:** Tailwind CSS (Tema refinado para fintech, responsivo)
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL, Supabase Auth, RLS)
- **Gráficos & Visualização:** Recharts
- **Ícones:** Lucide React
- **Validação de Formulários:** Zod

---

## ⚙️ Configuração Passo a Passo

### 1. Clonar e Instalar Dependências
```bash
npm install
```

### 2. Configurar o Banco no Supabase
1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Acesse o **SQL Editor** no menu lateral do Supabase.
3. Abra o arquivo `supabase/schema.sql` deste projeto, copie todo o seu conteúdo e execute-o no SQL Editor do Supabase.
   *(Isso criará automaticamente as tabelas, índices de busca, políticas de segurança RLS e a trigger que popula categorias padrão para novos usuários).*

### 3. Configurar as Variáveis de Ambiente
Renomeie ou crie o arquivo `.env.local` a partir do `.env.example`:
```bash
cp .env.example .env.local
```

Preencha com as credenciais do seu projeto Supabase (encontradas em **Project Settings > API**):
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 4. Executar em Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📁 Estrutura do Projeto

```text
orcamento-pessoal/
├── supabase/
│   └── schema.sql                # DDL do PostgreSQL + RLS + Triggers de boas-vindas
├── src/
│   ├── actions/                  # Server Actions com validação Zod e revalidatePath
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   ├── accounts.ts
│   │   ├── budgets.ts
│   │   ├── categories.ts
│   │   └── dashboard.ts
│   ├── app/
│   │   ├── (auth)/               # Login e Cadastro com tratamento de erros
│   │   ├── (dashboard)/          # Dashboard, Transações, Orçamentos e Contas
│   │   ├── api/auth/callback/    # Handler de confirmação de e-mail / OAuth
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing Page pública com redirecionamento de sessão
│   ├── components/
│   │   ├── ui/                   # Button, Card, Input, Modal, Badge
│   │   ├── layout/               # Sidebar e Header com dados do usuário
│   │   ├── dashboard/            # Widgets de métricas e gráficos Recharts
│   │   ├── transactions/         # Tabela dinâmica, filtros e modal
│   │   ├── budgets/              # Cards de orçamento e modal de teto
│   │   └── accounts/             # Cards de contas e modal de criação
│   ├── lib/
│   │   ├── supabase/             # Clientes SSR para navegador, servidor e middleware
│   │   ├── validations/          # Schemas Zod de validação
│   │   └── utils/                # Formatadores de moeda (BRL), data e percentual
│   └── middleware.ts             # Proteção de rotas privadas e refresh de sessão
```

---

## 🔒 Segurança e Privacidade

- **Isolamento Total:** Nenhuma consulta direta ao banco pode ler dados de outro usuário. As regras de RLS garantem que mesmo requisições manuais só acessem registros onde `user_id = auth.uid()`.
- **Integridade Contábil:** Saldo calculado com base em transações efetivadas, evitando dessincronização de valores voláteis.
