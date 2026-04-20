---
name: release-notes
description: Generate release notes and a changelog entry for a Todo-vibe milestone or release. Summarizes closed issues by type and area, calls out breaking changes, and outputs a formatted document ready to paste into GitHub Releases or a CHANGELOG.md. Use when shipping a release or asked to write release notes.
allowed-tools: Bash, Read
model: sonnet
---

You are generating release notes and a changelog entry for the Todo-vibe project (repo: AntHanna23/Todo-vibe).

Refer to `.claude/skills/TEAM.md` for team context and ownership.

## Process

### Step 1 — Identify the release

If $ARGUMENTS names a milestone or version tag, use that. Otherwise list recent closed milestones:
```bash
gh api repos/AntHanna23/Todo-vibe/milestones?state=closed \
  --jq '.[] | {title: .title, closed: .closed_issues, due: .due_on}'
```

### Step 2 — Fetch all closed issues in the milestone

```bash
gh issue list --repo AntHanna23/Todo-vibe --milestone "<milestone name>" \
  --state closed --json number,title,labels,assignees,body,closedAt --limit 200
```

Also fetch the previous release tag for comparison context:
```bash
gh release list --repo AntHanna23/Todo-vibe --limit 5
```

### Step 3 — Categorize closed issues

Group by `type:` label:
- **Features** (`type: feature`) — new capabilities users will notice
- **Bug Fixes** (`type: bug`) — problems resolved
- **Performance / Refactors** (`type: refactor`) — internal improvements
- **Chores** (`type: chore`) — dependency updates, config, CI
- **Spikes** (`type: spike`) — research completed (only include if output is user-facing)

Within each group, sort by `priority:` (p0 first) then by area.

Flag any issues with `release: major` — these indicate breaking changes and must appear in a dedicated section.

### Step 4 — Determine version number

Use semantic versioning based on the release type label on the milestone's coordination issue:
- `release: major` → bump major (e.g. 1.0.0 → 2.0.0)
- `release: minor` → bump minor (e.g. 1.2.0 → 1.3.0)
- `release: patch` → bump patch (e.g. 1.2.3 → 1.2.4)

If no release type label exists, infer from the issue set: any `type: feature` → minor; only `type: bug` or `type: chore` → patch; any breaking change note in an issue body → major.

### Step 5 — Generate release notes

**GitHub Release format (for the Releases page):**

```markdown
## <version> — <release name / milestone title>

<1–2 sentence summary of what this release delivers>

### ⚠️ Breaking Changes
- #<n>: <title> — <brief description of what breaks and migration path>

### ✨ New Features
- #<n>: <title> (<area>)
- ...

### 🐛 Bug Fixes
- #<n>: <title> (<area>)
- ...

### 🔧 Improvements & Refactors
- #<n>: <title>
- ...

### 🧹 Chores & Maintenance
- #<n>: <title>
- ...

**Full changelog:** <previous tag>...<new tag>
```

**CHANGELOG.md entry format (for the repo file):**

```markdown
## [<version>] — <YYYY-MM-DD>

### Added
- <feature description> (#<n>)

### Fixed
- <bug description> (#<n>)

### Changed
- <refactor or improvement> (#<n>)

### Removed / Breaking
- <breaking change description> (#<n>)
```

### Step 6 — Output both formats

Print the GitHub Release format first, then the CHANGELOG.md entry. Include a note at the end:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To publish this release:
  1. Create a git tag:  git tag v<version>
  2. Push the tag:      git push origin v<version>
  3. Create the GitHub release:
     gh release create v<version> --title "<version> — <name>" --notes "<paste GitHub Release format above>"
  4. Append the CHANGELOG.md entry to the top of CHANGELOG.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Notes
- Omit chores from the GitHub Releases page if there are more than 3 — they clutter the user-facing notes. Keep them in CHANGELOG.md.
- Never include issues that were closed as "won't fix" or "duplicate" — check the issue body for these signals
- If the milestone has open issues, warn that release notes are incomplete and list the open items

Release / milestone to document: $ARGUMENTS
