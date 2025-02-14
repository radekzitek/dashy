export function useAuthAPI() {
  const loginAPICall = (username: string, password: string) => {
    // Replace this with your actual API call
    if (username === 'admin' && password === 'admin') {
      return { success: true, user: { username: 'admin', fullname: 'Admin User' } }
    } else {
      throw new Error('Invalid credentials')
    }
  }

  const logoutAPICall = () => {}

  const registerAPICall = (username: string, password: string, fullname: string, email: string) => {
    console.log( username, password, fullname, email )
  }

  return { loginAPICall, logoutAPICall, registerAPICall }
}
