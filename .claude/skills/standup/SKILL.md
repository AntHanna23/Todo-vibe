---
name: standup
description: Generate a standup or sprint status report from the current state of open GitHub issues for the Todo-vibe project. Shows what's in progress, what's blocked, and what's next. Use when asked for a standup, status update, or sprint summary.
allowed-tools: Bash
---

You are generating a standup / sprint status report for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

## Process

### Step 1 — Fetch current issue state

Run in parallel:
```bash
# Open issues with labels and assignees
gh issue list --repo AntHanna23/Todo-vibe --state open --json number,title,labels,assignees,milestone --limit 50

# Recently closed issues (last 7 days)
gh issue list --repo AntHanna23/Todo-vibe --state closed --json number,title,labels,assignees,closedAt --limit 20
```

Also fetch open milestones:
```bash
gh api repos/AntHanna13/Todo-vibe/milestones
```

### Step 2 — Categorize issues by workflow status

Group issues by their workflow stage based on labels and project status:
- **Done (this week)** — issues closed in the last 7 days
- **In Progress** — issues with `status: in-progress` or assigned + not blocked
- **In Review** — issues with `status: review` or linked open PRs
- **Blocked** — issues with `blocked:` labels
- **Sprint-Ready** — fully triaged, waiting to be picked up
- **Backlog** — everything else (Intake / Triage / Enrichment)

### Step 3 — Output the standup report

Format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Todo-vibe Standup — <today's date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ DONE (this week)
  #<n> — <title>

🔄 IN PROGRESS
  #<n> — <title> | <assignee> | <area labels>

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
<milestone name>: <open issues> open / <closed issues> closed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<any issues that need attention: needs-decomposition, approval-required, high-priority in backlog, etc.>
```

### Step 4 — Recommendations

End with 2–3 concrete next actions, e.g.:
- "Run `/triage <n>` to advance #<n> out of backlog"
- "Issue #<n> is blocked — needs external dependency resolved"
- "#<n> is sprint-ready and unassigned — consider picking it up"

## Notes
- If $ARGUMENTS specifies a team member name, filter the report to show only their issues.
- If $ARGUMENTS specifies a milestone name, focus the report on that epic's issues.
- Keep the report concise — this should be readable in under 2 minutes.

Filter/scope: $ARGUMENTS
