export const formatDateTimeSP = (value?: string | number | Date) => {
  if (!value) return '—'
  const d = new Date(value)
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  }
}

export const formatDateSP = (value?: string | number | Date) => {
  if (!value) return '—'
  const d = new Date(value)
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
    }).format(d)
  } catch {
    return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  }
}
