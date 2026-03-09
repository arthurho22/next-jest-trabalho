# Trabalho Next.js com Jest e TDD

Aplicação base para o **TRABALHO 01 - Testes unitários com Jest + React Testing Library**.

Este projeto é uma aplicação Next.js que implementa autenticação e gerenciamento de tarefas, com foco em TDD (Test-Driven Development) e cobertura de testes completa.

---

## Ele inclui:

API routes (/api/login, /api/logout, /api/tasks)

Componentes React com testes unitários e de integração

Context API (AuthContext)

Serviços (auth.service, task.service)

Pipeline CI/CD no GitHub Actions

Cobertura mínima obrigatória: Statements ≥ 85%, Branches ≥ 80%, Functions ≥ 85%, Lines ≥ 85%

---

## Arquitetura

A aplicação segue uma estrutura pensada para **testabilidade** e **separação de responsabilidades**.

```
src/
├─ app/
│  ├─ api/
│  │  ├─ login/        # rota POST /api/login
│  │  ├─ logout/       # rota POST /api/logout
│  │  └─ tasks/        # rotas CRUD para tasks
│  ├─ dashboard/       # páginas do dashboard
│  └─ login/           # página de login
├─ components/
│  ├─ auth/            # LoginForm
│  ├─ dashboard/       # TaskList, TaskComposer, ServerTaskSummary, DashboardClient
│  └─ providers/       # AppProviders
├─ context/            # AuthProvider e useAuth
├─ services/
│  ├─ auth/            # authenticateUser, validateLoginPayload
│  └─ tasks/           # buildTaskService, validateTaskTitle
├─ utils/
│  ├─ app-error.ts     # tratamento de erros customizados
│  ├─ http-response.ts # helpers de resposta HTTP
│  └─ math.ts          # funções auxiliares
└─ __tests__/          # testes unitários e integração
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
      Arquivo: ** .github/workflows/ci.yml **

### Server Component
- **ServerTaskSummary:** busca resumo no servidor via `taskService.getSummary`
- Permite testar Server Components com mock do serviço

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


