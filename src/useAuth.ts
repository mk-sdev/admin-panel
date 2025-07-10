import { ref } from 'vue'
import { useFetchWithRefresh } from './useFetchWithRefresh'

export function useAuth() {
  const loggedIn = ref(false)
  const checking = ref(true)

  const { fetchData } = useFetchWithRefresh()

  const checkAuth = async () => {
    checking.value = true
    try {
      const res = await fetchData('/userinfo', {
        method: 'GET',
        credentials: 'include',
      })

      loggedIn.value = !!res
    } catch {
      loggedIn.value = false
    } finally {
      checking.value = false
    }
  }

  return { loggedIn, checking, checkAuth }
}
