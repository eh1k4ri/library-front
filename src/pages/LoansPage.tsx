import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import StatusPill from '../components/StatusPill'
import { useApiData } from '../hooks/useApi'
import { formatDateTimeSP } from '../utils/datetime'
import { apiClient } from '../services/api'
import { Plus } from 'lucide-react'

function LoansPage() {
  const [page, setPage] = useState(1)
  const perPage = 10
  const { data: loans, isLoading, isConnected, reload } = useApiData(
    () => apiClient.getLoans(undefined, false, page, perPage),
    [] as any[]
  )
  const { data: usersList } = useApiData(() => apiClient.getUsers(), [] as any[])
  const { data: booksList } = useApiData(() => apiClient.getBooks(), [] as any[])
  const [showCreate, setShowCreate] = useState(false)
  const [userKey, setUserKey] = useState('')
  const [bookKey, setBookKey] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const activeUsers = (usersList as any[]).filter(
    (u) => (u as any).status?.enumerator === 'active'
  )
  const availableBooks = (booksList as any[]).filter(
    (b) => (b as any).status?.enumerator === 'available'
  )

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return
    setSubmitted(true)
    const u = userKey.trim()
    const b = bookKey.trim()
    if (!u || !b) return
    await apiClient.createLoan({ user_key: u, book_key: b })
    setUserKey('')
    setBookKey('')
    setSubmitted(false)
    setShowCreate(false)
    reload()
  }

  useEffect(() => {
    reload()
  }, [page])

  const onReturn = async (loan: any) => {
    if (!isConnected) return
    const bk = (loan as any).book?.book_key || (loan as any).book_key
    if (!bk) return
    await apiClient.returnBook({ book_key: bk })
    reload()
  }

  return (
    <div className="stack">
      <SectionHeader
        title="Empréstimos"
        description="Acompanhe todos os empréstimos registrados, controle devoluções e renove prazos quando autorizado."
        hint={`Integração ${isConnected ? '(conectado)' : '(desconectado)'}`}
      />

      <div className="card">
        <div className="card__header">
          <div>
            <p className="eyebrow">Registro de Empréstimos</p>
            <h3>Empréstimos</h3>
          </div>
          <div className="actions">
            <button className="primary" onClick={() => setShowCreate((v) => !v)} disabled={!isConnected}>
              <Plus size={18} />
              {showCreate ? 'Cancelar' : 'Registrar empréstimo'}
            </button>
          </div>
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
            {submitted && !userKey.trim() && (
              <span style={{ gridColumn: '1 / 2', color: '#c62828', fontSize: 12 }}>Campo obrigatório</span>
            )}
            <select
              value={bookKey}
              onChange={(e) => setBookKey(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um livro disponível
              </option>
              {availableBooks.map((b: any) => (
                <option key={b.book_key || b.id} value={b.book_key}>
                  {b.title} — {b.author}
                </option>
              ))}
            </select>
            {submitted && !bookKey.trim() && (
              <span style={{ gridColumn: '2 / 3', color: '#c62828', fontSize: 12 }}>Campo obrigatório</span>
            )}
            <button
              className="primary"
              type="submit"
              disabled={!isConnected || activeUsers.length === 0 || availableBooks.length === 0}
            >
              Salvar
            </button>
          </form>
        )}

        <div className="table table--actions">
          <div className="table__head">
            <span>Livro</span>
            <span>Usuário</span>
            <span>Status</span>
            <span>Devolução</span>
            <span>Ação</span>
          </div>
          {isLoading ? (
            <div className="table__row">
              <span style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Carregando...
              </span>
            </div>
          ) : (
            loans.map((loan) => {
              const statusEnum = (loan as any).status?.enumerator
              const statusText = (loan as any).status?.translation ?? statusEnum ?? (loan as any).status
              const due = (loan as any).due_date ?? (loan as any).dueDate
              const bookLabel = (loan as any).book?.title ?? (loan as any).book
              const userLabel = (loan as any).user?.name ?? (loan as any).user
              return (
                <div className="table__row" key={(loan as any).loan_key || (loan as any).id}>
                  <span className="list-title">{bookLabel}</span>
                  <span className="list-sub">{userLabel}</span>
                  <StatusPill status={statusText} />
                  <span className="meta-chip">{formatDateTimeSP(due)}</span>
                  <span>
                    {statusEnum === 'active' ? (
                      <button className="ghost" onClick={() => onReturn(loan)} disabled={!isConnected}>
                        Devolver
                      </button>
                    ) : (
                      'Finalizado'
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
          <button className="ghost pager__next" disabled={loans.length < perPage} onClick={() => setPage((p) => p + 1)}>Próxima</button>
        </div>

      </div>

      <div className="card integration">
        <h3>Políticas de Empréstimo</h3>
        <ul>
          <li>Prazo padrão: 14 dias a partir da data de registro do empréstimo</li>
          <li>Renovação: permitida uma vez, se o livro não possuir reservas</li>
          <li>Multa: R$ 2,00 por dia de atraso na devolução</li>
          <li>Limite: máximo de 3 empréstimos simultâneos por usuário</li>
        </ul>
      </div>
    </div>
  )
}

export default LoansPage
