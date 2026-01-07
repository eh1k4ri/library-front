import { NavLink } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import ConnectionStatus from './ConnectionStatus'
import { BookOpen, Users, BookMarked, Calendar} from 'lucide-react'

const navItems = [
  { to: '/books', label: 'Acervo', icon: BookOpen },
  { to: '/users', label: 'Leitores', icon: Users },
  { to: '/loans', label: 'Empréstimos', icon: BookMarked },
  { to: '/reservations', label: 'Reservas', icon: Calendar },
]


function Layout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <BookOpen size={32} />
          </div>
          <div>
            <div className="brand-title">Sistema de Gestão</div>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item--active' : ''}`
                }
              >
                <IconComponent className="nav-icon" size={20} aria-hidden />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

      </aside>

      <main className="content">
        <ConnectionStatus />
        <header className="topbar">
          <div>
            <p className="eyebrow">Gestão de Biblioteca</p>
            <h1>BTG Pactual Energy - Case técnico</h1>
            <p className="lede">
              Plataforma completa para gerenciamento de acervo, empréstimos, reservas e usuários. 
              Controle centralizado com interface intuitiva e integração em tempo real.
            </p>
          </div>
          <div className="top-actions">

            <div className="profile">
              <div className="profile-avatar">
                <Users size={24} />
              </div>
              <div>
                <div className="profile-name">Admin</div>
                <div className="profile-role">Gerenciador</div>
              </div>
            </div>
          </div>
        </header>

        <div className="content-inner">{children}</div>
      </main>
    </div>
  )
}

export default Layout
