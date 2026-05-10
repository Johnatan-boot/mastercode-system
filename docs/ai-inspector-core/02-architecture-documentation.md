# 🏗️ AI Software Inspector Core — Architecture Documentation

## 1. Arquitetura em Camadas (Hexagonal / Clean Architecture)
A arquitetura do Inspector segue o padrão Clean Architecture, garantindo isolamento total do núcleo de negócios (Domain) das tecnologias externas.

- **Domain Layer (Núcleo):** Contém as entidades principais de análise (`Inspection`, `HealthScore`, `Issue`, `Project`) e interfaces (contratos) dos repositórios. Não depende de nenhum framework.
- **Application Layer (Use Cases):** Orquestra o fluxo de negócio (ex: `RunInspectionUseCase`, `GenerateReportUseCase`). Depende apenas do Domain Layer.
- **Infrastructure Layer:** Ponto de contato com o mundo externo. Implementa integrações de AI (OpenAI/Gemini APIs), acesso a banco de dados (PostgreSQL via Prisma ou TypeORM), e integrações com Git/Webhooks.
- **API (Presentation) Layer:** Controladores Express/NestJS, rotas HTTP e integração com Websockets (para atualizações em tempo real no dashboard do MasterCode). Responsável apenas por receber requests, validar DTOs e despachar para os Use Cases.

## 2. Diagrama Textual (Modelo C4 Simplificado)

### 2.1. Nível C1: Contexto de Sistema
```text
+----------------+      [ Inspeciona Código ]      +-------------------+
|  MasterCode UI | --------------------------> | AI Inspector Core |
|  & J-NEW Bot   | <-------------------------- | (SaaS Engine)     |
+----------------+      [ Retorna Health Score ]   +-------------------+
                                                          |
                                                          | Envia prompt/ast 
                                                          v
                                                  +----------------+
                                                  | LLM Provider   |
                                                  | (Gemini/OpenAI)|
                                                  +----------------+
```

### 2.2. Nível C2: Containers
```text
[ AI Inspector Core ]
  |
  +-- [ API Server ] (Node.js/Express) - Recebe requisições REST/WS
  |     |-- [ Auth Middleware ] - Valida JWT da MasterCode
  |     +-- [ Inspection Controller ] - Roteia requisições
  |
  +-- [ Inspector Engine ] (Application Layer)
  |     |-- [ AST Parser ] - Pre-processamento estático
  |     |-- [ LLM Orchestrator ] - Monta e envia prompts estruturados
  |     +-- [ Score Calculator ] - Calcula HealthScore (0-100)
  |
  +-- [ Database ] (PostgreSQL) - Armazena histórico, scores e issues
```

## 3. Decisões Arquiteturais (ADRs - Architecture Decision Records)

### ADR 001: Arquitetura Base
- **Decisão:** Utilizar Clean Architecture (Domain Driven Design).
- **Justificativa:** Previne que a lógica complexa de avaliação de código se acople a frameworks ou bibliotecas de LLMs específicas (permitindo trocar a IA sem refatorar o núcleo).

### ADR 002: Processamento Assíncrono para LLMs
- **Decisão:** Inspeções profundas (como análise de múltiplos arquivos) enfileirarão jobs (Background Tasks via Redis/BullMQ) em vez de manter conexões HTTP abertas por minutos.
- **Justificativa:** APIs de LLM possuem latência alta (2s a 30s dependendo do contexto). Manter o request síncrono causaria timeout no frontend.

### ADR 003: Modelagem de "Issues"
- **Decisão:** Issues não serão deletadas na camada de banco de dados se refatoradas, mas marcadas como "Resolved" e linkadas a uma nova inspection run.
- **Justificativa:** Essencial para traçar gráficos de evolução (diminuição de débito técnico ao longo do tempo).

## 4. Definição de Módulos (Bounded Contexts)
- **Module `Inspector`:** Lida com o parsing, comunicação com a LLM, e cálculo do score de um de trecho/arquivo específico.
- **Module `Audit`:** Gerencia histórico de inspeções, gera evoluções métricas e compara código de um usuário x outro.
- **Module `Integration`:** Abstração de I/O com provedor LLM, GitHub APIs (se conectarmos repositórios) e MasterCode Bot (J-NEW).

## 5. Estratégia de Escalabilidade
1. **Ponto Cego de Custo (LLM Calls):** O motor possui um cache (Hashed Code Snippet). Se o mesmo bloco de código exato for enviado num espaço de tempo curto, ele retorna o score em cache (Redis), reduzindo custos de API.
2. **Workers Separados:** O Parser/ScoreCalculator pode rodar em workers dedicados, permitindo escalar apenas o consumo da fila de inspeção verticalmente/horizontalmente quando o sistema estiver sobrecarregado (sem derrubar a API REST de navegação).
