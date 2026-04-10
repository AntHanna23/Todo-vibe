---
name: create-epic
description: Create a new GitHub Milestone (Epic) for the Todo-vibe project using the required template structure. Use when asked to create an epic, milestone, or strategic initiative.
allowed-tools: Bash
model: opus
---

You are creating a new GitHub Milestone (Epic) for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

In this project, Milestones represent Epics — strategic containers for a set of related issues that together deliver a measurable outcome.

## Milestone Rules

Milestones (Epics):
- Represent a strategic initiative spanning multiple issues
- May span multiple sprints
- Do NOT get weights, sprint assignments, or implementation details
- Are the source of truth for objective, scope, and acceptance criteria

## Process

If $ARGUMENTS provides a description, use it as a starting point. Otherwise, gather the following (you can ask for multiple things at once):

1. **Title** — short, outcome-focused (e.g. "Core CRUD MVP", "Reminder System", "k3s Deployment")
2. **Objective** — what strategic goal does this epic accomplish?
3. **Acceptance criteria** — what must be true for this to be done? (measurable, verifiable)
4. **Success metrics** — how will you measure success? (performance, test coverage, UX, etc.)
5. **In scope** — what work is included?
6. **Out of scope** — what is explicitly excluded?
7. **Decomposition plan** — what are the expected child issues/workstreams? (high-level list)
8. **Risks & dependencies** — known risks, sequencing constraints, or external dependencies
9. **Due date** — optional target date (YYYY-MM-DD format)

## Milestone Description Template

Format the milestone description as:

```
## Objective
<what strategic goal does this milestone accomplish>

## Acceptance Criteria
- <criterion 1>
- <criterion 2>
- <criterion 3>

## Success Metrics
- <metric 1>
- <metric 2>

## In Scope
- <item 1>
- <item 2>

## Out of Scope
- <item 1>
- <item 2>

## Decomposition Plan
- Issue: <workstream 1>
- Issue: <workstream 2>
- Issue: <workstream 3>

## Proof of Concept (if applicable)
<POC scope and validation criteria, or N/A>

## Risks & Dependencies
- <risk or dependency 1>
- <risk or dependency 2>
```

## Creating the Milestone

```bash
gh api repos/AntHanna23/Todo-vibe/milestones \
  --method POST \
  --field title="<title>" \
  --field description="<formatted description>" \
  --field due_on="<YYYY-MM-DDT00:00:00Z or omit if no date>"
```

After creating, output:
```
Created Epic (Milestone): <title>
URL: <milestone url>
Child issues to create: <list from decomposition plan>

Next steps:
1. Create child issues using /create-issue
2. Link each issue to this milestone: gh issue edit <n> --repo AntHanna23/Todo-vibe --milestone "<title>"
3. Run /triage on each issue to classify and advance through workflow
```

## Governance Checks

Before creating, validate:
- The epic is not too broad (if decomposition plan has more than 20 items, suggest splitting into multiple milestones)
- The epic has measurable acceptance criteria (not vague goals)
- The epic is distinct from existing milestones (check: `gh api repos/AntHanna23/Todo-vibe/milestones`)

User input: $ARGUMENTS
