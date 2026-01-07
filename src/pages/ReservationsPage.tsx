import SectionHeader from '../components/SectionHeader'
import StatusPill from '../components/StatusPill'
import { useApiData } from '../hooks/useApi'
import { apiClient } from '../services/api'
import { formatDateTimeSP } from '../utils/datetime'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

function ReservationsPage() {
  const [page, setPage] = useState(1)
  const perPage = 10
  const { data: reservations, isLoading, isConnected, reload } = useApiData(
    () => apiClient.getReservations(undefined, undefined, undefined, (page - 1) * perPage, perPage),
    [] as any[]
  )
  const { data: usersList } = useApiData(() => apiClient.getUsers(), [] as any[])
  const { data: booksList } = useApiData(() => apiClient.getBooks(), [] as any[])
  const [showCreate, setShowCreate] = useState(false)
  const [userKey, setUserKey] = useState('')
  const [bookKey, setBookKey] = useState('')

  const activeUsers = (usersList as any[]).filter(
    (u) => (u as any).status?.enumerator === 'active'
  )
  const unavailableBooks = (booksList as any[]).filter(
    (b) => (b as any).status?.enumerator !== 'available'
  )

  useEffect(() => {
    reload()
  }, [page])

  const onComplete = async (reservation: any) => {
    if (!isConnected) return
    const key = reservation.reservation_key || reservation.id
    if (!key) return
    await apiClient.completeReservation(key)
    reload()
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return
    const u = userKey.trim()
    const b = bookKey.trim()
    if (!u || !b) return
    await apiClient.createReservation({ user_key: u, book_key: b })
    setUserKey('')
    setBookKey('')
    setShowCreate(false)
    reload()
  }

  return (
    <div className="stack">
      <SectionHeader
        title="Reservas de Livros"
        description="Gerencie a fila de espera para livros que estão em empréstimo, controle prioridades e notifique usuários."
        hint={`Integração ${isConnected ? '(conectado)' : '(desconectado)'}`}
      />

      <div className="card">
        <div className="card__header">
          <div>
            <p className="eyebrow">Fila de Espera</p>
            <h3>Reservas Pendentes</h3>
          </div>
          <button className="primary" onClick={() => setShowCreate((v) => !v)} disabled={!isConnected}>
            <Plus size={18} />
            {showCreate ? 'Cancelar' : 'Criar reserva'}
          </button>
        </div>

        {showCreate && (
          <form className="grid" style={{ gridTemplateColumns: '2fr 2fr auto', gap: 12 }} onSubmit={onCreate}>
            <select
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um usuário ativo
              </option>
              {activeUsers.map((u: any) => (
                <option key={u.user_key || u.id} value={u.user_key}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <select
              value={bookKey}
              onChange={(e) => setBookKey(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um livro indisponível
              </option>
              {unavailableBooks.map((b: any) => (
                <option key={b.book_key || b.id} value={b.book_key}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
            <button
              className="primary"
              type="submit"
              disabled={!isConnected || !userKey.trim() || !bookKey.trim() || activeUsers.length === 0 || unavailableBooks.length === 0}
            >
              Salvar
            </button>
          </form>
        )}

        <div className="table table--actions">
          <div className="table__head">
            <span>Usuário</span>
            <span>Livro</span>
            <span>Status</span>
            <span>Data</span>
            <span>Ação</span>
          </div>
          {isLoading ? (
            <div className="table__row">
              <span style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Carregando...
              </span>
            </div>
          ) : (
            reservations.map((reservation: any) => {
              const userLabel = reservation.user?.name ?? reservation.user
              const bookLabel = reservation.book?.title ?? reservation.book
              const statusEnum = reservation.status?.enumerator
              const statusText = reservation.status?.translation ?? statusEnum ?? reservation.status
              const created = reservation.reserved_at ?? reservation.created_at ?? reservation.date
              return (
                <div className="table__row" key={reservation.reservation_key || reservation.id}>
                  <span className="list-title">{userLabel}</span>
                  <span className="list-sub">{bookLabel}</span>
                  <StatusPill status={statusText} />
                  <span className="meta-chip">{formatDateTimeSP(created)}</span>
                  <span>
                    {statusEnum === 'active' ? (
                      <button className="ghost" onClick={() => onComplete(reservation)} disabled={!isConnected}>Completar</button>
                    ) : (
                      'Finalizada'
                    )}
                  </span>
                </div>
              )
            })
          )}
        </div>

        <div className="pager">
          <button className="ghost pager__prev" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
          <span className="meta-chip pager__page">Página {page}</span>
          <button className="ghost pager__next" disabled={reservations.length < perPage} onClick={() => setPage((p) => p + 1)}>Próxima</button>
        </div>
      </div>

      <div className="card integration">
        <h3>Funcionamento do Sistema de Reservas</h3>
        <ul>
          <li>Usuários podem reservar livros que estão atualmente emprestados</li>
          <li>A fila é gerenciada por ordem de chegada da reserva</li>
          <li>Notificações automáticas quando o livro fica disponível</li>
          <li>Reservas não retiradas em 3 dias são automaticamente canceladas</li>
        </ul>
      </div>
    </div>
  )
}

export default ReservationsPage
