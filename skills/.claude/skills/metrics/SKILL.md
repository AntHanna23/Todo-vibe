---
name: metrics
description: Show project metrics for Todo-vibe — planned and completed work by label (type, area, priority), sprint velocity, per-person load, and backlog health. Use when asked for metrics, velocity, burndown, or label breakdowns.
allowed-tools: Bash
model: sonnet
---

You are generating project metrics for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for team capacity and sprint cadence.

## Process

### Step 1 — Fetch all issue data

Run in parallel:
```bash
# All open issues
gh issue list --repo AntHanna23/Todo-vibe --state open \
  --json number,title,labels,assignees,milestone,body,createdAt --limit 100

# All closed issues
gh issue list --repo AntHanna23/Todo-vibe --state closed \
  --json number,title,labels,assignees,milestone,body,closedAt,createdAt --limit 100

# Milestones (sprints/epics)
gh api repos/AntHanna23/Todo-vibe/milestones --field state=all
```

### Step 2 — Extract weights

For each issue, extract the weight from the issue body by looking for the pattern `Weight: <n>` or `**Weight:** <n>`. If no weight is found, treat as unweighted and note it.

### Step 3 — Compute metrics

**Planned work (open issues):**
- Group by `type:` label → count + total weight
- Group by `area:` label → count + total weight
- Group by `priority:` label → count + total weight
- Unweighted open issues → count

**Completed work (closed issues):**
- Group by `type:` label → count + total weight
- Group by `area:` label → count + total weight
- Group by `priority:` label → count + total weight
- If $ARGUMENTS specifies a time range (e.g. "last sprint", "this month"), filter closed issues by `closedAt`

**Sprint velocity (per milestone):**
- For each milestone: total weight of closed issues vs total weight of all issues
- Completion rate: closed weight / total weight × 100%

**Per-person metrics:**
- Open issues assigned + weight (current load)
- Closed issues + weight (completed work)
- % of team's completed weight

**Backlog health:**
- Issues without any labels
- Issues without a weight
- Issues without an assignee
- Issues stuck in Intake/Triage for > 7 days (createdAt > 7 days ago, no priority label)

### Step 4 — Output the metrics report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Todo-vibe Metrics — <today's date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PLANNED WORK (open issues: <total count>, <total weight> pts)
─────────────────────────────────────
By Type:
  type: feature  │ <count> issues │ <weight> pts │ ██████░░░░ <pct>%
  type: bug      │ <count> issues │ <weight> pts │ ███░░░░░░░ <pct>%
  type: chore    │ <count> issues │ <weight> pts │ ██░░░░░░░░ <pct>%
  type: refactor │ <count> issues │ <weight> pts │ █░░░░░░░░░ <pct>%
  type: spike    │ <count> issues │ <weight> pts │ █░░░░░░░░░ <pct>%

By Area:
  area: infra        │ <count> │ <weight> pts │ ████████░░ <pct>%
  area: backend      │ <count> │ <weight> pts │ ██████░░░░ <pct>%
  area: frontend     │ <count> │ <weight> pts │ ████░░░░░░ <pct>%
  area: testing      │ <count> │ <weight> pts │ ██░░░░░░░░ <pct>%
  area: build        │ <count> │ <weight> pts │ ██░░░░░░░░ <pct>%
  ... (all areas with open issues)

By Priority:
  priority: p0  │ <count> │ <weight> pts  ⚠️ (if > 0)
  priority: p1  │ <count> │ <weight> pts
  priority: p2  │ <count> │ <weight> pts
  priority: p3  │ <count> │ <weight> pts
  unclassified  │ <count> │ —

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLETED WORK (closed issues: <total count>, <total weight> pts)
─────────────────────────────────────
By Type:
  type: feature  │ <count> │ <weight> pts
  type: bug      │ <count> │ <weight> pts
  ... (same breakdown as planned)

By Area:
  <same breakdown>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏃 SPRINT VELOCITY
─────────────────────────────────────
<milestone name>:
  Total weight: <n> pts | Closed: <n> pts | Completion: <pct>%
  Open issues: <n> | Closed issues: <n>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PER-PERSON METRICS
─────────────────────────────────────
  Name            │ Open (pts) │ Closed (pts) │ Capacity │ Load%
  ────────────────┼────────────┼──────────────┼──────────┼──────
  Riley Chen      │ <w> pts    │ <w> pts      │ 12 pts   │ <pct>%
  Sam Patel       │ <w> pts    │ <w> pts      │ 10 pts   │ <pct>%
  Morgan Rivera   │ <w> pts    │ <w> pts      │ 10 pts   │ <pct>%
  Casey Morgan    │ <w> pts    │ <w> pts      │ 10 pts   │ <pct>%
  Jordan Blake    │ <w> pts    │ <w> pts      │  8 pts   │ <pct>%
  Anthony Hanna   │ <w> pts    │ <w> pts      │ 10 pts   │ <pct>%
  Unassigned      │ <w> pts    │ —            │ —        │ —

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 BACKLOG HEALTH
─────────────────────────────────────
  Unlabeled issues:          <n>
  Unweighted issues:         <n>
  Unassigned issues:         <n>
  Stuck in triage (>7 days): <n>
  needs-decomposition:       <n>
  approval-required:         <n>
```

### Step 5 — Insights & recommendations

End with 2–3 data-driven insights, e.g.:
- "<area> has the highest planned weight — consider whether it needs more resources"
- "Sprint velocity is tracking at <n> pts/sprint — adjust scope if needed"
- "<n> unweighted issues in backlog — run /triage to assign weights before sprint planning"
- "<name> is at <pct>% load — heaviest on the team"

## Notes
- Use `█` characters to draw simple bar charts proportional to weight percentage (10 chars = 100%)
- If $ARGUMENTS specifies a label (e.g. "area: infra"), filter the report to that label
- If $ARGUMENTS specifies a team member, show only their metrics
- If $ARGUMENTS specifies a time range (e.g. "last 2 weeks", "this sprint"), filter closed issues accordingly
- Weight is a proxy for effort — GitHub does not track actual time spent

Filter/scope: $ARGUMENTS
