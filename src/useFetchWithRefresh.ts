// composables/useFetchWithRefresh.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from './constants'


export function useFetchWithRefresh() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  async function refreshTokens() {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Błąd odświeżania sesji')
      }

      return true
    } catch (err) {
      console.error('Refresh token error:', err)
      router.push('/login') 
      return false
    }
  }

  async function fetchData(
    route: string,
    config: RequestInit = {}
  ): Promise<any | null> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_URL}${route}`, {
        credentials: 'include',
        ...config,
      })

      if (response.status === 401) {
          console.log(response)
        const refreshed = await refreshTokens()

        if (refreshed) {
          // ponawiamy żądanie
          const retryResponse = await fetch(`${API_URL}${route}`, {
            credentials: 'include',
            ...config,
          })

          if (!retryResponse.ok) {
            throw new Error(await retryResponse.text())
          }

          loading.value = false
          return await retryResponse.json()
        } else {
          throw new Error('Sesja wygasła, zaloguj się ponownie')
        }
      }

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      loading.value = false
      return data
    } catch (err: any) {
      error.value = err.message || 'Błąd zapytania'
      loading.value = false
      return null
    }
  }

  return { fetchData, loading, error }
}
