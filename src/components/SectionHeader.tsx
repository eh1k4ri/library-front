type SectionHeaderProps = {
  title: string
  description?: string
  hint?: string
}

function SectionHeader({ title, description, hint }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow">{hint ?? 'Seção'}</p>
        <h2>{title}</h2>
        {description ? <p className="lede">{description}</p> : null}
      </div>
    </div>
  )
}

export default SectionHeader
