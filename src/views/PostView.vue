<template>
  <div class="container">
    <h2>Edytor posta – {{ post?.index }}</h2>

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
            @dragstart="e => handleDragStart(index, e)"
            @dragend="handleDragEnd"
          >
            ⠿ Przeciągnij
          </div>
          <button @click="removeItem(index)" class="delete-btn">Usuń</button>
        </div>

        <div style="padding: 15px">
          <!-- Typ tekst -->
          <template v-if="item.type === 'Text'">
            <QuillEditor
              style="font-size: 16px"
              v-model="item.value"
              theme="snow"
              @ready="onEditorReady(index, $event)"
              @text-change="
                (delta, oldDelta, source) => onTextChange(index, $event)
              "
            />
          </template>

          <!-- Typ obraz -->
          <template v-else-if="item.type === 'Image'">
            <div class="image-options" style="">
              <div style="width: 100%">
                <!-- Drag and drop area -->
                <label style="margin-top: 10px"
                  >Wybierz obraz z komputera:</label
                >
                <input
                  type="file"
                  accept="image/*"
                  @change="e => handleImageUpload(e, index)"
                />
                <div
                  class="dropzone"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onDrop($event, index)"
                  :class="{ 'dropzone--active': isDragging }"
                >
                  <p>Lub przeciągnij i upuść obraz tutaj</p>
                </div>

                <label style="margin-top: 10px"
                  >Lub wklej adres URL obrazu:</label
                >
                <input v-model="item.value" class="input" type="text" />
                <label>Opis obrazu (opcjonalne):</label>
                <input v-model="item.options.alt" class="input" type="text" />
              </div>
              <img
                v-if="item.value"
                :src="item.value"
                :alt="item.options.alt"
                class="preview"
              />
            </div>
          </template>

          <!-- Typ wideo -->
          <template v-else-if="item.type === 'Video'">
            <label>Wklej adres filmu:</label>
            <input
              v-model="item.value"
              class="input"
              style="max-width: 290px; margin-bottom: 15px"
              type="text"
              placeholder="https://www.youtube.com/watch?v=MNYt_FFxePk"
            />
            <iframe
              v-if="item.value"
              :src="youtubeEmbed(item.value)"
              class="video"
              frameborder="0"
              allowfullscreen
            ></iframe>
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
      @drop="handleDrop(post.data.length)"
      :class="{ 'drop-zone-active': shouldHighlightDropZone(post.data.length) }"
    >
      <span style="color: navy" v-if="shouldHighlightDropZone(post.data.length)"
        >⬇️ Upuść tutaj ⬇️</span
      >
    </div>

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
import { QuillEditor } from '@vueup/vue-quill'
import { v4 as uuidv4 } from 'uuid' // npm install uuid lub inny sposób na generowanie ID
import { useRoute, useRouter } from 'vue-router'

const editors = ref<Record<number, any>>({}) // indeks => instancja quill

function onEditorReady(index: number, editorInstance: any) {
  editors.value[index] = editorInstance

  // Jeśli już masz tekst, to załaduj go do edytora
  const item = post.value.data[index]
  if (item && item.value) {
    editorInstance.clipboard.dangerouslyPasteHTML(item.value)
  }
}

const route = useRoute()

onMounted(async () => {
  const index = route.params.index

  if (index) {
    const result = await fetchData(`/post/${index}`, { credentials: 'include' })

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
  data: [],
})

async function uploadImageToImgbb(file: File): Promise<string> {
  const NOT_API_KEY = '44d4aadd0bd5ed1a8c5e1dc5c2105cdf' // ! może nikt się nie zorientuje

  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${NOT_API_KEY}`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok || !data?.data?.url) {
    throw new Error('Nie udało się wgrać zdjęcia')
  }

  return data.data.url
}

async function handleImageUpload(event: Event, index: number) {
  const fileInput = event.target as HTMLInputElement
  if (!fileInput?.files?.length) return

  const file = fileInput.files[0]

  try {
    const imageUrl = await uploadImageToImgbb(file)
    post.value.data[index].value = imageUrl
  } catch (err) {
    console.error(err)
    alert('Nie udało się wgrać obrazka')
  }
}

let isDragging = ref(false)

function onDrop(event: DragEvent, index: number) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files?.length) return

  const fakeInputEvent = {
    target: {
      files: files,
    },
  } as unknown as Event

  handleImageUpload(fakeInputEvent, index)
}

const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragPositionY = ref<number | null>(null)
const autoScrollInterval = ref<number | null>(null)

onUnmounted(() => {
  window.removeEventListener('dragover', onGlobalDragOver)
  stopAutoScroll()
})
function onTextChange(index: number, event: unknown) {
  const editor = editors.value[index]
  if (!editor) return
  post.value.data[index].value = editor.root.innerHTML
}

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

function addItem(type: 'Text' | 'Image' | 'Video') {
  const newItem: any = { id: uuidv4(), type, value: '' }
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
      router.push('/dzien/' + index)
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

  if (response.updated) {
    alert('Zapisano!')
  }
}
</script>

<style scoped>
.container {
  width: 80vw;
  max-width: 900px;
  /* flex:1; */
  /* margin: auto; */
  /* padding: 1rem; */
  /* background-color: rgba(255, 0, 0, 0.2); */
}

.item {
  /* margin-bottom: 2rem; */
  /* padding: 1rem; */

  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
  border: 1px solid transparent;
  border-radius: 8px;
  user-select: none;
  background-color: rgb(50, 50, 60);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.input {
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 90%;
  min-width: 200px;
  justify-self: center;
  background-color: rgba(70, 70, 80, 1);
  border-radius: 7px 7px 0 0;
  border: 0;
  border-bottom: 1px solid #ccc;
}
label {
  display: block;
  margin-bottom: 10px !important;
}
.preview {
  max-width: 50%;
  min-width: 200px;
  height: auto;
  /* margin-bottom: 1rem; */
}
.video {
  width: 50%;
  max-width: 560px;
  min-width: 200px;
  aspect-ratio: 16/9;
}
.image-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
@media screen and (max-width: 800px) {
  .image-options {
    flex-direction: column;
  }
}
.item.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.drop-zone {
  height: 10px;
  margin: 8px 0;
  transition: height 0.2s ease, background-color 0.2s ease;
  user-select: none;
  border: 2px dashed transparent;
}

.drop-zone-active {
  height: 50px;
  background-color: #d0ebff;
  border-color: #3498db;
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

.dropzone {
  /* width: 100%; */
  border: 2px dashed #ccc;
  padding: 1rem;
  text-align: center;
  margin-top: 1rem;
  transition: background 0.3s ease;
}

.dropzone--active {
  background-color: #eef;
  border-color: #66f;
}

.drag-handle {
  cursor: grab;
  flex: 1;
  /* background-color: #f0f0f0; */
  padding: 0.5rem;
  color: rgba(204, 204, 204, 0.75);
  border-bottom: 1px solid rgba(204, 204, 204, 0.5);
  font-weight: bold;
  user-select: none;
}
</style>
