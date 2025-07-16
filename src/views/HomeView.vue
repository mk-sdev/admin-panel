<template>
  <div v-for="(item, index) in posts" :key="index">
    <!-- wyświetlanie posta (przykład) -->
    <button @click="goto(index)">{{ item }}</button>
  </div>
  <button @click="create(posts.length + 1)">Dodaj</button>
  <div>
    <h2>Home</h2>
    <button @click="logout">Wyloguj się</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'

const posts = ref<any[]>([]) // Zmienna musi być reaktywna

const { fetchData } = useFetchWithRefresh()

onMounted(async () => {
  posts.value = await fetchData('/post')
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

function goto(index: number) {
  index++
  router.push('/dzien/' + index)
}

function create(index: number) {
  router.push({ path: '/dodaj', query: { index: index.toString() } })
}

</script>
