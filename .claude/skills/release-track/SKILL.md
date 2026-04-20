---
name: release-track
description: Track an upcoming or active release for Todo-vibe. Scans issues and milestones for release-labeled work, checks completion status, flags blockers, and summarizes release health. Use when asked about a release, what's in a release, or whether a release is ready to ship.
allowed-tools: Bash, Read
model: sonnet
---

You are tracking the release health for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for team context, ownership, and sprint cadence.

## Release Label Taxonomy

**Release type (applied to the release milestone and relevant issues):**
- `release: patch` — bug fixes only, no new features
- `release: minor` — new features, backward compatible
- `release: major` — breaking changes, schema migrations, or API contract changes
- `release: candidate` — issues or the milestone is in final validation before ship

**Workflow label:**
- `type: release` — applied to the release coordination issue (the tracking ticket)

## Process

### Step 1 — Identify the release

If $ARGUMENTS names a release or milestone, use that. Otherwise list open milestones and ask the user which to track:
```bash
gh api repos/AntHanna23/Todo-vibe/milestones --jq '.[] | {title: .title, open: .open_issues, closed: .closed_issues, due: .due_on}'
```

### Step 2 — Fetch all issues in the milestone

```bash
gh issue list --repo AntHanna23/Todo-vibe --milestone "<milestone name>" \
  --state all --json number,title,state,labels,assignees,body --limit 100
```

### Step 3 — Assess release health

For each open issue in the milestone, check:
- Is it sprint-ready? (all four label types, weight, assignee, acceptance criteria)
- Is it in progress or blocked?
- Is it a `release: candidate` item that needs sign-off?
- Does it carry `risk: high` or `approval-required`?

Calculate:
- Total issues in milestone
- Closed (done)
- Open (remaining)
- Blocked or flagged
- % complete by count and by weight

### Step 4 — Determine release readiness

A release is ready to ship when:
1. All issues in the milestone are closed OR explicitly deferred to a future milestone
2. No open `risk: high` issues remain without Tech Lead sign-off
3. No `approval-required` issues remain unresolved
4. The release coordination issue (`type: release`) is present and its acceptance criteria are met

### Step 5 — Apply or recommend label updates

If the release is entering final validation, recommend adding `release: candidate` to the milestone's tracking issue and key open items.

To update a label:
```bash
gh issue edit <number> --repo AntHanna23/Todo-vibe --add-label "release: candidate"
```

### Step 6 — Output release health report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Release Tracker: <milestone name>
Due: <due date or "no due date set">
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 RELEASE TYPE
  <patch | minor | major | candidate>

📊 COMPLETION
  <closed> / <total> issues closed  (<pct>%)
  Weight delivered: <closed weight> / <total weight> pts

✅ CLOSED
  #<n> — <title>
  ...

🔄 OPEN
  #<n> — <title> | <assignee> | <priority> | Weight: <w> | <status>
  ...

⚠️ BLOCKERS / FLAGS
  #<n> — <title> | <reason: risk: high / approval-required / missing sign-off>

🚦 RELEASE STATUS
  <READY TO SHIP | IN PROGRESS | BLOCKED — <reason> | NOT STARTED>

📋 NEXT ACTIONS
  - <action 1>
  - <action 2>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Notes
- Every release should have a coordination issue with `type: release` and the appropriate `release: <type>` label
- That coordination issue should include acceptance criteria covering: all issues closed, changelog drafted, tag created, deployment verified
- If no coordination issue exists, suggest creating one via /create-issue
- For major releases, flag that a /release-notes run should precede the ship decision

Release to track: $ARGUMENTS
