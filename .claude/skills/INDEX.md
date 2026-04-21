# Skills Index

Read this file first. It tells you which file to read next based on what you are trying to do. Do not read TEAM.md unless a skill explicitly tells you to or you need team/ownership/capacity information.

## Skill Router

| Task | Skill File |
|------|-----------|
| Create a new issue or ticket | `create-issue/SKILL.md` |
| Triage an existing issue | `triage/SKILL.md` |
| Check if issues are sprint-ready | `sprint-check/SKILL.md` |
| Plan a sprint | `sprint-plan/SKILL.md` |
| Assign or rebalance workload | `assign/SKILL.md` |
| Run a standup or status report | `standup/SKILL.md` |
| Run a retrospective | `retro/SKILL.md` |
| Create a milestone or epic | `create-epic/SKILL.md` |
| Groom the backlog | `groom/SKILL.md` |
| Show metrics or delivery reports | `metrics/SKILL.md` |
| Track a release | `release-track/SKILL.md` |
| Generate release notes or changelog | `release-notes/SKILL.md` |

## Supporting Files (read only when needed)

| File | When to read it |
|------|----------------|
| `TEAM.md` | You need team member names, roles, area ownership, sprint capacity, or SLAs |

## Rules

- Always read this file first, then go directly to the relevant skill.
- Only read `TEAM.md` if the skill you are running references it or you need team/capacity data.
- Do not read all skill files — only the one that matches the task.

---

## Skill Descriptions

**create-issue** — Guides the model through gathering all required fields for a new issue: title, description, type, area, and acceptance criteria. Creates the ticket with initial labels and sets it to Intake status. Does not assign priority, risk, or weight — those are handled at triage.

**triage** — Takes an existing issue number and classifies it with the full label set (type, area, priority, risk), assigns a Fibonacci story point weight, and identifies the correct owner based on area. Validates that the issue has enough information to be sprint-ready and outputs a triage summary with any blockers.

**sprint-check** — Scans all open issues and reports which ones meet the sprint-ready criteria (labeled, weighted, assigned, acceptance criteria present) and which do not. Lists the specific blocker for each unready issue. Run this before sprint planning.

**sprint-plan** — Fills team capacity from the sprint-ready backlog in priority order. Creates the sprint milestone, assigns issues to it, and outputs the committed plan with per-person load and any deferred or unready items.

**assign** — Rebalances workload when someone is over capacity, out of office, or issues are unassigned. Respects the ownership map and current load per person. Can also handle bulk reassignment across a sprint.

**standup** — Generates an async standup or sprint status report from the current open issue state. Shows what is in progress, what is blocked, what was recently closed, and what is coming up next.

**retro** — Runs the end-of-sprint retrospective. Compares planned velocity against delivered, surfaces what slipped and why, flags any SLA breaches, and walks through the standard template (what went well, what did not, action items).

**create-epic** — Creates a new GitHub Milestone structured as an epic or strategic initiative. Uses a standard template that includes a goal statement, success criteria, and a target completion date.

**groom** — Audits the backlog for issues in a bad state: missing labels, missing weights, no acceptance criteria, stale without recent activity, or scoped too large for a single sprint. Fixes what it can automatically and flags the rest with specific next actions.

**metrics** — Generates a delivery report from the label data. Covers effort distribution by area and type, sprint velocity trends, per-person load, milestone health, and backlog composition. Useful for planning reviews and stakeholder updates.

**release-track** — Scans a milestone for release readiness. Checks issue completion, flags open blockers or high-risk items requiring sign-off, and reports whether the release is ready to ship, in progress, or blocked.

**release-notes** — Generates formatted release notes and a changelog entry from the closed issue set in a milestone. Categorizes issues by type, infers the semantic version bump, and produces output ready for GitHub Releases and CHANGELOG.md.
