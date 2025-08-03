<template>
  <NavigationBar />
  <div class="container">
    <h2 v-if="post.index">Dzień {{ post?.index }}</h2>

    <div v-if="!isLoading">
      <label style="font-size: 20px; margin-top: 20px" class="label"
        >Wpisz tytuł:</label
      >
      <input
        style="font-size: 20px; max-width: 400px"
        class="input"
        type="text"
        v-model="post.title"
      />
    </div>

    <div v-for="(item, index) in post.data" :key="item.id">
      <!-- Drop zone ABOVE each item -->
      <div
        class="drop-zone"
        @dragover.prevent
        @dragenter.prevent="handleDragEnter(index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop(index)"
        :class="{ 'drop-zone-active': shouldHighlightDropZone(index) }"
      >
        <span style="color: navy" v-if="shouldHighlightDropZone(index)"
          >⬇️ Upuść tutaj ⬇️</span
        >
      </div>

      <!-- The draggable item -->
      <div class="item" :class="{ dragging: index === draggedIndex }">
        <!-- UCHWYT -->
        <div style="display: flex; flex-direction: row">
          <div
            class="drag-handle"
            draggable="true"
            @dragstart="(e: DragEvent) => handleDragStart(index, e)"
            @dragend="handleDragEnd"
          >
            ⠿ Przeciągnij
          </div>
          <button @click="removeItem(index)" class="delete-btn">Usuń</button>
        </div>

        <div style="padding: 15px">
          <!-- Typ tekst -->
          <template v-if="item.type === 'Text'">
            <Text :item="item" :index="index" />
          </template>

          <!-- Typ obraz -->
          <template v-else-if="item.type === 'Image'">
            <Image :item="item" :index="index" />
          </template>

          <!-- Typ wideo -->
          <template v-else-if="item.type === 'Video'">
            <Video :item="item" />
          </template>

          <!-- Gar -->
          <template v-else-if="item.type === 'Game'">
            <Game :item="item" />
          </template>
        </div>
      </div>
    </div>

    <Spinner v-show="isLoading" />

    <!-- Final drop zone at the END of the list -->
    <div
      class="drop-zone"
      @dragover.prevent
      @dragenter.prevent="handleDragEnter(post.data.length)"
      @dragleave="handleDragLeave"
      @drop="handleDrop(post.data.length)"
      :class="{ 'drop-zone-active': shouldHighlightDropZone(post.data.length) }"
    >
      <span style="color: navy" v-if="shouldHighlightDropZone(post.data.length)"
        >⬇️ Upuść tutaj ⬇️</span
      >
    </div>

    <div v-show="!isLoading" class="add-section">
      <h3>Dodaj nowy segment</h3>
      <button @click="addItem('Text')">+ Tekst</button>
      <button @click="addItem('Image')">+ Obraz</button>
      <button @click="addItem('Video')">+ Wideo</button>
      <button @click="addItem('Game')">+ Zadanie</button>
    </div>

    <button v-show="!isLoading" @click="savePost" class="save-btn">
      Opublikuj
    </button>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid' // npm install uuid lub inny sposób na generowanie ID
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Image from '../components/Image.vue'
import NavigationBar from '../components/NavigationBar.vue'
import Spinner from '../components/Spinner.vue'
import Text from '../components/Text.vue'
import Video from '../components/Video.vue'
import Game from '../components/Game.vue'
import '../style2.css'
import { useFetchWithRefresh } from '../useFetchWithRefresh'

const route = useRoute()
const isLoading = ref(true)

onMounted(async () => {
  const index = route.params.index

  if (index) {
    const result = await fetchData(`/post/${index}`, { credentials: 'include' })
    isLoading.value = false

    if (result) {
      result.data = result.data.map((item: any) => {
        if (!item.id) {
          item.id = uuidv4()
        }
        return item
      })
      post.value = result
    }
  } else {
    isLoading.value = false
    post.value.title = 'Tajemnica ' + route.query.mystery
    // Jeśli brak parametru (czyli /dodaj), to inicjalizuj z jednym pustym segmentem
    post.value.data = [
      {
        id: uuidv4(),
        type: 'Text',
        value: '',
        options: {},
      },
    ]
  }

  window.addEventListener('dragover', onGlobalDragOver)
})

const { fetchData, error } = useFetchWithRefresh()

const post = ref<any>({
  index: '',
  title: '',
  data: [],
})

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragPositionY = ref<number | null>(null)
const autoScrollInterval = ref<number | null>(null)

onUnmounted(() => {
  window.removeEventListener('dragover', onGlobalDragOver)
  stopAutoScroll()
})

function addItem(type: 'Text' | 'Image' | 'Video' | 'Game') {
  const newItem: any = { id: uuidv4(), type, value: '' }
  if (type === 'Image') newItem.options = { alt: '' }
  post.value.data.push(newItem)
}

function removeItem(index: number) {
  const item = post.value.data[index]
  const isEmpty = !item.value || item.value.trim?.() === ''

  if (!isEmpty) {
    const confirmed = confirm('Czy na pewno chcesz usunąć ten segment?')
    if (!confirmed) return
  }

  post.value.data.splice(index, 1)
}

// --- DRAG & DROP HANDLERS ---

function handleDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  startAutoScroll()

  if (!event.dataTransfer) return

  const target = event.target as HTMLElement
  if (!target) return

  const dragGhost = document.createElement('div')
  dragGhost.textContent = '📦 Przenoszenie...'
  dragGhost.style.padding = '1rem 2rem'
  dragGhost.style.background = '#3498db'
  dragGhost.style.color = 'white'
  dragGhost.style.fontWeight = 'bold'
  dragGhost.style.borderRadius = '8px'
  dragGhost.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
  dragGhost.style.pointerEvents = 'none'
  dragGhost.style.position = 'absolute'
  dragGhost.style.top = '-9999px' // schowaj poza ekranem

  document.body.appendChild(dragGhost)
  event.dataTransfer?.setDragImage(dragGhost, 0, 0)

  // 🔄 (Opcjonalnie) usuń ghost po chwili, bo już ustawiony
  setTimeout(() => {
    document.body.removeChild(dragGhost)
  }, 0)
}

function handleDragEnter(index: number) {
  dragOverIndex.value = index
}

function handleDragLeave() {
  dragOverIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
  stopAutoScroll()
}

function handleDrop(targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return

  const draggedItem = post.value.data[draggedIndex.value]
  const from = draggedIndex.value
  let to = targetIndex

  if (from < to) to--

  post.value.data.splice(from, 1)
  post.value.data.splice(to, 0, draggedItem)

  draggedIndex.value = null
  dragOverIndex.value = null
  stopAutoScroll()
}

function shouldHighlightDropZone(index: number): boolean {
  if (draggedIndex.value === null) return false
  return index !== draggedIndex.value && index !== draggedIndex.value + 1
}

// --- SCROLL AUTMATYCZNY ---

function onGlobalDragOver(e: DragEvent) {
  dragPositionY.value = e.clientY
}

function startAutoScroll() {
  if (autoScrollInterval.value !== null) return

  autoScrollInterval.value = window.setInterval(() => {
    if (draggedIndex.value === null || dragPositionY.value === null) return

    const scrollSpeed = 20
    const threshold = 100
    const y = dragPositionY.value
    const windowHeight = window.innerHeight

    if (y < threshold) {
      window.scrollBy(0, -scrollSpeed)
    } else if (y > windowHeight - threshold) {
      window.scrollBy(0, scrollSpeed)
    }
  }, 30)
}

function stopAutoScroll() {
  if (autoScrollInterval.value !== null) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}

// --- SAVE ---
const router = useRouter()

async function savePost() {
  if (!post.value.title || post.value.title.trim() === '') {
    alert('Tytuł nie może być pusty')
    return
  }

  const index = route.query.index // query parameter z /dodaj?index=
  let response
  if (index) {
    // wyślij post na /post/:index
    response = await fetchData('/post?index=' + index, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(post.value),
    }).then(() => {
      router.replace('/dzien/' + index)
    })
  } else {
    // wyślij /put na /post
    response = await fetchData('/post', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(post.value),
    })
  }

  if (response.updated || response.created) {
    alert('Zapisano!')
  }
}
</script>
