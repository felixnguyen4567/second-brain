#!/bin/bash
# Usage tracking log for GPT-5.5 (OpenAI Codex)
# Run manually or via cron

LOGFILE="$HOME/.openclaw/workspace/logs/gpt55-usage.log"
STATEFILE="$HOME/.openclaw/agents/main/agent/auth-state.json"

echo "=== $(date '+%Y-%m-%d %H:%M:%S %Z') ===" >> "$LOGFILE"

# Parse auth-state
python3 -c "
import json
import time
import os

state_file = os.path.expanduser('$STATEFILE')
try:
    with open(state_file) as f:
        state = json.load(f)
except Exception as e:
    print(f'Error reading state: {e}')
    exit(1)

usage_stats = state.get('usageStats', {})
profiles = state.get('profiles', {})

now_ms = time.time() * 1000

for profile_id, stats in usage_stats.items():
    email = profile_id.split(':')[1] if ':' in profile_id else profile_id
    print(f'Profile: {email}')
    print(f'  Last used: {stats.get(\"lastUsed\", 0)} ({time.ctime(stats.get(\"lastUsed\", 0)/1000)})')
    print(f'  Error count: {stats.get(\"errorCount\", 0)}')
    print(f'  Last failure: {stats.get(\"lastFailureAt\", 0)} ({time.ctime(stats.get(\"lastFailureAt\", 0)/1000) if stats.get(\"lastFailureAt\") else \"N/A\"})')
    print(f'  Cooldown reason: {stats.get(\"cooldownReason\", \"none\")}')
    print(f'  Cooldown model: {stats.get(\"cooldownModel\", \"N/A\")}')
    cooldown_until = stats.get('cooldownUntil', 0)
    if cooldown_until:
        remaining = (cooldown_until - now_ms) / 1000
        if remaining > 0:
            print(f'  Cooldown remaining: {remaining:.0f}s ({remaining/60:.1f}min)')
        else:
            print(f'  Cooldown: EXPIRED')
    print()
" >> "$LOGFILE"

echo "" >> "$LOGFILE"
