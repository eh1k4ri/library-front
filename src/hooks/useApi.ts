import { useEffect, useState } from 'react'
import { apiClient } from '../services/api'

export const useApiConnection = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      const connected = await apiClient.checkConnection()
      setIsConnected(connected)
      setIsChecking(false)
    }

    checkConnection()

    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  return { isConnected, isChecking }
}

// useDataWithFallback removed (mock data no longer used)

export const useApiData = <T,>(
  fetchFn: () => Promise<T>,
  initial: T
): { data: T; isLoading: boolean; error: Error | null; isConnected: boolean; reload: () => void } => {
  const [data, setData] = useState<T>(initial)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { isConnected } = useApiConnection()
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(false)
      return
    }

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fetchFn()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setData(initial)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [isConnected, version])

  const reload = () => setVersion((v) => v + 1)

  return { data, isLoading, error, isConnected, reload }
}
