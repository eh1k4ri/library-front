type StatCardProps = {
  title: string
  value: string | number
  hint?: string
  accent?: string
  icon?: string
}

function StatCard({ title, value, hint, accent = 'var(--mint)', icon }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: accent }}>
      <div className="stat-card__top">
        <span className="stat-card__icon" aria-hidden>
          {icon ?? '⭐'}
        </span>
        <span className="stat-card__label">{title}</span>
      </div>
      <div className="stat-card__value">{value}</div>
      {hint ? <p className="stat-card__hint">{hint}</p> : null}
    </div>
  )
}

export default StatCard
