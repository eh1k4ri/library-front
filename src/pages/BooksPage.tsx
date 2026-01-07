import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import StatusPill from '../components/StatusPill'
import { useApiData } from '../hooks/useApi'
import { formatDateTimeSP } from '../utils/datetime'
import { apiClient } from '../services/api'
import { BookPlus } from 'lucide-react'

function BooksPage() {
  const [page, setPage] = useState(1)
  const perPage = 10
  const { data: books, isLoading, isConnected, reload } = useApiData(
    () => apiClient.getBooks(page, perPage),
    [] as any[]
  )
  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('General')

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return
    const t = title.trim()
    const a = author.trim()
    const g = genre.trim()
    if (!t || !a || !g) return
    await apiClient.createBook({ title: t, author: a, genre: g })
    setTitle('')
    setAuthor('')
    setGenre('General')
    setShowCreate(false)
    reload()
  }

  useEffect(() => {
    reload()
  }, [page])

  return (
    <div className="stack">
      <SectionHeader
        title="Catálogo de Livros"
        description="Gerencie o acervo de livros cadastrados no sistema, consulte disponibilidade e acompanhe o status de cada obra."
        hint={`Integração ${isConnected ? '(conectado)' : '(desconectado)'}`}
      />

      <div className="card">
        <div className="card__header">
          <div>
            <p className="eyebrow">Todos os Livros</p>
            <h3>Acervo</h3>
            <p className="card__lede">Visualize e gerencie os livros cadastrados, incluindo status e informações de disponibilidade.</p>
          </div>
          <button className="primary" onClick={() => setShowCreate((v) => !v)} disabled={!isConnected}>
            <BookPlus size={18} />
            {showCreate ? 'Cancelar' : 'Cadastrar novo livro'}
          </button>
        </div>

        {showCreate && (
          <form className="grid" style={{ gridTemplateColumns: '2fr 2fr 1fr auto', gap: 12 }} onSubmit={onCreate}>
            <input
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              placeholder="Autor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <input
              placeholder="Gênero"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
            <button className="primary" type="submit" disabled={!isConnected || !title.trim() || !author.trim() || !genre.trim()}>Salvar</button>
          </form>
        )}

        <div className="table">
          <div className="table__head">
            <span>Título</span>
            <span>Autor</span>
            <span>Status</span>
            <span>Adicionado</span>
          </div>
          {isLoading ? (
            <div className="table__row">
              <span style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                Carregando...
              </span>
            </div>
          ) : (
            books.map((book) => {
              const statusEnum = (book as any).status?.enumerator
              const statusText = (book as any).status?.translation ?? statusEnum ?? (book as any).status
              const createdAt = (book as any).created_at ?? (book as any).addedAt
              return (
                <div className="table__row" key={(book as any).book_key || (book as any).id}>
                  <span className="list-title">{(book as any).title}</span>
                  <span className="list-sub">{(book as any).author}</span>
                  <StatusPill status={statusText} />
                  <span className="meta-chip">{formatDateTimeSP(createdAt)}</span>
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
            disabled={books.length < perPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      </div>

      <div className="card integration">
        <h3>Informações sobre Gestão de Acervo</h3>
        <ul>
          <li>Todos os livros são catalogados com informações de título, autor e gênero</li>
          <li>O status é atualizado em tempo real conforme empréstimos e devoluções</li>
          <li>Acompanhe quais livros estão disponíveis ou emprestados</li>
          <li>Consulte histórico e datas de movimentação dos itens</li>
        </ul>
      </div>
    </div>
  )
}

export default BooksPage
