---
name: sprint-plan
description: Plan the next sprint for Todo-vibe. Fills team capacity from the sprint-ready backlog by priority order, assigns issues to a milestone, and outputs the committed sprint plan. Use when starting a new sprint or asked to plan a sprint.
allowed-tools: Bash
model: opus
---

You are planning the next sprint for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for team capacity, ownership map, and sprint cadence.

## Process

### Step 1 — Gather context

Run in parallel:
```bash
# Sprint-ready open issues (fully labeled, weighted, assigned)
gh issue list --repo AntHanna23/Todo-vibe --state open \
  --json number,title,labels,assignees,milestone,body --limit 100

# Existing milestones to determine next sprint number/name
gh api repos/AntHanna23/Todo-vibe/milestones
```

### Step 2 — Identify sprint-ready issues

A sprint-ready issue must meet ALL criteria:
1. Has `type:`, `area:`, `priority:`, and `risk:` labels
2. Has `Weight: <n>` in body or comments
3. Has an assignee
4. Has acceptance criteria
5. No `needs-decomposition` or `approval-required` labels

Issues that don't meet these criteria are NOT eligible — note them as "needs triage first".

### Step 3 — Fill team capacity by priority

Sort sprint-ready issues by priority (p0 → p1 → p2 → p3), then by weight (ascending — smaller first within same priority).

For each issue, check if the assignee still has capacity this sprint (from TEAM.md):
- If yes: include in sprint
- If no: flag as "over capacity — needs reassignment" and skip

Track running totals per person and overall.

Stop when total sprint weight reaches 50 pts (target velocity) OR all sprint-ready issues are assigned.

### Step 4 — Determine sprint name

If $ARGUMENTS provides a sprint name/number, use it.
Otherwise derive from existing milestones (e.g. if "Sprint 1" exists → new sprint is "Sprint 2").

### Step 5 — Create or update the milestone

If the sprint milestone doesn't exist yet:
```bash
gh api repos/AntHanna23/Todo-vibe/milestones \
  --method POST \
  --field title="<sprint name>" \
  --field description="Sprint goal: <1-sentence goal derived from the committed issues>" \
  --field due_on="<end date — 2 weeks from today, ISO format>"
```

### Step 6 — Assign committed issues to the milestone

For each committed issue:
```bash
gh issue edit <number> --repo AntHanna23/Todo-vibe --milestone "<sprint name>"
```

### Step 7 — Output the sprint plan

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint Plan: <sprint name>
<start date> → <end date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Sprint Goal
<1-2 sentence goal derived from the committed issues>

📋 COMMITTED ISSUES (<total weight> / 50 pts target)
─────────────────────────────────────
  #<n> — <title> | <assignee> | <priority> | Weight: <w>
  #<n> — <title> | <assignee> | <priority> | Weight: <w>
  ...

👤 CAPACITY ALLOCATION
─────────────────────────────────────
  Riley Chen:    <w> / 12 pts  (<issues> issues)
  Sam Patel:     <w> / 10 pts  (<issues> issues)
  Morgan Rivera: <w> / 10 pts  (<issues> issues)
  Casey Morgan:  <w> / 10 pts  (<issues> issues)
  Jordan Blake:  <w> /  8 pts  (<issues> issues)
  Anthony Hanna: <w> / 10 pts  (<issues> issues)

⏭️ DEFERRED (sprint-ready but didn't fit)
─────────────────────────────────────
  #<n> — <title> | <reason: over capacity / lower priority>

⚠️ NEEDS TRIAGE FIRST (not sprint-ready)
─────────────────────────────────────
  #<n> — <title> | Missing: <what's needed>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All committed issues have been assigned to milestone: <sprint name>
Next: Run /standup at any time to track progress.
```

## Notes
- Never exceed an individual's capacity when committing issues — flag overflows instead
- p0 issues must always be included regardless of capacity (flag if they push total over 60 pts)
- If $ARGUMENTS includes a sprint name, use that as the milestone title
- If $ARGUMENTS includes a goal, use it as the sprint goal instead of deriving one

Sprint name / goal: $ARGUMENTS
