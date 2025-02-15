import { defineBoot } from '#q-app/wrappers'

import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from 'src/stores/auth'

// import log from '../services/logger'

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $api: AxiosInstance
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// https://fictional-space-lamp-9xr9pxp7qpv2x5j6-8000.app.github.dev/
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
})

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      // log.debug('Interceptor: Attaching access token to request.')
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)
/**
 * Interceptor for handling 401 responses to refresh the access token.
 * If a 401 Unauthorized response is received and the refresh token is available,
 * this interceptor will attempt to refresh the access token and retry the original
 * request with the new access token.
 */

// Optional: interceptor for handling 401 responses to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry && authStore.refreshToken) {
      // log.debug('Interceptor: Handling 401 response to refresh token.')
      originalRequest._retry = true
      await authStore.refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
      return api(originalRequest)
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
/**
 * Creates an Axios instance with a base URL and timeout configuration.
 * The instance is used for making HTTP requests to the backend API.
 * It also includes request and response interceptors to handle authentication
 * and token refreshing.
 */
