---
name: create-issue
description: Create a new GitHub issue for the Todo-vibe project following the intake workflow. Guides through title, description, type, and area, then creates the issue with proper labels and sets it to Intake status. Use when asked to create a ticket, issue, or story.
allowed-tools: Bash
model: opus
---

You are creating a new GitHub issue for the Todo-vibe project (repo: AntHanna23/Todo-vibe) following the intake workflow.

## Intake Workflow

An issue at Intake needs:
- A clear, descriptive title
- A basic description of the problem or feature
- Initial type and area labels if known (can be completed in Triage)
- A **Milestone** (default: `Backlog`) — required for project routing
- An **Assignee** (default: `AntHanna23`) — required for project routing

> **Routing rule:** Every issue must have a Milestone and an Assignee so it can be added to the project board. Without these, issues are invisible to sprint planning. Always suggest `Backlog` as the milestone and `AntHanna23` as the assignee unless told otherwise.

## Process

If the user has provided details in $ARGUMENTS, use those as the basis. Otherwise gather the following by asking (you can ask for multiple things at once):

1. **Title** — short, specific, action-oriented (e.g. "Add due date field to todo creation form")
2. **Description** — what is the problem or feature? What is the expected behavior?
3. **Type** — bug / feature / chore / refactor / spike
4. **Area(s)** — frontend / api / backend / database / infra / build / testing / notifications / tags / reminders
5. **Acceptance criteria** — what must be true for this to be considered done? (at least 2–3 bullet points)
6. **Milestone** — which milestone? Default: `Backlog`. Always suggest this unless the user specifies otherwise.
7. **Assignee** — who owns this? Default: `AntHanna23`. Always suggest this unless the user specifies otherwise.

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
  --label "type: <type>,area: <area>" \
  --assignee "<assignee, default: AntHanna23>" \
  --milestone "<milestone, default: Backlog>"
```

If the `Backlog` milestone does not exist, the `--milestone` flag will fail. In that case, create the issue without it and note in the output that a maintainer must create the `Backlog` milestone at https://github.com/AntHanna23/Todo-vibe/milestones/new.

After creating the issue, output:
```
Created Issue #<n>: <title>
URL: <issue url>
Milestone: <milestone>
Assignee: <assignee>
Status: Intake
Next step: Run /triage <n> to classify and advance this issue.
```

## Notes
- Do not add priority or risk labels yet — those are assigned during Triage.
- Do not assign a weight yet — that is done during Enrichment/Validation.
- **Always** set milestone (`Backlog` by default) and assignee (`AntHanna23` by default). These are required for project routing.
- If the user provides enough info for a full triage, note that and suggest running /triage after creation.

User input: $ARGUMENTS
