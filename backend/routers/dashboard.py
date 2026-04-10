import asyncio
import os
import re
from datetime import datetime, timezone, timedelta

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_OWNER = os.environ.get("GITHUB_OWNER", "AntHanna23")
GITHUB_REPO  = os.environ.get("GITHUB_REPO",  "Todo-vibe")

TEAM = [
    {"name": "Anthony Hanna", "handle": "anthony-hanna", "capacity": 10},
    {"name": "Riley Chen",    "handle": "riley-chen",    "capacity": 12},
    {"name": "Sam Patel",     "handle": "sam-patel",     "capacity": 10},
    {"name": "Morgan Rivera", "handle": "morgan-rivera",  "capacity": 10},
    {"name": "Casey Morgan",  "handle": "casey-morgan",   "capacity": 10},
    {"name": "Jordan Blake",  "handle": "jordan-blake",   "capacity": 8},
]
TOTAL_CAPACITY = sum(m["capacity"] for m in TEAM)


def _headers():
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return h


def _extract_weight(body: str | None) -> int | None:
    if not body:
        return None
    m = re.search(r"\*{0,2}Weight:\*{0,2}\s*(\d+)", body, re.IGNORECASE)
    return int(m.group(1)) if m else None


def _label_names(labels: list) -> list[str]:
    return [l["name"] for l in labels]


def _has_label_prefix(labels: list[str], prefix: str) -> bool:
    return any(l.startswith(prefix) for l in labels)


def _owner_from_labels(labels: list[str]) -> str | None:
    for l in labels:
        if l.startswith("owner:"):
            return l.removeprefix("owner:").strip()
    return None


def _sprint_ready(labels: list[str], weight: int | None, body: str | None) -> bool:
    has_type     = _has_label_prefix(labels, "type:")
    has_area     = _has_label_prefix(labels, "area:")
    has_priority = _has_label_prefix(labels, "priority:")
    has_risk     = _has_label_prefix(labels, "risk:")
    has_ac       = bool(body and ("- [ ]" in body or "acceptance criteria" in body.lower()))
    has_weight   = weight is not None
    has_owner    = _has_label_prefix(labels, "owner:")
    no_block     = "needs-decomposition" not in labels and "approval-required" not in labels
    return all([has_type, has_area, has_priority, has_risk, has_ac, has_weight, has_owner, no_block])


def _days_left(due_on: str | None) -> int | None:
    if not due_on:
        return None
    due = datetime.fromisoformat(due_on.replace("Z", "+00:00"))
    return (due - datetime.now(timezone.utc)).days


def _is_recent(closed_at: str | None, days: int = 7) -> bool:
    if not closed_at:
        return False
    closed = datetime.fromisoformat(closed_at.replace("Z", "+00:00"))
    return (datetime.now(timezone.utc) - closed) <= timedelta(days=days)


def _is_stale(created_at: str, days: int = 7) -> bool:
    created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    return (datetime.now(timezone.utc) - created) >= timedelta(days=days)


def _milestone_health(ms: dict, ms_issues: list) -> dict:
    """Compute health score and indicators for a milestone."""
    open_issues   = [i for i in ms_issues if i["state"] == "open"]
    closed_issues = [i for i in ms_issues if i["state"] == "closed"]

    def _w(i): return _extract_weight(i.get("body")) or 0

    total_weight    = sum(_w(i) for i in ms_issues)
    delivered_weight = sum(_w(i) for i in closed_issues)
    velocity_pct    = round(delivered_weight / total_weight * 100) if total_weight else 0

    days_left = _days_left(ms.get("due_on"))
    at_risk   = False
    flags     = []

    # At risk if < 50% done with <= 5 days left
    if days_left is not None and days_left <= 5 and velocity_pct < 50 and open_issues:
        at_risk = True
        flags.append("Deadline approaching with low velocity")

    # At risk if overdue
    if days_left is not None and days_left < 0 and open_issues:
        at_risk = True
        flags.append(f"Overdue by {abs(days_left)}d with {len(open_issues)} open issues")

    # Unweighted issues
    unweighted = sum(1 for i in ms_issues if _extract_weight(i.get("body")) is None)
    if unweighted:
        flags.append(f"{unweighted} unweighted issue{'s' if unweighted > 1 else ''}")

    # No owner
    no_owner = sum(
        1 for i in open_issues
        if not _has_label_prefix(_label_names(i.get("labels", [])), "owner:")
    )
    if no_owner:
        flags.append(f"{no_owner} issue{'s' if no_owner > 1 else ''} without owner")

    # Health score: 100 − deductions
    score = velocity_pct
    if at_risk:
        score = max(score - 30, 0)

    # Status label
    if ms["state"] == "closed":
        status = "closed"
    elif not ms_issues:
        status = "empty"
    elif at_risk:
        status = "at-risk"
    elif velocity_pct >= 50:
        status = "on-track"
    else:
        status = "in-progress"

    # Owner breakdown for this milestone
    owner_map: dict[str, int] = {}
    for issue in open_issues:
        owner = _owner_from_labels(_label_names(issue.get("labels", [])))
        if owner:
            owner_map[owner] = owner_map.get(owner, 0) + (_w(issue))

    return {
        "number":           ms["number"],
        "title":            ms["title"],
        "description":      ms.get("description", ""),
        "state":            ms["state"],
        "due_on":           ms.get("due_on"),
        "days_left":        days_left,
        "open_count":       len(open_issues),
        "closed_count":     len(closed_issues),
        "total_count":      len(ms_issues),
        "total_weight":     total_weight,
        "delivered_weight": delivered_weight,
        "velocity_pct":     velocity_pct,
        "status":           status,
        "at_risk":          at_risk,
        "flags":            flags,
        "owner_breakdown":  [{"owner": k, "weight": v} for k, v in
                             sorted(owner_map.items(), key=lambda x: -x[1])],
        "url":              ms.get("html_url", ""),
    }


@router.get("/metrics")
async def get_metrics():
    if not GITHUB_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="GITHUB_TOKEN environment variable is not set on the backend.",
        )

    base = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
    h = _headers()

    async with httpx.AsyncClient(timeout=20) as client:
        open_resp, closed_resp, milestones_resp = await asyncio.gather(
            client.get(f"{base}/issues?state=open&per_page=100", headers=h),
            client.get(f"{base}/issues?state=closed&per_page=100", headers=h),
            client.get(f"{base}/milestones?state=all&per_page=50", headers=h),
        )

    for resp in (open_resp, closed_resp, milestones_resp):
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"GitHub API error: {resp.status_code}")

    open_issues   = [i for i in open_resp.json()   if "pull_request" not in i]
    closed_issues = [i for i in closed_resp.json() if "pull_request" not in i]
    all_issues    = open_issues + closed_issues
    milestones    = milestones_resp.json()

    # ── Active sprint (first open milestone with "Sprint" in title, else first open) ──
    sprint_ms = [m for m in milestones if m["state"] == "open" and "sprint" in m["title"].lower()]
    active_milestone = sprint_ms[0] if sprint_ms else (
        next((m for m in milestones if m["state"] == "open"), None)
    )

    sprint = None
    sprint_velocity_history = []

    if active_milestone:
        ms_id     = active_milestone["number"]
        ms_issues = [i for i in all_issues if i.get("milestone") and i["milestone"]["number"] == ms_id]
        ms_open   = [i for i in ms_issues if i["state"] == "open"]
        ms_closed = [i for i in ms_issues if i["state"] == "closed"]

        def _w(i): return _extract_weight(i.get("body")) or 0
        planned_w   = sum(_w(i) for i in ms_issues)
        delivered_w = sum(_w(i) for i in ms_closed)
        velocity_pct = round(delivered_w / planned_w * 100) if planned_w else 0

        sprint = {
            "name":          active_milestone["title"],
            "number":        ms_id,
            "due_on":        active_milestone.get("due_on"),
            "days_left":     _days_left(active_milestone.get("due_on")),
            "open_count":    len(ms_open),
            "closed_count":  len(ms_closed),
            "total_count":   len(ms_issues),
            "open_weight":   planned_w - delivered_w,
            "closed_weight": delivered_w,
            "total_weight":  planned_w,
            "velocity_pct":  velocity_pct,
            "url":           active_milestone.get("html_url", ""),
        }

    for ms in milestones:
        ms_issues   = [i for i in all_issues if i.get("milestone") and i["milestone"]["number"] == ms["number"]]
        planned_w   = sum((_extract_weight(i.get("body")) or 0) for i in ms_issues)
        delivered_w = sum((_extract_weight(i.get("body")) or 0) for i in ms_issues if i["state"] == "closed")
        sprint_velocity_history.append({
            "name":         ms["title"],
            "planned":      planned_w,
            "delivered":    delivered_w,
            "velocity_pct": round(delivered_w / planned_w * 100) if planned_w else 0,
        })

    # ── Milestone health (all milestones) ─────────────────────────────────────
    milestones_health = []
    for ms in milestones:
        ms_issues = [i for i in all_issues if i.get("milestone") and i["milestone"]["number"] == ms["number"]]
        milestones_health.append(_milestone_health(ms, ms_issues))

    # Sort: open first (at-risk → in-progress → on-track → empty), then closed
    status_order = {"at-risk": 0, "in-progress": 1, "on-track": 2, "empty": 3, "closed": 4}
    milestones_health.sort(key=lambda x: status_order.get(x["status"], 99))

    # ── Team load (owner: labels) ──────────────────────────────────────────────
    load_map: dict[str, dict] = {
        m["handle"]: {
            "name": m["name"], "handle": m["handle"], "capacity": m["capacity"],
            "assigned_weight": 0, "assigned_count": 0,
            "closed_weight": 0, "closed_count": 0,
        }
        for m in TEAM
    }
    unassigned_weight = 0
    unassigned_count  = 0

    for issue in all_issues:
        w     = _extract_weight(issue.get("body")) or 0
        owner = _owner_from_labels(_label_names(issue.get("labels", [])))
        if not owner:
            if issue["state"] == "open":
                unassigned_count += 1
                unassigned_weight += w
            continue
        if owner in load_map:
            if issue["state"] == "open":
                load_map[owner]["assigned_weight"] += w
                load_map[owner]["assigned_count"]  += 1
            else:
                load_map[owner]["closed_weight"] += w
                load_map[owner]["closed_count"]  += 1

    team_load = list(load_map.values())
    if unassigned_count:
        team_load.append({
            "name": "Unassigned", "handle": "", "capacity": 0,
            "assigned_weight": unassigned_weight, "assigned_count": unassigned_count,
            "closed_weight": 0, "closed_count": 0,
        })

    # ── Pipeline ──────────────────────────────────────────────────────────────
    done_this_week = 0
    in_progress    = 0
    sprint_ready   = 0
    needs_triage   = 0
    backlog        = 0

    for issue in open_issues:
        labels = _label_names(issue.get("labels", []))
        weight = _extract_weight(issue.get("body"))
        body   = issue.get("body", "")

        if "status: in-progress" in labels:
            in_progress += 1
        elif _sprint_ready(labels, weight, body):
            sprint_ready += 1
        elif _has_label_prefix(labels, "priority:"):
            needs_triage += 1
        else:
            backlog += 1

    for issue in closed_issues:
        if _is_recent(issue.get("closed_at")):
            done_this_week += 1

    pipeline = {
        "backlog": backlog, "needs_triage": needs_triage,
        "sprint_ready": sprint_ready, "in_progress": in_progress,
        "done_this_week": done_this_week,
    }

    # ── Breakdown ─────────────────────────────────────────────────────────────
    type_map:     dict[str, dict] = {}
    area_map:     dict[str, dict] = {}
    priority_map: dict[str, dict] = {}

    for issue in open_issues:
        labels = _label_names(issue.get("labels", []))
        w      = _extract_weight(issue.get("body")) or 0
        for label in labels:
            if label.startswith("type:"):
                key   = label.removeprefix("type:").strip()
                entry = type_map.setdefault(key, {"label": key, "count": 0, "weight": 0})
                entry["count"] += 1; entry["weight"] += w
            elif label.startswith("area:"):
                key   = label.removeprefix("area:").strip()
                entry = area_map.setdefault(key, {"label": key, "count": 0, "weight": 0})
                entry["count"] += 1; entry["weight"] += w
            elif label.startswith("priority:"):
                key   = label.removeprefix("priority:").strip()
                entry = priority_map.setdefault(key, {"label": key, "count": 0, "weight": 0})
                entry["count"] += 1; entry["weight"] += w

    # ── Backlog health ────────────────────────────────────────────────────────
    unlabeled = unweighted = no_owner_count = stale = needs_decomp = approval_req = p0_count = 0

    for issue in open_issues:
        labels = _label_names(issue.get("labels", []))
        weight = _extract_weight(issue.get("body"))
        if not labels:                                                   unlabeled += 1
        if weight is None:                                               unweighted += 1
        if not _has_label_prefix(labels, "owner:"):                     no_owner_count += 1
        if not _has_label_prefix(labels, "priority:") and _is_stale(issue["created_at"]): stale += 1
        if "needs-decomposition" in labels:                              needs_decomp += 1
        if "approval-required" in labels:                                approval_req += 1
        if "priority: p0" in labels:                                     p0_count += 1

    health = {
        "total_open": len(open_issues),
        "unlabeled": unlabeled, "unweighted": unweighted,
        "unassigned": no_owner_count, "stale": stale,
        "needs_decomposition": needs_decomp,
        "approval_required": approval_req, "p0_open": p0_count,
    }

    # ── Recent activity ───────────────────────────────────────────────────────
    recent_closed = [
        {
            "number": i["number"], "title": i["title"],
            "closed_at": i.get("closed_at"),
            "labels": _label_names(i.get("labels", [])),
            "url": i["html_url"],
        }
        for i in closed_issues if _is_recent(i.get("closed_at"))
    ][:10]

    return {
        "sprint":                  sprint,
        "sprint_velocity_history": sprint_velocity_history,
        "milestones_health":       milestones_health,
        "team_load":               team_load,
        "total_capacity":          TOTAL_CAPACITY,
        "pipeline":                pipeline,
        "breakdown": {
            "by_type":     sorted(type_map.values(),     key=lambda x: -x["weight"]),
            "by_area":     sorted(area_map.values(),     key=lambda x: -x["weight"]),
            "by_priority": sorted(priority_map.values(), key=lambda x: x["label"]),
        },
        "health":        health,
        "recent_closed": recent_closed,
    }
