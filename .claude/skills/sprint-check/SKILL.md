---
name: sprint-check
description: Check which open GitHub issues for Todo-vibe are sprint-ready and which are not. Reports blockers for each issue that isn't ready. Use when planning a sprint or reviewing backlog readiness.
allowed-tools: Bash
---

You are performing a sprint readiness check for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

## Sprint-Ready Criteria

An issue is Sprint-Ready ONLY if ALL of the following are true:
1. Has exactly one `type:` label
2. Has at least one `area:` label
3. Has exactly one `priority:` label
4. Has exactly one `risk:` label
5. Has a weight assigned (GitHub Project field, or noted in the issue body as `Weight: <n>`)
6. Has a primary assignee
7. Has acceptance criteria in the issue body
8. Does NOT have `needs-decomposition` label
9. Does NOT have `approval-required` label (or approval has been granted)

## Process

### Step 1 — Fetch open issues
```bash
gh issue list --repo AntHanna23/Todo-vibe --state open --json number,title,labels,assignees,body --limit 50
```

### Step 2 — For each issue, check sprint-ready criteria

Evaluate each issue against the 9 criteria above.

Look for acceptance criteria in the body by checking for phrases like "Acceptance Criteria", "acceptance criteria", "- [ ]", or similar patterns.

### Step 3 — Report results

Output two sections:

#### ✅ Sprint-Ready
List each ready issue:
```
#<n> — <title> | <labels summary> | Assignee: <name>
```

#### ❌ Not Sprint-Ready
List each issue with specific blockers:
```
#<n> — <title>
  Missing: <list each missing criterion>
```

### Step 4 — Summary

Output a summary table:
```
Sprint Readiness Summary
─────────────────────────────────────
Total open issues:   <n>
Sprint-ready:        <n>
Needs work:          <n>

Team capacity this sprint:
  Riley Chen:   12 pts
  Sam Patel:    10 pts
  Morgan Rivera: 10 pts
  Casey Morgan:  10 pts
  Jordan Blake:   8 pts
  Total:         50 pts

Sprint-ready weight total: <sum of weights for ready issues>
```

If the sprint-ready weight total exceeds team capacity, flag which issues would need to move to the next sprint based on priority order (p0 first, then p1, p2, p3).

## Notes
- If $ARGUMENTS contains a sprint name or number, filter to issues assigned to that sprint if possible.
- If no issues are sprint-ready, suggest running `/triage` on the highest priority issues first.

Filter/scope: $ARGUMENTS
