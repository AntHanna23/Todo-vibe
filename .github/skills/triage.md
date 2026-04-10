# Triage Playbook

Use this when an issue needs to be classified, weighted, and assigned before it can enter a sprint.

---

## Step 1 — Read the issue

Use `mcp__github__issue_read` to fetch the issue. Note the title, body, and any existing labels.

Also fetch open issues to assess current team load:
Use `mcp__github__list_issues` with `state: OPEN` to see what's already assigned.

---

## Step 2 — Classify with labels

Apply exactly one from each group (see `copilot-instructions.md` for full taxonomy):

**Type:** `type: bug` · `type: feature` · `type: chore` · `type: refactor` · `type: spike`

**Area (one or more):** `area: frontend` · `area: api` · `area: backend` · `area: database` · `area: infra` · `area: build` · `area: testing` · `area: notifications` · `area: tags` · `area: reminders`

**Priority:** `priority: p0` · `priority: p1` · `priority: p2` · `priority: p3`

**Risk:** `risk: low` · `risk: medium` · `risk: high`

---

## Step 3 — Assign weight (Fibonacci: 1, 2, 3, 5, 8, 13)

- 1 area + risk: low → 1–3
- 2 areas OR risk: medium → 3–5
- 3+ areas OR risk: high → 5–13
- > 13 → add `needs-decomposition` instead

---

## Step 4 — Assign owner

Match area labels to the team ownership map in `copilot-instructions.md`. Express as an `owner:` label, not a GitHub assignee.

- `area: frontend` / `area: notifications` → `owner: riley-chen`
- `area: api` / `area: backend` / `area: database` / `area: reminders` / `area: tags` → `owner: sam-patel`
- `area: infra` / `area: build` → `owner: morgan-rivera`
- `area: testing` → `owner: casey-morgan`
- Multiple areas with different owners → `owner: jordan-blake`
- `risk: high` or `priority: p0` → add `approval-required` and flag Jordan Blake

---

## Step 5 — Validate enrichment

The issue body must contain:
- A clear problem statement or user story
- Acceptance criteria (at least 2 `- [ ]` checkboxes)
- Technical scope (which files/layers are affected)

If any are missing, note exactly what needs to be added.

---

## Step 6 — Apply and output

Since Copilot cannot directly apply labels, output this block for a human to apply:

```
⚠️ Apply manually in GitHub sidebar:
  Labels:    type: <x> | area: <x> | priority: <x> | risk: <x> | owner: <x>
  Milestone: <sprint or Backlog>
  Special:   <needs-decomposition / approval-required if applicable>

Add as a comment:
  **Weight:** <n> pts
```

Then output the triage summary:

```
Issue #<n>: <title>
─────────────────────────────────────
Type:       <x>
Area:       <x>
Priority:   <x>  (SLA: <target>)
Risk:       <x>
Weight:     <n> pts
Owner:      <name>
Reviewer:   <Jordan Blake / N/A>
Status:     <Intake | Enrichment needed | Sprint-Ready>
Blockers:   <list any missing info>
```

---

## Governance
- Never mark Sprint-Ready unless all 4 label types + owner + weight + AC are present
- p0 issues must be flagged immediately with `⚠️ P0 — escalate now`
- `risk: high` always requires `approval-required` label and Jordan Blake review
