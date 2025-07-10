<template>
  <div>
    <h2>Home</h2>
    <button @click="logout">Wyloguj się</button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'

const { fetchData } = useFetchWithRefresh()

onMounted(async () => {
  const result = await fetchData('/userinfo')
  console.log('Dane:', result)
})

const router = useRouter()

const logout = () => {
  fetch('http://localhost:3000/logout', {
    method: 'PATCH',
    credentials: 'include',
  }).then(() => {
    router.push('/login')
  })
}
</script>
