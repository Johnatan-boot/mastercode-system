# 🧠 AI Software Inspector Core — DDD & PostgreSQL Data Modeling (Nível Senior)

## 🧭 1. ERD (Diagrama Entidade-Relacionamento Textual)

A arquitetura do banco de dados foi projetada separando as entidades em **Schemas** isolados, representando os Bounded Contexts estruturais do Domain-Driven Design (DDD).

```text
[ IAM Context ]
  (iam.roles) 1 -- N (iam.permissions)
      |
      1
      |
      N
  (iam.user_roles)
      |
      N
      |
      1
  (iam.users) 1 -------------------+
                                   |
                                   |
[ Integrations Context ]           |
  (integrations.providers) 1 -- N (integrations.repositories)
                                   |
                                   |
[ Core Scanner Context ]           |
  (scanner.engines) 1              |
      |                            |
      N                            |
  (scanner.jobs) 1 -- 1 (scanner.inspections) N -- 1 (iam.users)
                           |
                           |
[ Reporting Context ]      |
                           |
                           1
  (reporting.reports) 1 -- 1 (scanner.inspections)
      |
      1
      |
      N
  (reporting.issues)
```

---

## 🗄️ 2. SQL COMPLETO E NORMALIZADO (PostgreSQL)

```sql
-- Extensões Nativas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 🔐 CONTEXTO: IAM (Identity and Access Management)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS iam;

CREATE TABLE iam.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft Delete para relatórios históricos
);
CREATE INDEX idx_users_email ON iam.users(email);

CREATE TABLE iam.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'admin', 'developer', 'manager'
    description TEXT
);

CREATE TABLE iam.user_roles (
    user_id UUID NOT NULL REFERENCES iam.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES iam.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);


-- ==============================================================================
-- 🔗 CONTEXTO: INTEGRATIONS (Fontes de Código)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS integrations;

CREATE TYPE integrations.provider_type AS ENUM ('github', 'gitlab', 'bitbucket', 'local');

CREATE TABLE integrations.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type integrations.provider_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb -- Secrets, Base URLs (criptografados no app-layer)
);

CREATE TABLE integrations.repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES integrations.providers(id),
    user_id UUID NOT NULL REFERENCES iam.users(id), -- Owner/Link de quem importou
    external_repo_id VARCHAR(255), -- ID do repo na origin (ex: ID do GitHub)
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    default_branch VARCHAR(50) DEFAULT 'main',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_repositories_user_id ON integrations.repositories(user_id);


-- ==============================================================================
-- 🧠 CONTEXTO: CORE SCANNER (Motor de Execução)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS scanner;

CREATE TYPE scanner.job_status AS ENUM ('queued', 'running', 'completed', 'failed');

-- Versionamento de motores e IAs
CREATE TABLE scanner.engines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., 'LLM-Gemini-Pro', 'Static-Sonar'
    version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gerenciamento de Fila e Processos pesados (Jobs)
CREATE TABLE scanner.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status scanner.job_status DEFAULT 'queued',
    payload JSONB NOT NULL, -- Contexto do código, branch, hash
    retry_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scanner.inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID UNIQUE NOT NULL REFERENCES scanner.jobs(id),
    repository_id UUID REFERENCES integrations.repositories(id), -- Opcional: nulo se for snippet isolado (Bot)
    requested_by UUID NOT NULL REFERENCES iam.users(id),
    engine_id UUID NOT NULL REFERENCES scanner.engines(id),
    commit_hash VARCHAR(40),
    target_branch VARCHAR(100),
    files_scanned INTEGER DEFAULT 0,
    status scanner.job_status DEFAULT 'queued',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_inspections_repo ON scanner.inspections(repository_id);
CREATE INDEX idx_inspections_user ON scanner.inspections(requested_by);


-- ==============================================================================
-- 📊 CONTEXTO: REPORTING (Resultados Auditáveis)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS reporting;

CREATE TYPE reporting.issue_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
CREATE TYPE reporting.issue_category AS ENUM ('security', 'performance', 'architecture', 'maintainability');
CREATE TYPE reporting.issue_status AS ENUM ('open', 'resolved', 'ignored');

-- View consolidada da Nota (Score)
CREATE TABLE reporting.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID UNIQUE NOT NULL REFERENCES scanner.inspections(id) ON DELETE CASCADE,
    total_score NUMERIC(5,2) NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    security_score NUMERIC(5,2) NOT NULL,
    performance_score NUMERIC(5,2) NOT NULL,
    architecture_score NUMERIC(5,2) NOT NULL,
    maintainability_score NUMERIC(5,2) NOT NULL,
    ai_summary TEXT, -- Síntese gerada pelo LLM
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reporting.issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reporting.reports(id) ON DELETE CASCADE,
    category reporting.issue_category NOT NULL,
    severity reporting.issue_severity NOT NULL,
    status reporting.issue_status DEFAULT 'open',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    file_path VARCHAR(500), -- Onde aconteceu
    line_number INTEGER,
    suggestion_code TEXT, -- Auto-remediation code
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_issues_report_id ON reporting.issues(report_id);
CREATE INDEX idx_issues_severity ON reporting.issues(severity);
CREATE INDEX idx_issues_status ON reporting.issues(status);
```

---

## 🧠 3. JUSTIFICATIVA ARQUITETURAL

1. **IAM (Identity and Access Management):** 
   - **Por que existe:** Desacoplar sistema de login e permissões. 
   - **Escala:** Permite usar JWT para sessão, batendo no `iam.users` apenas para auditorias densas. `Soft Delete` garante que relatórios passados não quebrem as constraints se um desenvolvedor sair da empresa.
2. **Integrations:**
   - **Por que existe:** Projetos podem vir de N provedores diferentes (GitHub, GitLab) ou trechos avulsos.
   - **Evolução:** Ao isolar os repositórios em `integrations`, o Scanner não se importa de onde o código veio. O Schema está pronto para plugar BitBucket amanhã sem alterar o backend principal do parser.
3. **Core Scanner:**
   - **Por que existe:** O uso de IA (LLM) tem latência e falhas de rede. A quebra entre `jobs` e `inspections` garante um comportamento Worker/Fila robusto. 
   - **Escala:** Você pode provisionar 10 máquinas para processar `jobs` isoladamente na AWS/GCP (Puxando da tabela via polling ou um RabbitMQ) enquanto a API principal apenas enfileira o Job. A entidade `engines` permite criar versionamento do cérebro IA.
4. **Reporting:**
   - **Por que existe:** Leituras (Reads) são 100x mais frequentes que escritas (Writes) na análise métrica.
   - **Evolução:** Os dashboards consumirão views no Schema `reporting`, que já agrupa o `score` em uma tabela rasa (`reports`) separada do peso bruto do log das `issues`.

---

## 🚀 4. PREPARAÇÃO PARA O FUTURO & INTEGRIDADE

1. **Campos JSONB Estratégicos:** O payload do `scanner.jobs` utiliza `JSONB`. Se precisarmos injetar AST (Abstract Syntax Tree) bruta no futuro antes da análise nativa da IA, não precisaremos migrar o DDL estrutural.
2. **Múltiplos Motores (Engine Versioning):** O Schema Tracking `scanner.engines` é mandatório. É possível comparar a precisão das issues detectadas entre a "Engine V1.0 (Regex Native)" e a "Engine V2.0 (Gemini Pro LLM)".
3. **Auto-Remediation & Retry:** A `reporting.issues` possui campos para código sugerido (`suggestion_code`) e controle de resolução (`status`), fundamental em arquiteturas de Code Review automatizados, suportando um Bot mandando PRs autônomos para fechar issues.
4. **Segregação Física vs Lógica:** Foram estabelecidos 4 Schemas explícitos no banco. Isso permite futuramente isolar cada contexto (Microservices) dividindo o schema sem a necessidade de grande refatoramento, migrando cada conjunto de dados organicamente se a plataforma ganhar tração extrema.