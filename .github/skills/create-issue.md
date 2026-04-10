# Create Issue Playbook

Use this when creating a new GitHub issue from a user description or feature request.

---

## Step 1 — Extract from the description

From the user's input, derive:
1. **Title** — short, action-oriented (e.g. "Add snooze option for reminders")
2. **Type** — bug / feature / chore / refactor / spike
3. **Area(s)** — which parts of the codebase are touched
4. **Description** — problem statement or user story
5. **Acceptance Criteria** — at least 2–3 specific, testable `- [ ]` checkboxes
6. **Technical Scope** — which files/layers are affected

If any are unclear, ask before proceeding.

---

## Step 2 — Create the issue

Use `mcp__github__issue_write` with `method: create`:

```
owner: AntHanna23
repo: Todo-vibe
title: <title>
body: (see template below)
labels: ["type: <type>", "area: <area>"]
```

**Body template:**
```markdown
## Description
<problem statement or user story>

## Acceptance Criteria
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## Technical Scope
<which layers/files are affected>

## Notes
<any extra context, open questions, or dependencies>
```

---

## Step 3 — Suggest triage metadata

Since Copilot cannot directly set milestone, owner label, or weight, output this block:

```
⚠️ Apply manually in GitHub sidebar:
  Labels:    type: <type> | area: <area>
  Milestone: Backlog  (change to sprint once triaged)

Add as a comment once triaged:
  owner: <handle>  (as a label)
  **Weight:** <n> pts
```

---

## Step 4 — Output confirmation

```
Created Issue #<n>: <title>
URL: https://github.com/AntHanna23/Todo-vibe/issues/<n>
Status: Intake
Next step: Run the triage playbook (.github/skills/triage.md) to classify and advance.
```

---

## Notes
- Do NOT add priority or risk labels at creation — those are set during triage
- Do NOT add weight at creation — set during triage
- If the description is rich enough to fully triage, note it and suggest running triage immediately after
