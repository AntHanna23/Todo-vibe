# Todo-vibe — Copilot Instructions

You are an AI assistant helping develop and manage the **Todo-vibe** project (AntHanna23/Todo-vibe) — a full-stack personal todo app built with React + FastAPI + SQLite, designed to run on k3s and integrate with Home Assistant.

---

## Critical Rules

### GitHub Operations
**NEVER use the `gh` CLI for any GitHub operations.** Use the MCP server tools exclusively:
- Create/update issues → `mcp__github__issue_write`
- Read issues → `mcp__github__issue_read`
- List issues → `mcp__github__list_issues`
- Add comments → `mcp__github__add_issue_comment`
- Create PRs → `mcp__github__create_pull_request`
- Assign Copilot to an issue → `mcp__github__assign_copilot_to_issue`
- Request Copilot review → `mcp__github__request_copilot_review`
- Check Copilot job status → `mcp__github__get_copilot_job_status`

### What Copilot Cannot Do Directly
When you cannot directly apply a label, set a milestone, or assign an owner, **suggest the correct values clearly** so a human can apply them. Format your suggestions like:

```
⚠️ Apply manually in the GitHub sidebar:
  Labels:    type: feature | area: frontend | priority: p2 | risk: low | owner: riley-chen
  Milestone: Sprint 2: Quality & Testing
  Weight:    3 pts (add as comment: "**Weight:** 3 pts")
```

---

## Project Overview

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| Database | SQLite via SQLAlchemy |
| Deployment | k3s (single-node) |
| Testing | pytest |

Repo layout:
- `backend/` — FastAPI app, routers, models, schemas
- `frontend/src/` — React components, api.js
- `.github/skills/` — PM workflow playbooks (see below)
- `k8s/` — Kubernetes manifests (planned)

---

## Team & Ownership

| Person | Handle | Role | Owns | Capacity |
|--------|--------|------|------|----------|
| Anthony Hanna | anthony-hanna | Product Owner / DevOps | infra, build | 10 pts |
| Riley Chen | riley-chen | Frontend Engineer | frontend, notifications | 12 pts |
| Sam Patel | sam-patel | Backend Engineer | api, backend, database, reminders, tags | 10 pts |
| Morgan Rivera | morgan-rivera | Platform Engineer | infra, build | 10 pts |
| Casey Morgan | casey-morgan | QA Engineer | testing | 10 pts |
| Jordan Blake | jordan-blake | Tech Lead | all (escalation, risk: high, priority: p0) | 8 pts |

**Owner assignment rule:** Match the issue's `area:` labels to the ownership table above. Cross-area issues go to Jordan Blake. Always express ownership as an `owner:` label (e.g. `owner: riley-chen`), NOT as a GitHub assignee.

---

## Label Taxonomy

Every issue must have exactly one label from each of these four groups before it is sprint-ready:

### Type (pick one)
| Label | When to use |
|-------|-------------|
| `type: bug` | Something is broken |
| `type: feature` | New functionality |
| `type: chore` | Maintenance, config, dependency updates |
| `type: refactor` | Code restructuring with no behavior change |
| `type: spike` | Research or investigation |

### Area (pick one or more)
`area: frontend` · `area: api` · `area: backend` · `area: database` · `area: infra` · `area: build` · `area: testing` · `area: notifications` · `area: tags` · `area: reminders`

### Priority (pick one)
| Label | SLA |
|-------|-----|
| `priority: p0` | Same day — blocker / data loss |
| `priority: p1` | Current sprint — high impact |
| `priority: p2` | Within 2 sprints — normal |
| `priority: p3` | Backlog — low / polish |

### Risk (pick one)
| Label | Meaning |
|-------|---------|
| `risk: low` | Single area, well-understood, minimal regression risk |
| `risk: medium` | Cross-file, needs testing, some uncertainty |
| `risk: high` | Cross-cutting, production impact → requires Jordan Blake review |

### Special labels
- `owner: <handle>` — who owns this issue (required before sprint)
- `needs-decomposition` — weight > 13 or scope unclear
- `approval-required` — risk: high or priority: p0
- `status: in-progress` — actively being worked
- `status: review` — in code review
- `status: blocked` — waiting on external dependency

---

## Issue Weight (Fibonacci)

Every issue needs a weight comment before it can enter a sprint. Add as a comment:
```
**Weight:** <n> pts
```

Sizing guide:
- 1 area + risk: low → 1–3 pts
- 2 areas OR risk: medium → 3–5 pts
- 3+ areas OR risk: high → 5–13 pts
- > 13 pts → add `needs-decomposition`

---

## Sprint-Ready Checklist

An issue is sprint-ready when ALL of the following are true:
- [ ] Has `type:` label
- [ ] Has `area:` label
- [ ] Has `priority:` label
- [ ] Has `risk:` label
- [ ] Has `owner:` label
- [ ] Has `**Weight:** <n> pts` comment
- [ ] Has Acceptance Criteria in the body
- [ ] NOT labeled `needs-decomposition` or `approval-required`

---

## PM Workflow Playbooks

Detailed step-by-step playbooks are in `.github/skills/`:

| Playbook | File | When to use |
|----------|------|-------------|
| Triage an issue | `.github/skills/triage.md` | When an issue needs labels, weight, owner |
| Create an issue | `.github/skills/create-issue.md` | When creating a new ticket from a description |
| Sprint planning | `.github/skills/sprint-plan.md` | When starting a new sprint |
| Sprint readiness | `.github/skills/sprint-check.md` | When reviewing what's ready to pull in |
| Standup report | `.github/skills/standup.md` | For daily/weekly status |
| Metrics report | `.github/skills/metrics.md` | For velocity, load, and breakdown data |
| Backlog grooming | `.github/skills/groom.md` | To clean up unlabeled/unweighted issues |
| Workload rebalance | `.github/skills/assign.md` | When someone is OOO or over capacity |
| Sprint retro | `.github/skills/retro.md` | End of sprint review |
| Create epic | `.github/skills/create-epic.md` | For new milestones/strategic initiatives |

---

## Architecture Constraints (non-goals — do not implement)
- No authentication
- No multi-tenant features
- No nested/sub-tasks
- No mobile-native components
