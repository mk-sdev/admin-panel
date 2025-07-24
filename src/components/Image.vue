<template>
  <div class="image-options">
    <div style="width: 100%">
      <label style="margin-top: 10px">Wybierz obraz z komputera:</label>
      <input
        style="color: #bbb"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
      />

      <div
        class="dropzone"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
        :class="{ 'dropzone--active': isDragging }"
      >
        <p>Lub przeciągnij i upuść obraz tutaj</p>
      </div>

      <label style="margin-top: 10px">Lub wklej adres URL obrazu:</label>
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

<script lang="ts" setup>
import { ref } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'

interface Item {
  value: string
  options: {
    alt?: string
  }
}

const props = defineProps<{
  item: Item
  index: number
}>()

const isDragging = ref(false)

const { fetchData } = useFetchWithRefresh()

async function uploadImageToImgbb(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file) 

  const res = await fetchData('/post/upload-imgbb', {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    body: formData,
    credentials: 'include',
  })

  if (!res.url) {
    throw new Error('Serwer nie zwrócił URL-a')
  }

  return res.url 
}

async function handleImageUpload(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (!fileInput?.files?.length) return

  const file = fileInput.files[0]

  try {
    const imageUrl = await uploadImageToImgbb(file)
    props.item.value = imageUrl
  } catch (err) {
    console.error(err)
    alert('Nie udało się wgrać obrazka')
  }
}

async function onDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files?.length) return

  const fakeInputEvent = {
    target: {
      files: files,
    },
  } as unknown as Event

  await handleImageUpload(fakeInputEvent)
}
</script>

<style scoped>
.dropzone {
  margin-top: 10px;
  padding: 20px;
  border: 2px dashed #cccccc92;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}

.dropzone--active {
  border-color: rgb(0, 51, 255);
  background-color: #c2c8d2;
  color: rgb(57, 118, 192);
}

.preview {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  /* max-width: 50%; */
  min-width: 200px;
  height: auto;
  /* margin-bottom: 1rem; */
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
</style>
