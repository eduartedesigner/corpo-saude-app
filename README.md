# 🏋️ App Corpo e Saúde

> Aplicativo exclusivo da rede **Academia Corpo e Saúde** — 35 unidades, 24.500 alunos.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | React Native + Expo SDK 54 |
| **Linguagem** | TypeScript (strict mode) |
| **Navegação** | Expo Router v6 (file-based) |
| **Backend** | Supabase (Auth + DB + Storage + Realtime) |
| **Estado** | Zustand |
| **Animações** | React Native Reanimated 4 |
| **Fontes** | Poppins (7 pesos: 300-900) |
| **IA** | Claude API (via Supabase Edge Functions) |
| **Pagamentos** | Asaas (futuro) |

## Estrutura do Projeto

```
corpo-saude-app/
├── app/                          # Expo Router — telas
│   ├── _layout.tsx               # Root layout (fontes, auth init)
│   ├── index.tsx                 # Entry — redirect baseado em auth
│   ├── (auth)/                   # Stack de autenticação
│   │   ├── welcome.tsx           # Tela de boas-vindas
│   │   ├── login.tsx             # Login via telefone (OTP)
│   │   └── verify-otp.tsx        # Verificação do código
│   ├── (onboarding)/             # Stack do onboarding MQV
│   │   ├── intro.tsx             # Introdução à avaliação
│   │   ├── mqv-step.tsx          # 7 etapas do questionário MQV
│   │   ├── mqv-result.tsx        # Resultado/perfil de saúde
│   │   └── subscription-wall.tsx # Paywall (R$15/mês ou R$150/ano)
│   └── (tabs)/                   # Tab navigation principal
│       ├── home.tsx              # Meu Plano — treino do dia
│       ├── workouts.tsx          # Biblioteca de exercícios
│       ├── progress.tsx          # Progresso e estatísticas
│       └── profile.tsx           # Perfil e configurações
├── src/
│   ├── components/
│   │   ├── ui/                   # Design System components
│   │   │   ├── Button.tsx        # Pill shape, animado
│   │   │   ├── Text.tsx          # Typography tokens
│   │   │   ├── Card.tsx          # Superfícies dark/red/outline
│   │   │   ├── Input.tsx         # Campos com focus state
│   │   │   ├── ProgressBar.tsx   # Barra de progresso MQV
│   │   │   ├── SelectCard.tsx    # Cards selecionáveis (onboarding)
│   │   │   └── ScaleSlider.tsx   # Escala 0-10 (dor/estresse)
│   │   └── layout/
│   │       └── ScreenContainer.tsx # SafeArea + StatusBar + scroll
│   ├── theme/                    # Design System tokens
│   │   ├── colors.ts             # Paleta brand + semantic
│   │   ├── typography.ts         # Poppins scale + presets
│   │   └── spacing.ts            # Spacing, radius, shadows
│   ├── types/
│   │   └── database.ts           # Types completos do Supabase
│   ├── stores/
│   │   ├── authStore.ts          # Auth + perfil (Zustand)
│   │   └── mqvStore.ts           # Estado do questionário MQV
│   ├── services/
│   │   └── supabase.ts           # Cliente Supabase configurado
│   └── constants/
│       └── config.ts             # Constantes do app
├── supabase/
│   ├── schema.sql                # Schema completo (12 tabelas + RLS)
│   └── seed.sql                  # 30 exercícios iniciais
├── app.json                      # Configuração Expo
├── tsconfig.json                 # TypeScript com paths
└── .env.example                  # Variáveis de ambiente
```

## Design System

| Token | Valor | Uso |
|-------|-------|-----|
| **Brand Red** | `#E20000` | CTAs, botões, ícones |
| **Dark Red** | `#530000` | Headings, hierarquia |
| **App Background** | `#0A0A0A` | Fundo principal (dark) |
| **Surface** | `#1A1A1A` | Cards e modais |
| **Botões** | Pill shape, uppercase | `border-radius: 9999px` |
| **Fonte** | Poppins 300-900 | Toda a tipografia |

## Questionário MQV (7 etapas)

1. **Validação** — Nome, telefone, LGPD
2. **Perfil e Biometria** — Gênero, idade, altura, peso, PNE
3. **Rotina e Trabalho** — Carga horária, tipo de trabalho
4. **Mapeamento de Dor** — Escala 0-10, frequência, localização, sensação
5. **Histórico de Saúde** — Cirurgias, medicamentos, diagnósticos
6. **Fisiologia e Hábitos** — Sono, hidratação, intestino, alimentação
7. **Estilo de Vida e Metas** — Atividade, tabagismo, álcool, emocional, objetivos

## Como Rodar

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais Supabase

# Iniciar dev server
npx expo start

# Rodar no Android
npx expo start --android

# Rodar no iOS
npx expo start --ios
```

## Supabase Setup

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute `supabase/schema.sql` no SQL Editor
3. Execute `supabase/seed.sql` para dados iniciais
4. Configure Phone Auth (Twilio) no Dashboard
5. Copie URL e Anon Key para o `.env`

## Modelo de Negócio

| Plano | Preço | Inclui |
|-------|-------|--------|
| **Gratuito** | R$ 0 | Avaliação MQV + perfil de saúde |
| **Mensal** | R$ 15/mês | Treinos IA + biblioteca + execução + progresso |
| **Anual** | R$ 150/ano | Tudo + 2 meses grátis |

## Roadmap

- [x] **Fase 1 — MVP** (Semanas 1-8): Auth, MQV, Treinos IA, Biblioteca, Timer, Assinaturas
- [ ] **Fase 2 — Inteligência** (Semanas 9-18): Painel instrutor, TVs, Churn, Analytics
- [ ] **Fase 3 — Escala** (Semanas 19-26): Offline, LGPD, Relatórios, Apple Health
- [ ] **Fase 4 — Crescimento** (Semana 27+): Biometria, Marketplace, API pública

---

Baseado no PRD v1.0 — Março 2026
