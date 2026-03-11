# Trabalho Next.js com Jest e TDD

Aplicação base para o **TRABALHO 01 - Testes unitários com Jest + React Testing Library**. A intenção é fornecer uma base funcional de login e gerenciamento de tarefas, acompanhada por uma suíte de testes completa que segue o fluxo de TDD e atende aos thresholds de cobertura exigidos.

## Visão geral

O repositório contém:

- API routes (`/api/login`, `/api/logout`, `/api/tasks` e `tasks/[taskId]`).
- Componentes React testados com RTL.
- Context API para gerenciamento de autenticação (`AuthContext`).
- Serviços separados (`auth.service`, `task.service`, `session.service`) com dependência injetável para facilitar mocks.
- Utilitários de apoio (`AppError`, respostas HTTP, conversões de dados).
- Mais de 90 testes cobrindo funções, serviços, componentes, rotas e lógica de sessão.
- Pipeline de CI/CD (orientação no guia) e configuração de thresholds de cobertura no Jest.

Cobertura global atual (após exclusão de arquivos apenas de tipos):

```
Statements 89.50% | Branches 80.92% | Functions 93.50% | Lines 89.50%
```

Os thresholds configurados são 85/80/85/85; os arquivos de tipos (`*.types.ts`) e `teste/setupTests.ts` são ignorados na cobertura.

---

## Estrutura do projeto

A organização da pasta `src` facilita testes isolados e mantenibilidade:

```
src/
  app/               # páginas e rotas (app router)
    api/
      login/route.ts
      logout/route.ts
      tasks/route.ts
      tasks/[taskId]/route.ts
    dashboard/page.tsx
    login/page.tsx
    layout.tsx
    page.tsx
  components/        # componentes reutilizáveis
    auth/LoginForm.tsx
    dashboard/
      DashboardClient.tsx
      ServerTaskSummary.tsx
      TaskComposer.tsx
      TaskList.tsx
    providers/AppProviders.tsx
  context/            # AuthProvider e useAuth
  services/           # lógica de negócio
    auth/
      auth.service.ts
      auth.constants.ts
      auth.types.ts
      session.service.ts
      session.edge.ts
    tasks/
      task.service.ts
      task.repository.ts
      task.types.ts
  utils/              # utilitários e erros
    app-error.ts
    http-response.ts
    math.ts

__tests__/            # testes unitários e de integração
```
### Tecnologias Utilizadas

| Camada | Responsabilidade | Testabilidade |
|--------|------------------|---------------|
| **Next.js 13+** 
| **TypeScript** 
| **React 18**
| **Jest + React Testing Library** 
| **MSW (Mock Service Worker) para testes avançados de API** 
| **GitHub Actions para CI/CD** 

---

## Estratégia de Testes

### Autenticação
- **Testes escritos primeiro (TDD) antes da implementação da lógica** 
- **Testes unitários** funções, serviços, utilitários
- **Testes de integração:** componentes com Context API
- **Mocking avançado:** jest.mock, jest.spyOn, mocks condicionais e fake timers
- **Testes de rotas:** POST /api/login com todos os cenários (200, 400, 401)
- **Cobertura mínima exigida pelo Jest:**

   Statements ≥ 85%

    Branches ≥ 80%

    Functions ≥ 85%

    Lines ≥ 85%

- **Como rodar os testes:** 
  npm install
  npm run test
  npm run test:coverage
  
### Configuração de CI/CD
Pipeline GitHub Actions configurado para:
- **Firestore REST API:** tarefas em `users/{userId}/tasks`
- **Variáveis:** `FIREBASE_PROJECT_ID`, `FIREBASE_WEB_API_KEY`

### Serviço de tarefas
   1.  Instalar dependências (npm ci)
   2.  Rodar todos os testes com cobertura (npm run test:coverage)
   3.  Falhar o build se a cobertura global não atingir os thresholds
      Arquivo: **.github/workflows/ci.yml**

### Server Component
 **ServerTaskSummary:** busca resumo no servidor via `taskService.getSummary`.
 Permite testar Server Components com mock do serviço

---

## Decisões Técnicas

1. Uso de Context API para gerenciamento de autenticação
2. Separação de serviços e repositórios, facilitando mocks nos testes
3. Trimming e sanitização de inputs de usuário (sanitizeUserId)
4. Custom AppError para padronizar erros da aplicação
   
---

## Como Executar

1. npm install
2. npm run dev 
3. npm run test 
4. npm run test:coverage


### Aplicação
```bash
npm run dev
```
---

## Variáveis de ambiente

Consulte `.env.example`. Principais:

| Variável | Uso |
|----------|-----|
| `AUTH_SESSION_SECRET` | Assinatura do token de sessão |
| `AUTH_DEMO_EMAIL` / `AUTH_DEMO_PASSWORD` | Credenciais de demonstração |
| `FIREBASE_PROJECT_ID` / `FIREBASE_WEB_API_KEY` | Firestore |


