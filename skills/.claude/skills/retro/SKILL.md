---
name: retro
description: Run a sprint retrospective for Todo-vibe. Compares planned vs delivered velocity, surfaces what slipped and why, flags SLA breaches, and walks through the standard retro template (What went well / What didn't / Action items). Use at the end of a sprint or when asked for a retro.
allowed-tools: Bash
model: opus
---

You are facilitating a sprint retrospective for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for team capacity and sprint cadence.

## Process

### Step 1 — Identify the sprint

If $ARGUMENTS specifies a sprint name/number, use it. Otherwise use the most recently closed or ending milestone.

```bash
gh api repos/AntHanna23/Todo-vibe/milestones --field state=all
```

### Step 2 — Fetch sprint data

```bash
# Closed issues in this sprint's milestone
gh issue list --repo AntHanna23/Todo-vibe --state closed \
  --json number,title,labels,assignees,closedAt,createdAt,milestone,body --limit 100

# Open issues still in this sprint's milestone (slipped)
gh issue list --repo AntHanna23/Todo-vibe --state open \
  --json number,title,labels,assignees,milestone,body --limit 100
```

### Step 3 — Compute sprint stats

- **Planned weight** — sum of weights of all issues in the milestone
- **Delivered weight** — sum of weights of closed issues in the milestone
- **Velocity** — delivered weight / planned weight × 100%
- **Slipped issues** — open issues still in the milestone
- **SLA breaches** — p0 issues not closed same day, p1 issues not closed within the sprint
- **Unweighted issues** — closed issues with no weight (can't count toward velocity)

Extract weights from `Weight: <n>` patterns in issue bodies/comments.

### Step 4 — Walk through the retro template

Output the full retrospective report:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint Retrospective: <sprint name>
<start date> → <end date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 VELOCITY
─────────────────────────────────────
  Planned:   <n> pts across <n> issues
  Delivered: <n> pts across <n> issues
  Velocity:  <pct>%  (<above/below/on> target of 40–50 pts)

  By assignee:
    <name>: planned <w> pts → delivered <w> pts (<pct>%)
    ...

✅ COMPLETED
─────────────────────────────────────
  #<n> — <title> | <assignee> | Weight: <w>
  ...

⏭️ SLIPPED (moved to next sprint or backlog)
─────────────────────────────────────
  #<n> — <title> | <assignee> | Weight: <w>
  Likely reason: <infer from labels — blocked? high risk? late triage?>

⚠️ SLA BREACHES
─────────────────────────────────────
  #<n> — <title> | priority: p<n> | <n> days overdue
  (or "None — all SLAs met ✅")

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETROSPECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 WHAT WENT WELL
─────────────────────────────────────
(Based on the data — e.g. high velocity, no SLA breaches, clean triage, no slipped issues)
  • <observation>
  • <observation>

  [ Space for team to add their own notes ]
  •
  •

🔴 WHAT DIDN'T GO WELL
─────────────────────────────────────
(Based on the data — e.g. slipped issues, low velocity, unweighted issues, late grooming)
  • <observation>
  • <observation>

  [ Space for team to add their own notes ]
  •
  •

💡 WHAT TO TRY NEXT SPRINT
─────────────────────────────────────
(Concrete, actionable suggestions derived from the problems)
  • <suggestion>
  • <suggestion>

  [ Space for team to add their own notes ]
  •
  •

📋 ACTION ITEMS
─────────────────────────────────────
  [ ] <specific action> — Owner: <name>
  [ ] <specific action> — Owner: <name>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT SPRINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Slipped issues to carry over: <list #numbers>
  Suggested velocity target: <adjust up/down based on this sprint's result>
  Run /sprint-plan to kick off the next sprint.
```

## Notes
- Data-driven observations only in "What went well / didn't go well" — don't make up opinions
- Action items should be concrete and assigned to a specific person where possible
- If velocity < 60%, flag it prominently — the team is significantly under-delivering vs plan
- If velocity > 100%, note it positively but flag that planning estimates may be too conservative
- Slipped issues are automatically candidates for the next sprint — don't close them

Sprint name / number: $ARGUMENTS
