<template>
  <NavigationBar />
  <div class="post-list">
    <div v-for="(item, index) in posts" :key="index">
      <button class="post-button" @click="goto(index)">
        Dzień {{ item }}
      </button>
    </div>
  </div>

  <button class="add-button" @click="create(posts.length + 1)">
    + Dodaj
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'
import NavigationBar from '../components/NavigationBar.vue'

const posts = ref<any[]>([]) 
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

<style scoped>
.post-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-left: 20%;
  padding-right: 20%;
}

.post-button {
  border: 1px solid #777;
  background-color: rgb(50, 50, 60);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.post-button:hover {
  background-color: rgb(70, 70, 90);
}

.add-button {
  background-color: #3498db;
  color: white;
  margin-top: 20px;
  width: 150px;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-button:hover {
  background-color: #2980b9;
}
</style>
