<template>
  <div class="container">
    <h2>Edytor posta – {{ post?.day }}</h2>

    <div v-for="(item, index) in post.data" :key="index">
      <!-- Drop zone ABOVE each item -->
      <div
        class="drop-zone"
        @dragover.prevent
        @dragenter.prevent="handleDragEnter(index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop(index)"
        :class="{ 'drop-zone-active': shouldHighlightDropZone(index) }"
      ></div>

      <!-- The draggable item -->
      <div
        class="item"
        draggable="true"
        @dragstart="e => handleDragStart(index, e)"
        @dragend="handleDragEnd"
        :class="{ dragging: index === draggedIndex }"
      >
        <template v-if="item.type === 'Text'">
          <label>Tekst:</label>
          <textarea v-model="item.value" class="textarea" rows="4"></textarea>
        </template>

        <template v-else-if="item.type === 'Image'">
          <label>URL obrazka:</label>
          <input v-model="item.value" class="input" type="text" />
          <label>Alt:</label>
          <input v-model="item.options.alt" class="input" type="text" />
          <img :src="item.value" :alt="item.options.alt" class="preview" />
        </template>

        <template v-else-if="item.type === 'Video'">
          <label>URL filmu:</label>
          <input v-model="item.value" class="input" type="text" />
          <iframe
            v-if="item.value"
            :src="youtubeEmbed(item.value)"
            class="video"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </template>

        <button @click="removeItem(index)" class="delete-btn">Usuń</button>
        <hr />
      </div>
    </div>

    <!-- Final drop zone at the END of the list -->
    <div
      class="drop-zone"
      @dragover.prevent
      @dragenter.prevent="handleDragEnter(post.data.length)"
      @dragleave="handleDragLeave"
      @drop="handleDrop(post.data.length)"
      :class="{ 'drop-zone-active': shouldHighlightDropZone(post.data.length) }"
    ></div>

    <div class="add-section">
      <h3>Dodaj nowy blok</h3>
      <button @click="addItem('Text')">+ Tekst</button>
      <button @click="addItem('Image')">+ Obraz</button>
      <button @click="addItem('Video')">+ Wideo</button>
    </div>

    <button @click="savePost" class="save-btn">💾 Zapisz</button>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'

const { fetchData, error } = useFetchWithRefresh()

const post = ref<any>({
  day: '',
  data: [],
})

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragPositionY = ref<number | null>(null)
const autoScrollInterval = ref<number | null>(null)

onMounted(async () => {
  const result = await fetchData('/dzien/123', { credentials: 'include' })
  if (result) post.value = result

  window.addEventListener('dragover', onGlobalDragOver)
})

onUnmounted(() => {
  window.removeEventListener('dragover', onGlobalDragOver)
  stopAutoScroll()
})

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

function addItem(type: 'Text' | 'Image' | 'Video') {
  const newItem: any = { type, value: '' }
  if (type === 'Image') newItem.options = { alt: '' }
  post.value.data.push(newItem)
}

function removeItem(index: number) {
  post.value.data.splice(index, 1)
}

// --- DRAG & DROP HANDLERS ---

function handleDragStart(index: number, event: DragEvent) {
  draggedIndex.value = index
  startAutoScroll()

  if (!event.dataTransfer) return

  const target = event.target as HTMLElement
  if (!target) return

  const dragImage = target.cloneNode(true) as HTMLElement

  const iframe = dragImage.querySelector('iframe')
  if (iframe) {
    const src = iframe.getAttribute('src') || ''
    const match = src.match(/\/embed\/([a-zA-Z0-9_-]+)/)
    const videoId = match ? match[1] : null

    if (videoId) {
      const img = document.createElement('img')
      img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      img.style.width = '50%'
      img.style.aspectRatio = '16/9'
      img.style.borderRadius = '8px'
      iframe.replaceWith(img)
    }
  }

  dragImage.style.position = 'absolute'
  dragImage.style.top = '-1000px'
  dragImage.style.left = '-1000px'
  dragImage.style.width = `${target.offsetWidth * 0.85}px`
  dragImage.style.transform = 'scale(0.85)'
  dragImage.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
  dragImage.style.border = '2px solid #3498db'
  dragImage.style.backgroundColor = '#fff'
  dragImage.style.borderRadius = '8px'
  dragImage.style.padding = '1rem'
  dragImage.style.pointerEvents = 'none'

  document.body.appendChild(dragImage)

  event.dataTransfer.setDragImage(dragImage, 15, 15)

  setTimeout(() => {
    if (dragImage.parentNode) dragImage.parentNode.removeChild(dragImage)
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

async function savePost() {
  const response = await fetchData('/dzien', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post.value),
  })

  if (!response.ok) {
    error.value = 'Błąd zapisu posta'
  } else {
    alert('Zapisano!')
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
.textarea {
  width: 100%;
  padding: 0.5rem;
}
.input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 50%;
  justify-self: center;
}
.preview {
  max-width: 50%;
  height: auto;
  margin-bottom: 1rem;
}
.video {
  width: 50%;
  max-width: 560px;
  aspect-ratio: 16/9;
}
.item {
  margin-bottom: 2rem;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  border: 1px solid transparent;
  background-color: white;
  border-radius: 8px;
  user-select: none;
}
.item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.drop-zone {
  height: 20px;
  margin: 8px 0;
  transition: background-color 0.2s ease;
  user-select: none;
}

.drop-zone-active {
  background-color: #d0ebff;
  border: 2px dashed #3498db;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.save-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  font-weight: bold;
  margin-top: 1rem;
  border-radius: 4px;
}

.add-section {
  margin-top: 2rem;
}
</style>
