---
name: standup
description: Generate a standup or sprint status report from the current state of open GitHub issues for the Todo-vibe project. Shows what's in progress, what's blocked, and what's next. Use when asked for a standup, status update, or sprint summary.
allowed-tools: Bash
model: sonnet
---

You are generating a standup / sprint status report for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for the team roster, capacity, and sprint cadence.

## Process

### Step 1 — Fetch current issue state

Run in parallel:
```bash
# Open issues with labels, assignees, milestone
gh issue list --repo AntHanna23/Todo-vibe --state open --json number,title,labels,assignees,milestone,body --limit 50

# Recently closed issues (last 7 days)
gh issue list --repo AntHanna23/Todo-vibe --state closed --json number,title,labels,assignees,closedAt --limit 20

# Open milestones
gh api repos/AntHanna23/Todo-vibe/milestones
```

### Step 2 — Categorize issues by workflow status

Group issues by their workflow stage:
- **Done (this week)** — issues closed in the last 7 days
- **In Progress** — issues with `status: in-progress` or assigned + no blocking label
- **In Review** — issues with `status: review` or linked open PRs
- **Blocked** — issues with any `blocked:` label
- **Sprint-Ready** — fully triaged, waiting to be picked up
- **Backlog** — everything else (Intake / Triage / Enrichment)

### Step 3 — Build per-person load summary

For each team member (from TEAM.md), list:
- Issues currently assigned to them
- Total weight assigned this sprint
- Remaining capacity (sprint capacity − assigned weight)

### Step 4 — Build label-based planned work breakdown

Count open issues and sum weights (extracted from issue body `Weight: <n>` comments) grouped by:
- **By type:** bug / feature / chore / refactor / spike
- **By area:** frontend / api / backend / database / infra / build / testing / notifications / tags / reminders
- **By priority:** p0 / p1 / p2 / p3

### Step 5 — Output the standup report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Todo-vibe Standup — <today's date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ DONE (this week)
  #<n> — <title> | <assignee>

🔄 IN PROGRESS
  #<n> — <title> | <assignee> | <area labels> | Weight: <w>

👀 IN REVIEW
  #<n> — <title> | <assignee>

🚧 BLOCKED
  #<n> — <title> | Reason: <blocked label or note>

📋 SPRINT-READY (next up)
  #<n> — <title> | <assignee> | Weight: <w>

📥 BACKLOG (needs triage/enrichment)
  #<n> — <title> | Stage: <Intake|Triage|Enrichment>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EPIC PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<milestone name>: <open> open / <closed> closed issues

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEAM LOAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Riley Chen:    <assigned pts> / 12 pts  (<remaining> remaining)
  Sam Patel:     <assigned pts> / 10 pts  (<remaining> remaining)
  Morgan Rivera: <assigned pts> / 10 pts  (<remaining> remaining)
  Casey Morgan:  <assigned pts> / 10 pts  (<remaining> remaining)
  Jordan Blake:  <assigned pts> /  8 pts  (<remaining> remaining)
  Anthony Hanna: <assigned pts> / 10 pts  (<remaining> remaining)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLANNED WORK BREAKDOWN (open issues)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
By Type:
  feature:  <count> issues (<weight> pts)
  bug:      <count> issues (<weight> pts)
  chore:    <count> issues (<weight> pts)
  refactor: <count> issues (<weight> pts)
  spike:    <count> issues (<weight> pts)

By Area (top areas by weight):
  area: infra:     <count> issues (<weight> pts)
  area: backend:   <count> issues (<weight> pts)
  area: frontend:  <count> issues (<weight> pts)
  ... (include all areas with open issues)

By Priority:
  p0: <count> issues (<weight> pts)  ⚠️ if any
  p1: <count> issues (<weight> pts)
  p2: <count> issues (<weight> pts)
  p3: <count> issues (<weight> pts)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<any issues needing attention: needs-decomposition, approval-required,
 overloaded team members, p0/p1 sitting in backlog, SLA breaches, etc.>
```

### Step 6 — Recommendations

End with 2–3 concrete next actions, e.g.:
- "Run `/triage <n>` to advance #<n> out of backlog"
- "Issue #<n> is blocked — needs external dependency resolved"
- "#<n> is p1 and sprint-ready but unassigned — assign before sprint planning"
- "<name> is at capacity — consider redistributing #<n>"

## Notes
- If $ARGUMENTS specifies a team member name, filter the report to show only their issues and load.
- If $ARGUMENTS specifies a milestone name, focus the report on that epic's issues.
- Weight values come from `Weight: <n>` comments on issues. If no weight comment found, note it as unweighted.
- Keep the report concise — readable in under 2 minutes.

Filter/scope: $ARGUMENTS
