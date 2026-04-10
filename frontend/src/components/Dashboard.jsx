import { useEffect, useState } from 'react'
import { api } from '../api'

// ── Helpers ────────────────────────────────────────────────────────────────

function Bar({ value, max, color = 'var(--color-primary)' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const overCapacity = value > max && max > 0
  return (
    <div className="db-bar-track">
      <div
        className="db-bar-fill"
        style={{
          width: `${pct}%`,
          background: overCapacity
            ? 'var(--color-danger)'
            : pct >= 80
            ? '#f97316'
            : color,
        }}
      />
    </div>
  )
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="db-stat-card" style={accent ? { borderTop: `3px solid ${accent}` } : {}}>
      <div className="db-stat-value">{value}</div>
      <div className="db-stat-label">{label}</div>
      {sub && <div className="db-stat-sub">{sub}</div>}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="db-section">
      <h2 className="db-section-title">{title}</h2>
      {children}
    </section>
  )
}

function HealthBadge({ count, label, color }) {
  if (count === 0) return null
  return (
    <div className="db-health-badge" style={{ borderColor: color, color }}>
      <span className="db-health-count">{count}</span>
      <span className="db-health-label">{label}</span>
    </div>
  )
}

const PRIORITY_COLORS = {
  p0: '#b60205',
  p1: '#e11d48',
  p2: '#f97316',
  p3: '#94a3b8',
}

const TYPE_COLORS = {
  feature: '#4f46e5',
  bug: '#ef4444',
  chore: '#f59e0b',
  refactor: '#8b5cf6',
  spike: '#06b6d4',
}

const AREA_COLOR = '#4f46e5'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    api.getDashboardMetrics()
      .then(setData)
      .catch((e) => setError(e.message || 'Failed to load metrics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="db-loading">Loading metrics…</div>
  if (error)   return <div className="db-error">{error}</div>
  if (!data)   return null

  const { sprint, team_load, pipeline, breakdown, health, recent_closed, sprint_velocity_history, milestones_health, total_capacity } = data
  const maxBreakdownWeight = Math.max(
    ...breakdown.by_area.map((x) => x.weight),
    ...breakdown.by_type.map((x) => x.weight),
    1
  )

  const pipelineTotal = Object.values(pipeline).reduce((a, b) => a + b, 0)

  return (
    <div className="dashboard">

      {/* ── Sprint Overview ──────────────────────────────────────────── */}
      <Section title="Sprint Overview">
        {sprint ? (
          <div className="db-sprint-card">
            <div className="db-sprint-header">
              <div>
                <div className="db-sprint-name">{sprint.name}</div>
                {sprint.due_on && (
                  <div className="db-sprint-meta">
                    Due {formatDate(sprint.due_on)}
                    {sprint.days_left != null && (
                      <span className={sprint.days_left <= 3 ? 'db-urgent' : ''}>
                        {' '}· {sprint.days_left}d remaining
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="db-velocity-pill" style={{
                background: sprint.velocity_pct >= 80 ? '#dcfce7' : sprint.velocity_pct >= 50 ? '#fef3c7' : '#fee2e2',
                color: sprint.velocity_pct >= 80 ? '#15803d' : sprint.velocity_pct >= 50 ? '#b45309' : '#ef4444',
              }}>
                {sprint.velocity_pct}% velocity
              </div>
            </div>

            <Bar value={sprint.closed_weight} max={sprint.total_weight} />

            <div className="db-sprint-stats">
              <StatCard label="Closed" value={sprint.closed_count} sub={`${sprint.closed_weight} pts`} accent="#15803d" />
              <StatCard label="Open" value={sprint.open_count} sub={`${sprint.open_weight} pts`} accent="#f97316" />
              <StatCard label="Total" value={sprint.total_count} sub={`${sprint.total_weight} pts`} />
            </div>
          </div>
        ) : (
          <p className="db-empty">No active sprint — run <code>/sprint-plan</code> to create one.</p>
        )}

        {/* Velocity history */}
        {sprint_velocity_history.length > 1 && (
          <div className="db-velocity-history">
            <div className="db-subsection-title">Sprint Velocity History</div>
            {sprint_velocity_history.map((s) => (
              <div key={s.name} className="db-history-row">
                <span className="db-history-name">{s.name}</span>
                <div className="db-history-bar-wrap">
                  <Bar value={s.delivered} max={s.planned || 1} />
                </div>
                <span className="db-history-pct">{s.velocity_pct}%</span>
                <span className="db-history-pts">{s.delivered}/{s.planned} pts</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── Milestone Health ─────────────────────────────────────────── */}
      {milestones_health && milestones_health.length > 0 && (
        <Section title="Milestone Health">
          <div className="db-milestones-grid">
            {milestones_health.map((ms) => {
              const statusColors = {
                'at-risk':    { bg: '#fee2e2', color: '#ef4444', label: 'At Risk' },
                'in-progress':{ bg: '#fef3c7', color: '#b45309', label: 'In Progress' },
                'on-track':   { bg: '#dcfce7', color: '#15803d', label: 'On Track' },
                'empty':      { bg: '#f3f4f6', color: '#6b7280', label: 'Empty' },
                'closed':     { bg: '#f3f4f6', color: '#6b7280', label: 'Closed' },
              }
              const sc = statusColors[ms.status] || statusColors['empty']
              return (
                <div key={ms.number} className={`db-ms-card ${ms.at_risk ? 'db-ms-card--risk' : ''}`}>
                  <div className="db-ms-header">
                    <div className="db-ms-title-row">
                      <a href={ms.url} target="_blank" rel="noreferrer" className="db-ms-title">
                        {ms.title}
                      </a>
                      <span className="db-ms-status-pill" style={{ background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                    {ms.due_on && (
                      <div className="db-ms-meta">
                        Due {formatDate(ms.due_on)}
                        {ms.days_left != null && (
                          <span className={ms.days_left < 0 ? 'db-urgent' : ms.days_left <= 5 ? 'db-urgent' : ''}>
                            {ms.days_left < 0
                              ? ` · ${Math.abs(ms.days_left)}d overdue`
                              : ` · ${ms.days_left}d left`}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {ms.total_count > 0 && (
                    <>
                      <Bar value={ms.delivered_weight} max={ms.total_weight || 1} />
                      <div className="db-ms-stats">
                        <span>{ms.closed_count}/{ms.total_count} issues</span>
                        <span>{ms.delivered_weight}/{ms.total_weight} pts</span>
                        <span className="db-ms-velocity">{ms.velocity_pct}%</span>
                      </div>
                    </>
                  )}

                  {ms.owner_breakdown.length > 0 && (
                    <div className="db-ms-owners">
                      {ms.owner_breakdown.map((o) => (
                        <span key={o.owner} className="db-ms-owner-chip">
                          {o.owner} · {o.weight}pts
                        </span>
                      ))}
                    </div>
                  )}

                  {ms.flags.length > 0 && (
                    <ul className="db-ms-flags">
                      {ms.flags.map((f, i) => (
                        <li key={i} className="db-ms-flag">⚠ {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* ── Issue Pipeline ───────────────────────────────────────────── */}
      <Section title="Issue Pipeline">
        <div className="db-pipeline">
          {[
            { key: 'backlog',        label: 'Backlog',       color: '#94a3b8' },
            { key: 'needs_triage',   label: 'Needs Triage',  color: '#f97316' },
            { key: 'sprint_ready',   label: 'Sprint Ready',  color: '#4f46e5' },
            { key: 'in_progress',    label: 'In Progress',   color: '#0ea5e9' },
            { key: 'done_this_week', label: 'Done (7d)',     color: '#15803d' },
          ].map(({ key, label, color }, i, arr) => (
            <div key={key} className="db-pipeline-stage">
              <div className="db-pipeline-count" style={{ color }}>{pipeline[key]}</div>
              <div className="db-pipeline-label">{label}</div>
              {i < arr.length - 1 && <div className="db-pipeline-arrow">›</div>}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Team Load ────────────────────────────────────────────────── */}
      <Section title="Team Load">
        <div className="db-team-grid">
          {team_load.filter(m => m.handle).map((member) => {
            const pct = member.capacity > 0
              ? Math.round((member.assigned_weight / member.capacity) * 100)
              : 0
            return (
              <div key={member.handle} className="db-member-row">
                <div className="db-member-name">{member.name}</div>
                <Bar value={member.assigned_weight} max={member.capacity} />
                <div className="db-member-stats">
                  <span className={pct > 100 ? 'db-over-cap' : ''}>
                    {member.assigned_weight}/{member.capacity} pts
                  </span>
                  <span className="db-member-closed">✓ {member.closed_weight} pts done</span>
                </div>
              </div>
            )
          })}
          {team_load.find(m => !m.handle && m.assigned_count > 0) && (
            <div className="db-member-row db-unassigned-row">
              <div className="db-member-name">Unassigned</div>
              <div className="db-member-stats">
                <span className="db-over-cap">
                  {team_load.find(m => !m.handle).assigned_count} issues ·{' '}
                  {team_load.find(m => !m.handle).assigned_weight} pts
                </span>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ── Work Breakdown ───────────────────────────────────────────── */}
      <Section title="Work Breakdown">
        <div className="db-breakdown-grid">
          <div>
            <div className="db-subsection-title">By Area</div>
            {breakdown.by_area.length === 0 && <p className="db-empty">No labeled issues</p>}
            {breakdown.by_area.map((item) => (
              <div key={item.label} className="db-breakdown-row">
                <span className="db-breakdown-label">{item.label}</span>
                <Bar value={item.weight} max={maxBreakdownWeight} color={AREA_COLOR} />
                <span className="db-breakdown-pts">{item.weight}pts</span>
                <span className="db-breakdown-count">×{item.count}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="db-subsection-title">By Type</div>
            {breakdown.by_type.length === 0 && <p className="db-empty">No labeled issues</p>}
            {breakdown.by_type.map((item) => (
              <div key={item.label} className="db-breakdown-row">
                <span className="db-breakdown-label">{item.label}</span>
                <Bar
                  value={item.weight}
                  max={maxBreakdownWeight}
                  color={TYPE_COLORS[item.label] || AREA_COLOR}
                />
                <span className="db-breakdown-pts">{item.weight}pts</span>
                <span className="db-breakdown-count">×{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Priority Distribution ─────────────────────────────────────── */}
      <Section title="Priority Distribution">
        <div className="db-priority-grid">
          {['p0', 'p1', 'p2', 'p3'].map((p) => {
            const item = breakdown.by_priority.find((x) => x.label === p)
            return (
              <StatCard
                key={p}
                label={p.toUpperCase()}
                value={item?.count ?? 0}
                sub={item ? `${item.weight} pts` : '—'}
                accent={PRIORITY_COLORS[p]}
              />
            )
          })}
        </div>
      </Section>

      {/* ── Backlog Health ────────────────────────────────────────────── */}
      <Section title="Backlog Health">
        <div className="db-health-row">
          {health.p0_open > 0 && (
            <HealthBadge count={health.p0_open} label="P0 open" color="#b60205" />
          )}
          <HealthBadge count={health.unlabeled}           label="unlabeled"          color="#ef4444" />
          <HealthBadge count={health.unweighted}          label="unweighted"         color="#f97316" />
          <HealthBadge count={health.unassigned}          label="unassigned"         color="#f59e0b" />
          <HealthBadge count={health.stale}               label="stale (>7d)"        color="#8b5cf6" />
          <HealthBadge count={health.needs_decomposition} label="needs decomposition" color="#ef4444" />
          <HealthBadge count={health.approval_required}   label="approval required"  color="#b60205" />
          {[health.unlabeled, health.unweighted, health.unassigned, health.stale,
            health.needs_decomposition, health.approval_required, health.p0_open]
            .every(v => v === 0) && (
            <div className="db-health-clean">All clear — backlog is healthy</div>
          )}
        </div>
        {(health.unlabeled + health.unweighted + health.unassigned) > 0 && (
          <p className="db-health-hint">Run <code>/groom</code> to auto-fix what's possible.</p>
        )}
      </Section>

      {/* ── Recent Activity ───────────────────────────────────────────── */}
      {recent_closed.length > 0 && (
        <Section title="Recently Closed">
          <ul className="db-recent-list">
            {recent_closed.map((issue) => (
              <li key={issue.number} className="db-recent-item">
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="db-recent-link"
                >
                  #{issue.number} — {issue.title}
                </a>
                <span className="db-recent-date">{formatDate(issue.closed_at)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

    </div>
  )
}
