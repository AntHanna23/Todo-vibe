---
name: sprint-check
description: Check which open GitHub issues for Todo-vibe are sprint-ready and which are not. Reports blockers for each issue that isn't ready. Use when planning a sprint or reviewing backlog readiness.
allowed-tools: Bash
model: sonnet
---

You are performing a sprint readiness check for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for the team roster, capacities, and sprint cadence.

## Sprint-Ready Criteria

An issue is Sprint-Ready ONLY if ALL of the following are true:
1. Has exactly one `type:` label
2. Has at least one `area:` label
3. Has exactly one `priority:` label
4. Has exactly one `risk:` label
5. Has a weight assigned (noted in the issue body or a comment as `Weight: <n>`)
6. Has an `owner:` label (e.g. `owner: riley-chen`) — this project uses owner labels, NOT GitHub assignees
7. Has acceptance criteria in the issue body
8. Does NOT have `needs-decomposition` label
9. Does NOT have `approval-required` label (or approval has been explicitly granted)

## Process

### Step 1 — Fetch open issues and team load
```bash
gh issue list --repo AntHanna23/Todo-vibe --state open --json number,title,labels,assignees,body,milestone --limit 50
```

### Step 2 — Evaluate each issue against the 9 criteria

Look for acceptance criteria by checking for: "Acceptance Criteria", "acceptance criteria", "- [ ]" patterns.
Look for weight by checking for "Weight: <n>" in the body or comments.

### Step 3 — Calculate per-person planned weight

For sprint-ready issues, extract the `owner:` label and sum weights per person. Compare against capacity from TEAM.md.

### Step 4 — Report results

#### ✅ Sprint-Ready
```
#<n> — <title>
  Labels: <type> | <area(s)> | <priority> | <risk>
  Weight: <n> pts | Assignee: <name>
```

#### ❌ Not Sprint-Ready
```
#<n> — <title>
  Missing: <list each unmet criterion>
  Next step: <specific action, e.g. "Run /triage #<n>" or "Add acceptance criteria">
```

### Step 5 — Summary table

```
Sprint Readiness Summary
─────────────────────────────────────
Total open issues:     <n>
Sprint-ready:          <n>  (<total weight> pts)
Needs work:            <n>

Team Capacity & Load
─────────────────────────────────────
  Riley Chen:    <ready pts assigned> / 12 pts  (<remaining> available)
  Sam Patel:     <ready pts assigned> / 10 pts  (<remaining> available)
  Morgan Rivera: <ready pts assigned> / 10 pts  (<remaining> available)
  Casey Morgan:  <ready pts assigned> / 10 pts  (<remaining> available)
  Jordan Blake:  <ready pts assigned> /  8 pts  (<remaining> available)
  Anthony Hanna: <ready pts assigned> / 10 pts  (<remaining> available)
  ─────────────────────────────────
  Total:         <total ready pts> / 60 pts

Priority Breakdown (sprint-ready issues)
─────────────────────────────────────
  p0: <n> issues (<w> pts)
  p1: <n> issues (<w> pts)
  p2: <n> issues (<w> pts)
  p3: <n> issues (<w> pts)

Area Breakdown (sprint-ready issues)
─────────────────────────────────────
  <area>: <n> issues (<w> pts)
  ...
```

### Step 6 — Capacity warnings & recommendations

- If total sprint-ready weight exceeds 50 pts (target velocity), list which issues to defer based on priority order (p3 first, then p2, etc.)
- If any person is over capacity, flag it and suggest redistribution
- If no issues are sprint-ready, recommend running `/triage` on the highest priority issues first
- If p0 or p1 issues are NOT sprint-ready, flag them as urgent — they need to be unblocked immediately

## Notes
- If $ARGUMENTS contains a sprint name/number, filter to issues assigned to that milestone if possible.
- If $ARGUMENTS contains a team member name, show only their issues and capacity.
- Unweighted sprint-ready issues should be flagged — weight is required before committing to a sprint.

Filter/scope: $ARGUMENTS
