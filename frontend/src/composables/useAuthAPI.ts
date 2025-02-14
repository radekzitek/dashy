import { api } from '../boot/axios'

// Define an interface for the response
interface AuthResponse {
  access: string
  refresh: string
}

export function useAuthAPI() {
  const loginAPICall = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Logging in:', username, password)
      const response = await api.post('/api/token/', {
        username,
        password
      })
      console.log('Login successful:', response.data)
      const { access, refresh } = response.data
      console.log('Access token:', access)
      console.log('Refresh token:', refresh)
      return { access, refresh }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logoutAPICall = () => {}

  const registerAPICall = (username: string, password: string, fullname: string, email: string) => {
    console.log( username, password, fullname, email )
  }

  return { loginAPICall, logoutAPICall, registerAPICall }
}
