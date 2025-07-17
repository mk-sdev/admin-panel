<template>
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

<script lang="ts" setup>
// import { PropType } from 'vue'

interface Item {
  value: string
}

const { item } = defineProps<{
  item: Item
}>()

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]+)/)
  const videoId = match?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}
</script>

<style scoped>
.video {
  width: 100%;
  max-width: 560px;
  min-width: 200px;
  aspect-ratio: 16/9;
}
</style>
