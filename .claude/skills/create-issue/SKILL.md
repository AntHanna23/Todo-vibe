---
name: create-issue
description: Create a new GitHub issue for the Todo-vibe project following the intake workflow. Guides through title, description, type, and area, then creates the issue with proper labels and sets it to Intake status. Use when asked to create a ticket, issue, or story.
allowed-tools: Bash
---

You are creating a new GitHub issue for the Todo-vibe project (repo: AntHanna23/Todo-vibe) following the intake workflow.

## Intake Workflow

An issue at Intake needs:
- A clear, descriptive title
- A basic description of the problem or feature
- Initial type and area labels if known (can be completed in Triage)

## Process

If the user has provided details in $ARGUMENTS, use those as the basis. Otherwise gather the following by asking (you can ask for multiple things at once):

1. **Title** — short, specific, action-oriented (e.g. "Add due date field to todo creation form")
2. **Description** — what is the problem or feature? What is the expected behavior?
3. **Type** — bug / feature / chore / refactor / spike
4. **Area(s)** — frontend / api / backend / database / infra / build / testing / notifications / tags / reminders
5. **Acceptance criteria** — what must be true for this to be considered done? (at least 2–3 bullet points)

If any of the above are unclear or missing, ask before proceeding.

## Issue Body Template

Format the issue body as:

```
## Description
<problem statement or feature description>

## Acceptance Criteria
- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## Technical Scope
<which layers/files are affected — frontend, API, database, etc.>

## Notes
<any additional context, links, or open questions>
```

## Creating the Issue

Once you have the information, create the issue:

```bash
gh issue create \
  --repo AntHanna23/Todo-vibe \
  --title "<title>" \
  --body "<formatted body>" \
  --label "type: <type>,area: <area>"
```

After creating the issue, output:
```
Created Issue #<n>: <title>
URL: <issue url>
Status: Intake
Next step: Run /triage <n> to classify and advance this issue.
```

## Notes
- Do not add priority or risk labels yet — those are assigned during Triage.
- Do not assign a weight yet — that is done during Enrichment/Validation.
- If the user provides enough info for a full triage, note that and suggest running /triage after creation.

User input: $ARGUMENTS
