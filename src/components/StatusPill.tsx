type StatusPillProps = {
  status: string
}

const colors: Record<string, { text: string; bg: string }> = {
  available: { text: '#1f5c3b', bg: '#d8f3dc' },
  loaned: { text: '#703f00', bg: '#ffe8c8' },
  maintenance: { text: '#69415b', bg: '#f7e6f3' },
  active: { text: '#0f4c5c', bg: '#dff6ff' },
  returned: { text: '#2f4858', bg: '#e2ecf6' },
  overdue: { text: '#7d1b3a', bg: '#ffe3ed' },
  pending: { text: '#704214', bg: '#fff2df' },
  completed: { text: '#1f3c88', bg: '#e1e8ff' },
  cancelled: { text: '#5c2b29', bg: '#ffe4e0' },
}

function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase()
  const palette = colors[normalized] ?? { text: '#1f2d3d', bg: '#ecf0f3' }

  return (
    <span
      className="pill"
      style={{ color: palette.text, backgroundColor: palette.bg }}
    >
      {status}
    </span>
  )
}

export default StatusPill
