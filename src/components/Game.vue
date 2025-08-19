<template>
  <label>Wklej link do Wordwall</label>
  <input
    v-model="item.value"
    class="input"
    style="max-width: 290px"
    type="text"
    placeholder='<iframe src="..." ...></iframe>'
  />
  <span
    style="opacity: 0.6; margin-top: 10px; margin-bottom: 15px; display: block"
    >Udostępnij > Osadź na własnej stronie internetowej > Kopiuj</span
  >

  <iframe
    v-if="embedUrl"
    :src="embedUrl"
    class="task"
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<script lang="ts" setup>
import { watch, computed } from 'vue'

interface Item {
  value: string
}

const { item } = defineProps<{ item: Item }>()

//  Overwrite input contents
watch(
  () => item.value,
  newVal => {
    const iframeMatch = newVal.match(/src="([^"]+)"/)
    if (iframeMatch) {
      item.value = iframeMatch[1] // Overwrite
    }
  }
)

const embedUrl = computed(() => {
  const input = item.value.trim()

  // YouTube
  const youtubeMatch = input.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  }

  // Wordwall embed
  if (input.includes('wordwall.net/pl/embed/')) {
    return input
  }

  // Wordwall resource → embed
  const wordwallMatch = input.match(
    /wordwall\.net\/(?:[a-z-]+\/)?resource\/(\d+)/
  )
  if (wordwallMatch) {
    return `https://wordwall.net/pl/embed/${wordwallMatch[1]}?themeId=1&templateId=5&fontStackId=0`
  }

  return ''
})
</script>

<style scoped>
.task {
  width: 100%;
  max-width: 560px;
  min-width: 200px;
  aspect-ratio: 16/9;
}
</style>
