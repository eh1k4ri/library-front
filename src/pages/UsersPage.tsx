import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import StatusPill from '../components/StatusPill'
import { useApiData } from '../hooks/useApi'
import { apiClient } from '../services/api'
import { UserPlus } from 'lucide-react'

function UsersPage() {
  const [page, setPage] = useState(1)
  const perPage = 10
  const { data: users, isLoading, isConnected, reload } = useApiData(
    () => apiClient.getUsers(page, perPage),
    [] as any[]
  )
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return
    const n = name.trim()
    const m = email.trim()
    if (!n || !m) return
    await apiClient.createUser({ name: n, email: m })
    setName('')
    setEmail('')
    setShowCreate(false)
    reload()
  }

  useEffect(() => {
    reload()
  }, [page])

  return (
    <div className="stack">
      <SectionHeader
        title="Usuários do Sistema"
        description="Gerencie cadastro de usuários, consulte informações de contato e histórico de atividades."
        hint={`Integração ${isConnected ? '(conectado)' : '(desconectado)'}`}
      />

      <div className="card">
        <div className="card__header">
          <div>
            <p className="eyebrow">Usuários Ativos</p>
            <h3>Lista de Usuários</h3>
          </div>
          <button className="primary" onClick={() => setShowCreate((v) => !v)} disabled={!isConnected}>
            <UserPlus size={18} />
            {showCreate ? 'Cancelar' : 'Cadastrar usuário'}
          </button>
        </div>

        {showCreate && (
          <form className="grid" style={{ gridTemplateColumns: '2fr 2fr auto', gap: 12 }} onSubmit={onCreate}>
            <input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="primary" type="submit" disabled={!isConnected || !name.trim() || !email.trim()}>Salvar</button>
          </form>
        )}

        <div className="table">
          <div className="table__head">
            <span>Nome</span>
            <span>Email</span>
            <span>Status</span>
            <span>Empréstimos ativos</span>
          </div>
          {isLoading ? (
            <div className="table__row">
              <span style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Carregando...
              </span>
            </div>
          ) : (
            users.map((user) => {
              const statusEnum = (user as any).status?.enumerator
              const statusText = (user as any).status?.translation ?? statusEnum ?? (user as any).status
              const activeLoans = (user as any).active_loans ?? (user as any).activeLoans ?? 0
              return (
                <div className="table__row" key={(user as any).user_key || (user as any).id}>
                  <span className="list-title">{(user as any).name}</span>
                  <span className="list-sub">{(user as any).email}</span>
                  <StatusPill status={statusText} />
                  <span className="meta-chip">{activeLoans}</span>
                </div>
              )
            })
          )}
        </div>

        <div className="pager">
          <button
            className="ghost pager__prev"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <span className="meta-chip pager__page">Página {page}</span>
          <button
            className="ghost pager__next"
            disabled={users.length < perPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      </div>

      <div className="card integration">
        <h3>Gestão de Usuários</h3>
        <ul>
          <li>Cada usuário possui um perfil com informações de contato e histórico</li>
          <li>O sistema controla limite de empréstimos simultâneos por usuário</li>
          <li>Email é obrigatório para notificações e comunicação</li>
          <li>Status ativo/inativo controla acesso ao sistema</li>
        </ul>
      </div>
    </div>
  )
}

export default UsersPage
