<template>
  <div class="image-options">
    <div style="width: 100%">
      <label style="margin-top: 10px">Wybierz obraz z komputera:</label>
      <input
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

async function uploadImageToImgbb(file: File): Promise<string> {
  const NOT_API_KEY = '44d4aadd0bd5ed1a8c5e1dc5c2105cdf' // oczywiście do zmiany w produkcji

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
.image-options {
  margin-top: 10px;
}

.preview {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}

.dropzone {
  margin-top: 8px;
  padding: 20px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}

.dropzone--active {
  border-color: navy;
  background-color: #f0f8ff;
}
</style>
