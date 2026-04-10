---
name: groom
description: Backlog grooming for Todo-vibe. Finds all issues in a bad state (unlabeled, unweighted, stale, missing acceptance criteria, needs decomposition) and fixes what it can automatically — applying obvious labels, flagging weights, and suggesting next actions for each. Use when asked to groom the backlog or clean up issues.
allowed-tools: Bash
model: sonnet
---

You are grooming the backlog for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for the ownership map and label taxonomy.

Your job is to find every issue in a bad state, fix what you can automatically, and output a clear action plan for what still needs human input.

## What "bad state" means

An issue is in a bad state if ANY of the following are true:
1. **Unlabeled** — missing `type:`, `area:`, `priority:`, or `risk:` label
2. **Unweighted** — no `Weight: <n>` in body or comments
3. **Unassigned** — no assignee set
4. **Missing acceptance criteria** — no "Acceptance Criteria" section or `- [ ]` checklist
5. **Stale in intake** — has no `priority:` label AND was created more than 7 days ago
6. **Needs decomposition** — has `needs-decomposition` label
7. **Missing description** — issue body is empty or under 20 characters

## Process

### Step 1 — Fetch all open issues
```bash
gh issue list --repo AntHanna23/Todo-vibe --state open \
  --json number,title,labels,assignees,body,createdAt --limit 100
```

### Step 2 — Classify each issue's problems

For each issue, check all 7 bad-state conditions. Build a list of issues grouped by severity:

- **Critical** — missing type + priority (can't be planned at all)
- **Incomplete** — has some labels but missing weight, assignee, or acceptance criteria
- **Stale** — sitting untouched > 7 days with no priority label
- **Oversized** — has `needs-decomposition`

### Step 3 — Auto-fix what you can

For issues where the fix is unambiguous from the title/body, apply it automatically:

**Auto-fixable:**
- If the title/body clearly indicates type (e.g. "Fix ...", "Add ...", "Refactor ...") → apply `type:` label
- If the title/body clearly indicates area (e.g. mentions "frontend", "docker", "pytest") → apply `area:` label
- If it's a `type: bug` with no priority → apply `priority: p2` as a safe default and note it
- If area is clear → assign the owner per ownership map from TEAM.md

For each auto-fix applied, run:
```bash
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "<label>"
```

**NOT auto-fixable (flag for human):**
- Weight (requires judgment)
- Acceptance criteria (requires domain knowledge)
- Priority for non-bugs (requires product input)
- Decomposition (requires scoping discussion)

### Step 4 — Output the grooming report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backlog Grooming — <today's date>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY
─────────────────────────────────────
  Total open issues:     <n>
  Healthy (sprint-ready): <n>
  Need attention:        <n>
  Auto-fixed this run:   <n>

🔴 CRITICAL — Can't be planned (missing type or priority)
─────────────────────────────────────
  #<n> — <title>
    Problems: <list>
    Auto-fixed: <what was applied, or "nothing — needs manual triage">
    Action: Run /triage <n>

🟡 INCOMPLETE — Partially labeled, missing weight/assignee/AC
─────────────────────────────────────
  #<n> — <title>
    Problems: <list>
    Auto-fixed: <what was applied>
    Action: <specific next step>

🟠 STALE — In intake > 7 days, no priority set
─────────────────────────────────────
  #<n> — <title> | Created: <date> (<n> days ago)
    Action: Prioritize or close as not-planned

🔵 OVERSIZED — needs-decomposition
─────────────────────────────────────
  #<n> — <title>
    Action: Break into child issues, then close this one

✅ HEALTHY — Sprint-ready or fully labeled
─────────────────────────────────────
  #<n> — <title> | <labels summary>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED NEXT ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. <most urgent action>
2. <second action>
3. <third action>
```

## Notes
- Be conservative with auto-fixes — only apply labels you are confident about from the issue content
- When in doubt, flag for human review rather than guessing
- After grooming, suggest running `/sprint-check` to see the updated sprint-ready count
- If $ARGUMENTS specifies a label or area, scope the grooming to only issues with that label

Scope filter: $ARGUMENTS
