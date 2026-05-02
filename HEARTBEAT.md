## Self-Improving Check

- Read `./skills/self-improving/heartbeat-rules.md`
- Use `~/self-improving/heartbeat-state.md` for last-run markers and action notes
- If no file inside `~/self-improving/` changed since the last reviewed change, return `HEARTBEAT_OK`

## Proactivity Check

- Read `~/proactivity/heartbeat.md`
- Re-check active blockers, promised follow-ups, stale work, and missing decisions
- Message the user only when something changed or needs a decision
- Update `~/proactivity/session-state.md` after meaningful follow-through

## 📚 Wiki Auto-Ingest (EVERY HEARTBEAT)

**This is a critical task. Run it every heartbeat cycle.**

### Step 1: Check for new sources
Check these folders for files NOT yet in `wiki/processed.json`:
- `Clippings/` (Obsidian Web Clipper articles)
- `raw/articles/`
- `raw/papers/`
- `raw/notes/`
- `output/*-trending-briefing.md` (daily trending news)

### Step 2: Auto-ingest new files
For EACH new (unprocessed) file found:

1. Read the file completely
2. Create `wiki/sources/<slug>.md` — structured summary with YAML frontmatter
3. Create or UPDATE relevant entity pages in `wiki/entities/`
4. Create or UPDATE relevant concept pages in `wiki/concepts/`
5. Add [[wikilinks]] for cross-referencing
6. Update `wiki/index.md` with new pages
7. Append to `wiki/log.md`
8. Add the file path to `wiki/processed.json`

### Step 3: Git push
After all ingests:
```bash
cd ~/workspace && git add -A && git commit -m "auto-ingest: <count> sources" && git push github main
```

### Step 4: Report
If any files were ingested, send a brief summary to the user via Telegram:
"📚 Wiki updated: ingested X new sources. New pages: [list]. Total: Y pages."

If no new files found, do nothing (don't message).

### Important Rules
- Do NOT re-ingest files already in `wiki/processed.json`
- Do NOT modify files in `Clippings/` or `raw/` — only READ them
- ALWAYS update `wiki/processed.json` after ingesting
- Prefer UPDATING existing entity/concept pages over creating duplicates
- Keep pages focused: one entity or concept per page
