<template>
  <NavigationBar />

<div v-if="posts.length">
  <div
    v-for="(partBlock, partIndex) in posts"
    :key="partIndex"
    class="rosary-section"
  >
    <h2 class="part-title">Część {{ partBlock.part }}</h2>

    <div class="part-mysteries">
      <div
        v-for="(mysteryList, mysteryIndex) in partBlock.mysteries"
        :key="mysteryIndex"
        class="mystery-section"
      >
        <h3 class="mystery-title">Tajemnica {{ mysteryIndex + 1 }}</h3>
        <div class="mystery-column">
          <div class="post-list">
            <div
              v-for="postIndex in mysteryList"
              :key="postIndex"
            >
              <button
                class="post-button"
                @click="goto(postIndex, partBlock.part, mysteryIndex + 1)"
              >
                Dzień {{ postIndex }}
              </button>
            </div>
          </div>
          <button
            class="add-button"
            @click="create(mysteryList.length + 1, partBlock.part, mysteryIndex + 1)"
          >
            + Dodaj
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'
import { useRouter } from 'vue-router'
import NavigationBar from '../components/NavigationBar.vue'
// import Spinner from '../components/Spinner.vue'

const posts = ref<any[]>([])
const isLoading = ref(true)

// const parts = ['radosna', 'bolesna', 'chwalebna', 'światła']
// const mysteries = ['1', '2', '3', '4', '5']

// Domyślne wartości
const selectedMystery = ref('1')
const selectedPart = ref('radosna')

const { fetchData } = useFetchWithRefresh()
const router = useRouter()

onMounted(() => {
  fetchPosts()
})

watch([selectedPart, selectedMystery], () => {
  fetchPosts()
})

async function fetchPosts() {
  isLoading.value = true
  // posts.value = await fetchData(
  //   `/post/${selectedPart.value}/${selectedMystery.value}`
  // )
  posts.value = await fetchData('/posts')
  isLoading.value = false
}

function goto(index: number, part: string, mystery: number) {
  router.push(`/dzien/${part}/${mystery}/${index}`)
}

function create(index: number, part: string, mystery: number) {
  router.push({
    path: '/dodaj',
    query: {
      part,
      mystery: mystery.toString(),
      index: index.toString(),
    },
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

.rosary-section {
  margin-bottom: 2rem;
  /* border-bottom: 1px solid #555; */
  padding-bottom: 1rem;
}

.part-mysteries {
  
  /* border: 1px solid red; */
  /* gap: 10px; */

  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}

.part-title {
  color: #eee;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: center;
}

.mystery-title {
  color: #ccc;
  font-size: 1.1rem;
  margin: 0.5rem 0;
  text-align: center;
}

.mystery-column {
  /* border: 1px solid red; */
  width: 170px

}

</style>
