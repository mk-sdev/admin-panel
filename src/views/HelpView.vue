<template>
  <NavigationBar />
  <div class="container">
    <h2>Pomoc</h2>

    <div v-for="(item, index) in post.data" :key="item.id">
      <!-- Drop zone ABOVE each item -->
      <div
        class="drop-zone"
        @dragover.prevent
        @dragenter.prevent="handleDragEnter(index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop('data', index)"
        :class="{ 'drop-zone-active': shouldHighlightDropZone('data', index) }"
      >
        <span style="color: navy" v-if="shouldHighlightDropZone('data', index)"
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
            @dragstart="(e: DragEvent) => handleDragStart('data', index, e)"
            @dragend="handleDragEnd"
          >
            ⠿ Przeciągnij
          </div>

          <button @click="removeItem(index, 'data')" class="delete-btn">
            <img
              src="../assets/bin.svg"
              alt="Usuń"
              width="100%"
              height="20px"
            />
          </button>
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

    <!-- Final drop zone at the END of the list -->
    <div
      class="drop-zone"
      @dragover.prevent
      @dragenter.prevent="handleDragEnter(post.data.length)"
      @dragleave="handleDragLeave"
      @drop="handleDrop('data', post.data.length)"
      :class="{
        'drop-zone-active': shouldHighlightDropZone('data', post.data.length),
      }"
    >
      <span
        style="color: navy"
        v-if="shouldHighlightDropZone('data', post.data.length)"
        >⬇️ Upuść tutaj ⬇️</span
      >
    </div>

    <div v-show="!isLoading" class="add-section">
      <h3>Dodaj nowy segment</h3>
      <button @click="addItem('Text', 'data')">+ Tekst</button>
      <button @click="addItem('Image', 'data')">+ Obraz</button>
      <button @click="addItem('Video', 'data')">+ Film</button>
      <!-- <button @click="addItem('Game')">+ Zadanie</button> -->
    </div>

    <Spinner v-if="isLoading" />

    <button v-show="!isLoading" @click="savePost" class="save-btn">
      Opublikuj
    </button>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid' // npm install uuid lub inny sposób na generowanie ID
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import Image from '../components/Image.vue'
import NavigationBar from '../components/NavigationBar.vue'
import Spinner from '../components/Spinner.vue'
import Text from '../components/Text.vue'
import Video from '../components/Video.vue'
import '../style2.css'
import { useFetchWithRefresh } from '../useFetchWithRefresh'

const isLoading = ref(true)

onMounted(async () => {
  const result = await fetchData(`/help`, {
    credentials: 'include',
  })
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

  window.addEventListener('dragover', onGlobalDragOver)
})

const { fetchData, error } = useFetchWithRefresh()

const post = ref<any>({
  index: '',
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

function addItem(type: 'Text' | 'Image' | 'Video', section: 'data' | 'task') {
  const newItem: any = { id: uuidv4(), type, value: '' }
  if (type === 'Image') newItem.options = { alt: '' }

  post.value[section].push(newItem)
}

function removeItem(index: number, section: 'data' | 'task') {
  const item = post.value[section][index]
  const isEmpty = !item.value || item.value.trim?.() === ''

  if (!isEmpty) {
    const confirmed = confirm('Czy na pewno chcesz usunąć ten segment?')
    if (!confirmed) return
  }

  post.value[section].splice(index, 1)
}

// --- DRAG & DROP HANDLERS ---

const draggedSection = ref<'data' | 'task' | null>(null)

function handleDragStart(
  section: 'data' | 'task',
  index: number,
  event: DragEvent
) {
  draggedIndex.value = index
  draggedSection.value = section
  startAutoScroll()

  if (!event.dataTransfer) return

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
  dragGhost.style.top = '-9999px'

  document.body.appendChild(dragGhost)
  event.dataTransfer.setDragImage(dragGhost, 0, 0)
  setTimeout(() => document.body.removeChild(dragGhost), 0)
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

function handleDrop(section: 'data' | 'task', targetIndex: number) {
  if (draggedIndex.value === null || draggedSection.value !== section) return

  const list = post.value[section]
  const from = draggedIndex.value
  let to = targetIndex

  const draggedItem = list[from]

  if (from < to) to--

  list.splice(from, 1)
  list.splice(to, 0, draggedItem)

  draggedIndex.value = null
  draggedSection.value = null
  dragOverIndex.value = null
  stopAutoScroll()
}

function shouldHighlightDropZone(
  section: 'data' | 'task',
  index: number
): boolean {
  if (draggedIndex.value === null || draggedSection.value !== section)
    return false
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

async function savePost() {
  if (post.value.data.length === 0) {
    alert('Nie można dodać pustej publikacji')
    return
  }
  const val = post.value.data[0].value
  const isEmpty = val.trim() === '' || /^<p>\s*<\/p>$/.test(val)

  if (isEmpty || val === '<p><br></p>') {
    alert('Nie można dodać pustej publikacji')
    return
  }

  // wyślij /put na /post
  let response = await fetchData('/help', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post.value),
  })
  if (response.updated) {
    toast.success('Zapisano!', { autoClose: 1000 })
  }
}
</script>
