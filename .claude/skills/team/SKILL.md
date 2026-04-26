# Todo-vibe Team Reference

## Team Members

| Name | Role | GitHub Handle | Sprint Capacity (pts) | Owned Areas |
|------|------|---------------|----------------------|-------------|
| Anthony Hanna | Product Owner / DevOps | AntHanna23 | 10 | area: infra, area: build |
| Riley Chen | Frontend Engineer | riley-chen | 12 | area: frontend, area: notifications |
| Sam Patel | Backend Engineer | sam-patel | 10 | area: api, area: backend, area: database, area: reminders, area: tags |
| Morgan Rivera | Platform Engineer | morgan-rivera | 10 | area: infra, area: build |
| Casey Morgan | QA Engineer | casey-morgan | 10 | area: testing |
| Jordan Blake | Tech Lead | jordan-blake | 8 | All (reviewer for risk: high / priority: p0) |

**Total sprint capacity: 60 pts**

## Ownership Map

When triaging, assign the primary owner based on area labels:
- `area: frontend` or `area: notifications` → **Riley Chen**
- `area: api`, `area: backend`, `area: database`, `area: reminders`, `area: tags` → **Sam Patel**
- `area: infra` or `area: build` → **Morgan Rivera**
- `area: testing` → **Casey Morgan**
- Multiple areas spanning different owners → **Jordan Blake** (Tech Lead)
- `risk: high` or `priority: p0` → always add **Jordan Blake** as reviewer

## Sprint Cadence

- Sprint length: 2 weeks
- Sprint planning: Monday of week 1
- Sprint review + retro: Friday of week 2
- Standup: daily async (GitHub issues + this tool)

## Velocity Targets

- Target sprint velocity: 40–50 pts (buffer for unplanned work)
- Max per-person load: their capacity (see table above)
- Issues with weight > 13 must be decomposed before entering a sprint

## Model Selection

Use the right model for the task:

| Model | Use for |
|-------|---------|
| **Sonnet** | Data fetching, formatting, reporting, straightforward triage, workload calculations — tasks where speed and cost matter more than deep reasoning |
| **Opus** | Complex planning decisions, writing acceptance criteria, multi-step capacity reasoning, retrospective analysis, anything where output quality directly affects the team — tasks where getting it right matters more than speed |

When in doubt: if the skill is primarily *reading and formatting data* → Sonnet. If it's *making judgment calls or producing artifacts the team will act on* → Opus.

## GitHub Copilot

When any skill or workflow needs to interact with GitHub Copilot (assign to issue, request review, check job status), **always use the MCP server tools** — do NOT use the `gh copilot` CLI or `gh` commands for Copilot operations. The MCP tools are:

- `mcp__github__assign_copilot_to_issue` — assign Copilot to work on an issue
- `mcp__github__create_pull_request_with_copilot` — open a PR with Copilot
- `mcp__github__request_copilot_review` — request a Copilot code review on a PR
- `mcp__github__get_copilot_job_status` — check the status of a Copilot job

The `gh copilot` CLI is not available in this environment. The MCP server is the only supported path for Copilot integration.

## Priority SLA (time to resolution)

| Priority | Target Resolution |
|----------|------------------|
| p0 | Same day — all hands |
| p1 | Within current sprint |
| p2 | Within 2 sprints |
| p3 | Backlog, best effort |
