import { useApiConnection } from '../hooks/useApi'
import './ConnectionStatus.css'

function ConnectionStatus() {
  const { isConnected, isChecking } = useApiConnection()

  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'} ${isChecking ? 'checking' : ''}`}>
      <div className="connection-status__indicator"></div>
      <span className="connection-status__label">
        {isChecking ? 'Verificando...' : isConnected ? 'Conectado' : 'Modo offline'}
      </span>
    </div>
  )
}

export default ConnectionStatus
