# Contributing to Todo-vibe

Thank you for contributing! Please read these guidelines before opening issues or pull requests.

---

## Issue Routing Rules

> **Every issue must have an Assignee and a Milestone set.**
> Without these, issues cannot be reliably added to the project board or sprint-planned.

| Field | Rule | Default |
|-------|------|---------|
| **Milestone** | Required on every issue | `Backlog` |
| **Assignee** | Required on every issue | `AntHanna23` |

### Why this matters

The project board pulls issues by milestone and assignee. An issue with neither set will be invisible to sprint planning and will silently miss every triage pass.

### The `Backlog` milestone

`Backlog` is the default holding area for all new work that has not yet been assigned to a sprint. If it does not appear in the milestone dropdown, ask a maintainer to create it in **GitHub → Issues → Milestones → New milestone**.

---

## Creating Issues

Use the issue templates provided in this repository:

- **Feature Request** — for new features or enhancements
- **Bug Report** — for bugs and unexpected behavior

Both templates include guided fields for **Milestone** and **Assignee** and remind you to fill in the GitHub sidebar fields before submitting.

### Using Copilot / AI to create issues

When using Copilot or any AI assistant to draft or create issues:

1. Always specify **Milestone: Backlog** (or the target sprint milestone).
2. Always specify **Assignee: AntHanna23** (or the appropriate person).
3. Apply at minimum a `type:` label (`type: feature`, `type: bug`, etc.) and an `area:` label.

This ensures issues are immediately routable when they land.

---

## Issue Lifecycle

```
Intake → Triage → In Progress → Review → Done
```

- **Intake** — issue created; needs labels + weight
- **Triage** — labels, weight, assignee, and milestone confirmed
- **In Progress** — actively being worked on
- **Review** — PR open, awaiting review
- **Done** — merged and closed

After creating an issue, run `/triage <number>` (Copilot skill) to classify and advance it.

---

## Labels

| Prefix | Examples |
|--------|---------|
| `type:` | `type: feature`, `type: bug`, `type: chore` |
| `area:` | `area: frontend`, `area: api`, `area: backend` |
| `priority:` | `priority: high`, `priority: medium`, `priority: low` |
| `risk:` | `risk: high`, `risk: low` |

---

## Pull Requests

- Reference the issue your PR closes: `Closes #<n>`
- Keep PRs focused — one issue per PR when possible
- Ensure existing tests pass before requesting review
