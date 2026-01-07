const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_TIMEOUT = 5000

const AUTH_HEADER = {
  Authorization: 'Basic ' + btoa('admin:password123'),
}


class ApiClient {
  private isConnected: boolean = false

  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), API_TIMEOUT)

      const response = await fetch(`${API_BASE_URL}/`, {
        headers: AUTH_HEADER,
        signal: controller.signal,
      })

      clearTimeout(timeout)
      this.isConnected = response.ok
      return this.isConnected
    } catch {
      this.isConnected = false
      return false
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...AUTH_HEADER,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeout)
      throw error
    }
  }

  async getBooks(page: number = 1, perPage: number = 100): Promise<any[]> {
    return this.fetchWithAuth(
      `/books?page=${page}&per_page=${perPage}`
    )
  }

  async getBookByKey(bookKey: string): Promise<any> {
    return this.fetchWithAuth(`/books/${bookKey}`)
  }

  async createBook(book: any): Promise<any> {
    return this.fetchWithAuth('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    })
  }

  async updateBook(bookKey: string, data: any): Promise<any> {
    return this.fetchWithAuth(`/books/${bookKey}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getGenres(): Promise<string[]> {
    return this.fetchWithAuth('/books/genres')
  }

  async getUsers(page: number = 1, perPage: number = 100): Promise<any[]> {
    return this.fetchWithAuth(
      `/users?page=${page}&per_page=${perPage}`
    )
  }

  async getUserByKey(userKey: string): Promise<any> {
    return this.fetchWithAuth(`/users/${userKey}`)
  }

  async getUserLoans(
    userKey: string,
    status?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<any[]> {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())
    if (status) params.append('status', status)

    return this.fetchWithAuth(
      `/users/${userKey}/loans?${params.toString()}`
    )
  }

  async createUser(user: any): Promise<any> {
    return this.fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    })
  }

  async updateUser(userKey: string, data: any): Promise<any> {
    return this.fetchWithAuth(`/users/${userKey}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getLoans(
    status?: string,
    overdue: boolean = false,
    page: number = 1,
    perPage: number = 100
  ): Promise<any[]> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('per_page', perPage.toString())
    if (status) params.append('status', status)
    if (overdue) params.append('overdue', 'true')

    return this.fetchWithAuth(
      `/loans?${params.toString()}`
    )
  }

  async getLoanByKey(loanKey: string): Promise<any> {
    return this.fetchWithAuth(`/loans/${loanKey}`)
  }

  async createLoan(loan: any): Promise<any> {
    return this.fetchWithAuth('/loans', {
      method: 'POST',
      body: JSON.stringify(loan),
    })
  }

  async returnBook(data: any): Promise<any> {
    return this.fetchWithAuth('/loans/return', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async renewLoan(loanKey: string): Promise<any> {
    return this.fetchWithAuth(`/loans/${loanKey}/renew`, {
      method: 'POST',
    })
  }

  async getReservations(
    userKey?: string,
    bookKey?: string,
    status?: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<any[]> {
    const params = new URLSearchParams()
    params.append('skip', skip.toString())
    params.append('limit', limit.toString())
    if (userKey) params.append('user_key', userKey)
    if (bookKey) params.append('book_key', bookKey)
    if (status) params.append('status', status)

    return this.fetchWithAuth(
      `/reservations?${params.toString()}`
    )
  }

  async getReservationByKey(reservationKey: string): Promise<any> {
    return this.fetchWithAuth(`/reservations/${reservationKey}`)
  }

  async createReservation(reservation: any): Promise<any> {
    return this.fetchWithAuth('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    })
  }

  async completeReservation(reservationKey: string): Promise<any> {
    return this.fetchWithAuth(`/reservations/${reservationKey}/complete`, {
      method: 'POST',
    })
  }
}

export const apiClient = new ApiClient()
