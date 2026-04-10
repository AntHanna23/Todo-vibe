---
name: triage
description: Triage a GitHub issue for the Todo-vibe project. Classifies the issue with correct labels, assigns a Fibonacci weight, identifies the correct assignee, and advances it through the PM workflow. Use when given an issue number or asked to triage a ticket.
allowed-tools: Bash, Read
model: opus
---

You are performing AI-assisted issue triage for the Todo-vibe project (GitHub repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for the team roster, ownership map, capacity, and SLAs.

The user will provide an issue number, or you should ask for one if not given.

## Your Triage Process

### Step 1 — Fetch the issue and current team load
Run in parallel:
```bash
gh issue view <number> --repo AntHanna23/Todo-vibe

# Check existing open issues to assess per-person load
gh issue list --repo AntHanna23/Todo-vibe --state open --json number,title,labels,assignees --limit 50
```

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
- `priority: p0` — blocker / data loss / app broken (SLA: same day)
- `priority: p1` — high impact, urgent (SLA: current sprint)
- `priority: p2` — normal priority (SLA: within 2 sprints)
- `priority: p3` — low priority / polish (SLA: backlog, best effort)

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

### Step 4 — Assign owner (capacity-aware)

Use the ownership map from TEAM.md. Before assigning, check the current open issue list from Step 1:
- Count in-progress or assigned issues per person
- If the natural owner already has issues totalling their sprint capacity, flag this as a load concern and suggest Jordan Blake as fallback or note it as a planning risk
- Add Jordan Blake as reviewer for `risk: high` or `priority: p0`

### Step 5 — Validate enrichment

Check that the issue body contains:
- A clear problem statement or user story
- Acceptance criteria (at least 2 bullet points)
- Technical scope (which layers are affected)

If any of these are missing, note what needs to be added before the issue can advance.

### Step 6 — Apply labels via gh CLI

```bash
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "<label1>,<label2>,..."
```

Also add the owner label and a `Weight: <n>` comment:
```bash
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "owner: <handle>"
gh issue comment <number> --repo AntHanna23/Todo-vibe --body "**Weight:** <n> pts"
```

### Step 7 — Output triage summary

```
Issue #<n>: <title>
─────────────────────────────────────
Labels:     type: <x> | area: <x> | priority: <x> | risk: <x>
Weight:     <n> pts
Assignee:   <name> (<current load> pts already assigned this sprint)
Reviewer:   <name or N/A>
Priority SLA: <target resolution based on priority>
Status:     <Intake | Triage | Enrichment needed | Validation needed | Sprint-Ready>
Blockers:   <list any missing info, decomposition needed, or capacity concerns>
```

If the issue is fully enriched and valid, state that it is ready to advance to **Sprint-Ready**.
If enrichment is missing, state exactly what is needed.

## Governance Rules
- Do not skip workflow stages.
- Do not mark Sprint-Ready unless: all 4 label types present, weight assigned, assignee set, acceptance criteria defined, no `needs-decomposition`.
- If `risk: high` or `priority: p0`, always flag for Tech Lead (Jordan Blake) review.
- p0 issues must be flagged immediately — note "⚠️ P0 — escalate now" in the summary.

The issue number to triage is: $ARGUMENTS
