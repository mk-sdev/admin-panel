<template>
  <NavigationBar />
  <div
    style="
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      padding-left: 20%;
      padding-right: 20%;
      padding-left: 20%;
      justify-content: center;

      /* background-color: red; */
    "
  >
    <div v-for="(item, index) in posts" :key="index">
      <!-- wyświetlanie posta (przykład) -->
      <button style="border: 1px solid lightyellow" @click="goto(index)">
        Dzień {{ item }}
      </button>
    </div>
  </div>
  <button style="background-color: #3498db; margin-top: 20px; width: 150px;" @click="create(posts.length + 1)">
    + Dodaj
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'
import NavigationBar from '../components/NavigationBar.vue'

const posts = ref<any[]>([]) // Zmienna musi być reaktywna

const { fetchData } = useFetchWithRefresh()

onMounted(async () => {
  posts.value = await fetchData('/post')
})

const router = useRouter()

function goto(index: number) {
  index++
  router.push('/dzien/' + index)
}

function create(index: number) {
  router.push({ path: '/dodaj', query: { index: index.toString() } })
}
</script>
