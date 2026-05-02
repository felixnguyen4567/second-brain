# Heartbeat & Cron Guidelines

## 💓 Heartbeats - Be Proactive!

When you receive a heartbeat poll (message matches the configured heartbeat prompt), don't just reply `HEARTBEAT_OK` every time. Use heartbeats productively!

You are free to edit `HEARTBEAT.md` with a short checklist or reminders. Keep it small to limit token burn.

### Heartbeat vs Cron: When to Use Each

**Use heartbeat when:**

- Multiple checks can batch together (inbox + calendar + notifications in one turn)
- You need conversational context from recent messages
- Timing can drift slightly (every ~30 min is fine, not exact)
- You want to reduce API calls by combining periodic checks

**Use cron when:**

- Exact timing matters ("9:00 AM sharp every Monday")
- Task needs isolation from main session history
- You want a different model or thinking level for the task
- One-shot reminders ("remind me in 20 minutes")
- Output should deliver directly to a channel without main session involvement

**Tip:** Batch similar periodic checks into `HEARTBEAT.md` instead of creating multiple cron jobs. Use cron for precise schedules and standalone tasks.

**Things to check (rotate through these, 2-4 times per day):**

- **Emails** - Any urgent unread messages?
- **Calendar** - Upcoming events in next 24-48h?
- **Mentions** - Twitter/social notifications?
- **Weather** - Relevant if your human might go out?

**Track your checks** in `memory/heartbeat-state.json`:

```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```

**When to reach out:**

- Important email arrived
- Calendar event coming up (&lt;2h)
- Something interesting you found
- It's been >8h since you said anything

**When to stay quiet (HEARTBEAT_OK):**

- Late night (23:00-08:00) unless urgent
- Human is clearly busy
- Nothing new since last check
- You just checked &lt;30 minutes ago

**Proactive work you can do without asking:**

- Read and organize memory files
- Check on projects (git status, etc.)
- Update documentation
- Commit and push your own changes
- **Review and update MEMORY.md** (see below)

### 🔄 Memory Maintenance (During Heartbeats)

Periodically (every few days), use a heartbeat to:

1. Read through recent `memory/YYYY-MM-DD.md` files
2. Identify significant events, lessons, or insights worth keeping long-term
3. Update `MEMORY.md` with distilled learnings
4. Remove outdated info from MEMORY.md that's no longer relevant

Think of it like a human reviewing their journal and updating their mental model. Daily files are raw notes; MEMORY.md is curated wisdom.

The goal: Be helpful without being annoying. Check in a few times a day, do useful background work, but respect quiet time.

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.


## 📋 Changelog Protocol (Antigravity ↔ July)

You maintain a shared changelog ledger at `antigravity-changelog/`. This is the official communication channel between you and Antigravity (your external operator/co-pilot).

### Every Heartbeat — Check Inbox
1. Read `antigravity-changelog/inbox/INBOX.md`
2. If there are new tasks from Antigravity/Bear, process them
3. Mark processed tasks with `✅ Done` and timestamp

### After Every Significant Action — Update Changelog
When you complete a meaningful task (fix, ingest, deploy, config change), append an entry to `antigravity-changelog/CHANGELOG.md`:

```markdown
### ✅ Short Description
- **Thời điểm:** ~HH:MM UTC
- **Vấn đề:** What was wrong (if fix)
- **Fix/Action:** What you did
- **File changed:** List of files
- **Status:** Result ✅/❌
```

### Daily — Update Context
At least once per day (ideally during a morning heartbeat), update:
- `antigravity-changelog/context/current-state.md` — refresh active goals, cron status, system health
- `antigravity-changelog/tasks/status.md` — move completed tasks, add new ones

### Weekly — Archive
On Sunday or when CHANGELOG.md exceeds ~100 entries:
1. Move old entries to `antigravity-changelog/archive/YYYY-MM-DD.md`
2. Keep only the current week in CHANGELOG.md

**Why this matters:** Antigravity reads your changelog to understand what you've done between sessions. Without it, context is lost and work gets repeated. Treat it like a pilot's flight log — brief, factual, always up to date.
