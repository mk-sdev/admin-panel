<template>
  <div class="container">
    <h2>Edytor posta – {{ post?.day }}</h2>

    <div v-for="(item, index) in post.data" :key="index" class="item">
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
import { ref, onMounted } from 'vue'
import { useFetchWithRefresh } from '../useFetchWithRefresh'

const { fetchData, error } = useFetchWithRefresh()

const post = ref<any>({
  day: '',
  data: [],
})

onMounted(async () => {
  const result = await fetchData('/dzien/123', { credentials: 'include' })
  if (result) post.value = result
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
  /* height: 315px; */
}
.item {
  margin-bottom: 2rem;
}
.add-section {
  margin-top: 2rem;
}
.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}
.save-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 1rem;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
