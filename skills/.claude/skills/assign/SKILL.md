---
name: assign
description: Rebalance workload across the Todo-vibe team. Redistributes unassigned or over-capacity issues respecting the ownership map and current load. Use when someone is OOO, a sprint is overloaded, or asked to rebalance/reassign work.
allowed-tools: Bash
model: sonnet
---

You are rebalancing workload for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for the team roster, ownership map, and sprint capacity.

## Modes

The skill operates in one of these modes based on $ARGUMENTS:

- **`rebalance`** (default) — find overloaded team members and redistribute their excess issues
- **`<name>`** — show that person's current load and suggest what to move
- **`unassigned`** — assign all unassigned sprint-ready issues to the right owner
- **`ooo <name>`** — person is out of office, redistribute all their open issues

## Process

### Step 1 — Fetch current state
```bash
gh issue list --repo AntHanna23/Todo-vibe --state open \
  --json number,title,labels,assignees,milestone,body --limit 100
```

### Step 2 — Build load map

For each team member, calculate:
- Issues assigned + their weights (extract `Weight: <n>` from body)
- Remaining capacity = sprint capacity (from TEAM.md) − assigned weight
- Load % = assigned weight / sprint capacity × 100

### Step 3 — Execute the selected mode

**`rebalance` mode:**
- Identify anyone over 100% capacity
- For each overloaded person, find their lowest-priority issues (p3 first, then p2)
- Find the team member with the most remaining capacity who owns the same area (per TEAM.md ownership map)
- Propose the reassignment

**`<name>` mode:**
- Show that person's full issue list with weights
- Show their capacity utilization
- Suggest 1–2 issues they could hand off if over capacity, or flag if under-loaded

**`unassigned` mode:**
- Find all open issues with no assignee
- For each, determine the correct owner from the area labels and TEAM.md ownership map
- Assign them

**`ooo <name>` mode:**
- Find all open issues assigned to that person
- For each issue, find the best available team member based on: area ownership → remaining capacity → priority (p0/p1 first)
- Reassign all of them

### Step 4 — Apply reassignments

For each reassignment, confirm the action before applying (list all changes first):

```
Proposed reassignments:
  #<n> — <title>: <from> → <to> (reason: <over capacity / unassigned / OOO>)
  #<n> — <title>: <from> → <to>
  ...
```

Then apply using owner labels (this project does NOT use GitHub assignees):
```bash
# Add new owner label
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "owner: <handle>"
# Remove old owner label
gh issue edit <number> --repo AntHanna23/Todo-vibe --remove-label "owner: <old-handle>"
```

### Step 5 — Output the rebalancing summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Workload Rebalancing — <today's date>
Mode: <mode>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE
─────────────────────────────────────
  Riley Chen:    <w> / 12 pts  (<load>%)  <🔴 over / 🟡 at capacity / 🟢 ok>
  Sam Patel:     <w> / 10 pts  (<load>%)
  Morgan Rivera: <w> / 10 pts  (<load>%)
  Casey Morgan:  <w> / 10 pts  (<load>%)
  Jordan Blake:  <w> /  8 pts  (<load>%)
  Anthony Hanna: <w> / 10 pts  (<load>%)
  Unassigned:    <w> pts across <n> issues

CHANGES MADE
─────────────────────────────────────
  #<n> — <title>
    <from> → <to>
    Reason: <over capacity / unassigned / OOO / area ownership>

AFTER
─────────────────────────────────────
  Riley Chen:    <w> / 12 pts  (<load>%)
  ... (updated totals)

⚠️ UNRESOLVABLE
─────────────────────────────────────
  #<n> — <title>: <why it couldn't be reassigned, e.g. "all area owners at capacity">
```

## Notes
- Never reassign p0 issues without flagging Jordan Blake (Tech Lead) — add a comment
- Prefer reassigning to the canonical area owner (TEAM.md ownership map) over anyone with spare capacity
- If no canonical owner has capacity, escalate to Jordan Blake
- Do not reassign issues that are `status: in-progress` — flag them instead

Mode / person: $ARGUMENTS
