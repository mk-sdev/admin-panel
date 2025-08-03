<template>
  <NavigationBar />

  <div class="filters">
    <label>
      Część różańca:
      <select v-model="selectedPart">
        <option v-for="part in parts" :key="part" :value="part">
          {{ part }}
        </option>
      </select>
    </label>

    <label>
      Tajemnica:
      <select v-model="selectedMystery">
        <option v-for="mystery in mysteries" :key="mystery" :value="mystery">
          {{ mystery }}
        </option>
      </select>
    </label>
  </div>

  <div v-if="posts.length" class="post-list">
    <div v-for="(item, index) in posts" :key="index">
      <button class="post-button" @click="goto(item)">Dzień {{ item }}</button>
    </div>
    <Spinner v-show="isLoading" />
  </div>
  <div v-else>Brak publikacji</div>

  <button class="add-button" @click="create(posts.length + 1)">+ Dodaj</button>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'
import NavigationBar from '../components/NavigationBar.vue'
import Spinner from '../components/Spinner.vue'

const posts = ref<any[]>([])
const isLoading = ref(true)

const mysteries = ['radosna', 'bolesna', 'chwalebna', 'światła']
const parts = ['1', '2', '3', '4', '5']

// Domyślne wartości
const selectedPart = ref('1')
const selectedMystery = ref('radosna')

const { fetchData } = useFetchWithRefresh()
const router = useRouter()

// Pobierz dane przy pierwszym uruchomieniu
onMounted(() => {
  fetchPosts()
})

// Automatyczne odświeżanie przy zmianie list rozwijanych
watch([selectedPart, selectedMystery], () => {
  fetchPosts()
})

async function fetchPosts() {
  isLoading.value = true
  posts.value = await fetchData(
    `/post/${selectedPart.value}/${selectedMystery.value}`
  )
  isLoading.value = false
}

function goto(index: number) {
  // index++
  router.push(
    '/dzien/' + selectedPart.value + '/' + selectedMystery.value + '/' + index
  )
}

function create(index: number) {
  router.push({
    path: '/dodaj',
    query: {
      part: selectedPart.value,
      mystery: selectedMystery.value,
      index: index.toString()
    }
  })
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

.filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 20px;
}

.filters label {
  display: flex;
  flex-direction: column;
  color: white;
}

select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #aaa;
}
</style>
