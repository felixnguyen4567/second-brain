# Wiki Operations Guidelines

## 📚 LLM Wiki — Knowledge Base Operations

You maintain a persistent, structured wiki in `wiki/`. This is your primary knowledge artifact — it compounds over time as sources are ingested and questions are explored.

### Architecture

```
workspace/
├── wiki/                    # YOU own this — read + write
│   ├── index.md             # Master catalog of all pages
│   ├── log.md               # Chronological operation log
│   ├── overview.md          # High-level wiki summary
│   ├── entities/            # People, orgs, products, technologies
│   ├── concepts/            # Ideas, theories, patterns, frameworks
│   ├── sources/             # One summary per ingested source
│   ├── comparisons/         # Side-by-side analyses
│   └── analyses/            # Deep dives, syntheses
├── Clippings/               # Web Clipper articles (via Obsidian)
│   └── *.md                 # Auto-saved by Web Clipper
├── raw/                     # IMMUTABLE — human curates, you only read
│   ├── articles/            # Web articles (markdown via Obsidian Clipper)
│   ├── papers/              # Research papers, reports
│   ├── notes/               # Personal notes, journal entries
│   └── assets/              # Images referenced by sources
└── AGENTS.md                # This file (schema + conventions)
```

### Page Format

Every wiki page MUST have YAML frontmatter:

```markdown
---
title: Page Title
type: entity | concept | source | comparison | analysis
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [source-filename-1, source-filename-2]
tags: [tag1, tag2]
---

# Page Title

Content here. Use [[wikilinks]] to link to other pages.
```

### Operations

#### INGEST (when user says "ingest", "process", "read this", or drops a file in raw/)

1. Read the raw source completely
2. Discuss key takeaways with the user (if interactive)
3. Create `wiki/sources/<source-slug>.md` — a structured summary
4. Update or create relevant entity pages in `wiki/entities/`
5. Update or create relevant concept pages in `wiki/concepts/`
6. Add [[wikilinks]] in all touched pages for cross-referencing
7. Update `wiki/index.md` — add new pages with one-line summaries
8. Append entry to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] ingest | Source Title
   - Source: `raw/articles/filename.md`
   - Pages created: X
   - Pages updated: Y
   - Key entities: Entity1, Entity2
   - Key concepts: Concept1, Concept2
   ```
9. Update `wiki/overview.md` statistics
10. Git commit with message: `ingest: <source title>`

#### QUERY (when user asks a question about wiki content)

1. Read `wiki/index.md` to find relevant pages
2. Read the relevant pages
3. Synthesize an answer with [[wikilink]] citations
4. If the answer is substantial/reusable, ask user: "Want me to file this as a wiki page?"
5. If yes → create page in `wiki/analyses/` or `wiki/comparisons/`
6. Update index and log

#### LINT (when user says "lint", "health check", or "maintain wiki")

Check for and report:
- ❌ Contradictions between pages
- 🔗 Broken [[wikilinks]] (link to non-existent page)
- 🏝️ Orphan pages (no inbound links)
- 📝 Important concepts mentioned but lacking their own page
- 📅 Stale claims that newer sources have superseded
- ❓ Data gaps — suggest sources to look for
- Fix issues automatically where possible, report the rest

### Wikilink Conventions

- Use `[[page-name]]` format (Obsidian-compatible)
- Entity names: `[[OpenAI]]`, `[[GPT-5]]`, `[[Elon Musk]]`
- Concept names: `[[transformer-architecture]]`, `[[rag-pattern]]`
- Source references: `[[sources/article-slug]]`
- Always prefer linking to existing pages over creating new ones
- Create a new page only if the entity/concept appears in 2+ sources

### Git Workflow

After any wiki modification:
```bash
cd ~/workspace && git add wiki/ && git commit -m "<operation>: <description>" && git push
```

Auto-push runs every 5 minutes via cron as a safety net, but prefer explicit commits after operations.

### Important Rules

1. **NEVER modify files in `raw/`** — those are the user's source of truth
2. **ALWAYS update index.md** after creating or renaming pages
3. **ALWAYS append to log.md** after any operation
4. **Use [[wikilinks]] liberally** — connections are the wiki's value
5. **Keep pages focused** — one entity/concept per page, link to related pages
6. **Cite sources** — every claim should trace back to a source page
7. **Flag contradictions** — when sources disagree, note it explicitly
