import { defineStore } from 'pinia'
import { api } from '../boot/axios'
import log from '../services/logger'

/**
 * A Pinia store for managing user authentication and profile information.
 *
 * This store provides state management for authentication tokens, user profile data,
 * and actions for logging in, logging out, registering, updating profile, and changing password.
 * It also includes a getter to check if the user is authenticated.
 *
 * @module useAuthStore
 *
 * @state
 * @property {string | null} accessToken - The access token for the authenticated user.
 * @property {string | null} refreshToken - The refresh token for the authenticated user.
 * @property {string | null} username - The username of the authenticated user.
 * @property {string | null} first_name - The first name of the authenticated user.
 * @property {string | null} last_name - The last name of the authenticated user.
 * @property {string | null} email - The email address of the authenticated user.
 *
 * @actions
 * @method login - Logs in the user with the provided username and password.
 * @param {string} username - The username of the user to log in.
 * @param {string} password - The password of the user to log in.
 * @throws {Error} If the login fails.
 *
 * @method logout - Logs out the user by clearing the access and refresh tokens from the state and removing them from local storage.
 *
 * @method refreshAccessToken - Refreshes the access token by using the stored refresh token.
 * @throws {Error} If the token refresh fails.
 *
 * @method register - Registers a new user with the provided username, password, first name, last name, and email.
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 * @param {string} first_name - The first name of the new user.
 * @param {string} last_name - The last name of the new user.
 * @param {string} email - The email address of the new user.
 * @throws {Error} If the registration fails.
 *
 * @method updateProfile - Updates the user's profile information, including first name, last name, and email.
 * @param {string} first_name - The new first name for the user.
 * @param {string} last_name - The new last name for the user.
 * @param {string} email - The new email address for the user.
 * @throws {Error} If the profile update fails.
 *
 * @method profile - Fetches the user profile from the API and updates the local state and localStorage with the user's information.
 * @returns {Promise<Object>} The user's profile data.
 * @throws {Error} If the profile fetch fails.
 *
 * @method changePassword - Changes the user's password by calling the API endpoint.
 * @param {string} old_password - The current password of the user.
 * @param {string} new_password - The new password to be set for the user.
 * @returns {Promise<void>} A promise that resolves when the password change is successful.
 * @throws {Error} If the password change fails.
 *
 * @getters
 * @getter isAuthenticated - Checks if the user is authenticated.
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('access_token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    username: localStorage.getItem('username') || null,
    first_name: localStorage.getItem('first_name') || null,
    last_name: localStorage.getItem('last_name') || null,
    email: localStorage.getItem('email') || null,
  }),

  actions: {
    /**
     * Logs in a user with the provided username and password.
     *
     * This method sends a POST request to the `/api/token/` endpoint with the
     * provided credentials. If the login is successful, it stores the access
     * and refresh tokens in the local storage and optionally fetches and sets
     * the user profile data.
     *
     * @throws {Error} Throws an error if the login attempt fails.
     * @returns {Promise<void>} A promise that resolves when the login process is complete.
     */
    async login(username: string, password: string): Promise<void> {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('access_token')
      // Log the username before making the API call for debugging purposes
      log.debug(`About to call api.post with username: ${username}`)
      try {
        const response = await api.post('/api/token/', { username, password })
        log.debug('Response from api.post:', response)
        this.accessToken = response.data.access
        this.refreshToken = response.data.refresh
        localStorage.setItem('access_token', this.accessToken as string)
        localStorage.setItem('refresh_token', this.refreshToken as string)
        await this.profile()
      } catch (error) {
        log.error('Login failed:', error)
        throw error
        // if (error instanceof Error) {
        //   throw new Error(`Login failed: ${error.message}`);
        // }  else {
        //   throw new Error('Login failed');
        // }
      }
    },
    /**
     * Logs out the user by clearing the access and refresh tokens from the state
     * and removing them from local storage.
     */
    logout() {
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
    /**
     * Refreshes the access token by using the stored refresh token.
     *
     * This method sends a POST request to the `/api/token/refresh/` endpoint with the
     * stored refresh token, and updates the access token in the state and local storage.
     * If the refresh token is invalid, it logs out the user and throws an error.
     *
     * @throws {Error} If the token refresh fails.
     */
    async refreshAccessToken() {
      try {
        const response = await api.post('/api/token/refresh/', { refresh: this.refreshToken })
        this.accessToken = response.data.access
        localStorage.setItem('access_token', this.accessToken as string)
      } catch (error) {
        this.logout()
        throw new Error('Session expired. Please log in again.', error as Error)
      }
    },
    /**
     * Registers a new user with the provided username, password, first name, last name, and email.
     *
     * @param username - The username for the new user.
     * @param password - The password for the new user.
     * @param first_name - The first name of the new user.
     * @param last_name - The last name of the new user.
     * @param email - The email address of the new user.
     * @throws {Error} If the registration fails.
     */
    async register(
      username: string,
      password: string,
      first_name: string,
      last_name: string,
      email: string,
    ) {
      try {
        log.debug(
          'About to call api.post with username, password, firstname, lastname, and email:',
          { username, password, first_name, last_name, email },
        )
        await api.post('/api/register/', { username, password, first_name, last_name, email })
        log.debug('Registration successful')
      } catch (error) {
        throw new Error('Registration failed', error as Error)
      }
    },
    /**
     * Updates the user's profile information, including first name, last name, and email.
     *
     * This method sends a PUT request to the `/api/profile/update/` endpoint with the provided
     * first name, last name, and email. It then updates the corresponding state properties
     * and stores the updated values in local storage.
     *
     * @param first_name - The new first name for the user.
     * @param last_name - The new last name for the user.
     * @param email - The new email address for the user.
     * @throws {Error} If the profile update fails.
     */
    async updateProfile(first_name: string, last_name: string, email: string) {
      try {
        log.debug('About to call api.put with firstname, lastname, and email:', {
          first_name,
          last_name,
          email,
        })
        const response = await api.put('/api/profile/update/', { first_name, last_name, email })
        log.debug('Update successful:', response)
        this.first_name = response.data.first_name
        localStorage.setItem('first_name', this.first_name as string)
        this.last_name = response.data.last_name
        localStorage.setItem('last_name', this.last_name as string)
        this.email = response.data.email
        localStorage.setItem('email', this.email as string)
      } catch (error) {
        log.error('Profile fetch failed:', error)
        throw  error
      }
    },
    /**
     * Fetches the user profile from the API and updates the local state and localStorage with the user's information.
     *
     * @returns {Promise<Object>} The user's profile data.
     * @throws {Error} If the profile fetch fails.
     *
     * @example
     * ```typescript
     * try {
     *   const profileData = await profile();
     *   console.log('Profile data:', profileData);
     * } catch (error) {
     *   console.error('Error fetching profile:', error);
     * }
     * ```
     */
    async profile() {
      try {
        log.debug('About to call api.get to get profile.')
        const response = await api.get('/api/profile/')
        log.debug('Response from api.get:', response)
        this.username = response.data.username
        localStorage.setItem('username', this.username as string)
        this.first_name = response.data.first_name
        localStorage.setItem('first_name', this.first_name as string)
        this.last_name = response.data.last_name
        localStorage.setItem('last_name', this.last_name as string)
        this.email = response.data.email
        localStorage.setItem('email', this.email as string)
        return response.data
      } catch (error) {
        log.error('Profile fetch failed:', error)
        throw  error
      }
    },
    /**
     * Changes the user's password by calling the API endpoint.
     *
     * @param old_password - The current password of the user.
     * @param new_password - The new password to be set for the user.
     * @returns A promise that resolves when the password change is successful.
     * @throws An error if the password change fails.
     */
    async changePassword(old_password: string, new_password: string) {
      try {
        log.debug('About to call api.post with old_password and new_password:', {
          old_password,
          new_password,
        })
        await api.post('/api/password/change/', { old_password, new_password })
        log.debug('Password change successful')
      } catch (error) {
        log.error('Password change failed:', error)
        throw error
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
})
