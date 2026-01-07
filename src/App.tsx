import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BooksPage from './pages/BooksPage'
import LoansPage from './pages/LoansPage'
import NotFoundPage from './pages/NotFoundPage'
import ReservationsPage from './pages/ReservationsPage'
import UsersPage from './pages/UsersPage'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
