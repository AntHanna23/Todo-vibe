---
name: triage
description: Triage a GitHub issue for the Todo-vibe project. Classifies the issue with correct labels, assigns a Fibonacci weight, identifies the correct assignee, and advances it through the PM workflow. Use when given an issue number or asked to triage a ticket.
allowed-tools: Bash, Read
---

You are performing AI-assisted issue triage for the Todo-vibe project (GitHub repo: AntHanna23/Todo-vibe).

The user will provide an issue number, or you should ask for one if not given.

## Your Triage Process

### Step 1 — Fetch the issue
Run: `gh issue view <number> --repo AntHanna23/Todo-vibe`

### Step 2 — Classify using the Label Taxonomy

**TYPE (pick exactly one):**
- `type: bug` — something is broken
- `type: feature` — new functionality
- `type: chore` — maintenance, config, dependency
- `type: refactor` — restructuring without behavior change
- `type: spike` — research or investigation
- `type: epic` — strategic initiative (use `create-epic` skill instead)

**AREA (pick one or more):**
- `area: frontend` — React components, UI logic, styling
- `area: api` — FastAPI endpoints, request/response
- `area: backend` — business logic, services, validation
- `area: database` — SQLite schema, migrations, models
- `area: infra` — k3s manifests, Dockerfiles, deployment
- `area: build` — container builds, CI
- `area: testing` — pytest, integration tests
- `area: notifications` — browser notification system
- `area: tags` — tag management feature
- `area: reminders` — reminder data model and API

**PRIORITY (pick exactly one):**
- `priority: p0` — blocker / data loss / app broken
- `priority: p1` — high impact, urgent
- `priority: p2` — normal priority
- `priority: p3` — low priority / polish

**RISK (pick exactly one):**
- `risk: low` — single area, well-understood, minimal regression risk
- `risk: medium` — cross-file, needs testing, some uncertainty
- `risk: high` — cross-cutting, production impact, requires Tech Lead review

**Special labels (add if applicable):**
- `needs-decomposition` — issue is too large (weight > 13 or unclear scope)
- `approval-required` — risk: high or priority: p0

### Step 3 — Assign weight (Fibonacci: 1, 2, 3, 5, 8, 13)

Use this logic:
- 1 area + risk: low → weight 1–3
- 2 areas OR risk: medium → weight 3–5
- 3+ areas OR risk: high → weight 5–13
- If uncertain → pick next higher Fibonacci value
- If > 13 → add `needs-decomposition`

### Step 4 — Assign owner

Ownership map:
- `area: frontend` or `area: notifications` → Riley Chen
- `area: api`, `area: backend`, `area: database`, `area: reminders`, `area: tags` → Sam Patel
- `area: infra` or `area: build` → Morgan Rivera
- `area: testing` → Casey Morgan
- Multiple areas with different owners → Jordan Blake (Tech Lead)
- `risk: high` or `priority: p0` → add Jordan Blake as reviewer

### Step 5 — Validate enrichment

Check that the issue body contains:
- A clear problem statement or user story
- Acceptance criteria
- Technical scope (which layers are affected)

If any of these are missing, note what needs to be added before the issue can advance.

### Step 6 — Apply labels via gh CLI

Run:
```
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "<label1>,<label2>,..."
```

### Step 7 — Output triage summary

Present a structured summary:
```
Issue #<n>: <title>
─────────────────────────────────────
Labels:     type: <x> | area: <x> | priority: <x> | risk: <x>
Weight:     <n>
Assignee:   <name>
Reviewer:   <name or N/A>
Status:     <Triage | Enrichment needed | Validation needed>
Blockers:   <list any missing info or decomposition needed>
```

If the issue is fully enriched and valid, state that it is ready to advance to **Validation**.
If enrichment is missing, state what is needed before it can advance.

## Governance Rules
- Do not skip workflow stages.
- Do not mark Sprint-Ready unless: all 4 label types present, weight assigned, assignee set, acceptance criteria defined, no `needs-decomposition`.
- If `risk: high` or `priority: p0`, always flag for Tech Lead (Jordan Blake) review.

The issue number to triage is: $ARGUMENTS
