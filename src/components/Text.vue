<template>
  <QuillEditor
    style="font-size: 16px; border-radius: 0 0 5px 5px;"
    v-model="item.value"
    theme="snow"
    @ready="onEditorReady"
    @text-change="onTextChange"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

interface Item {
  value: string
}

const props = defineProps<{
  item: Item
  index: number
}>()

const editorInstance = ref<any>()

function onEditorReady(editor: any) {
  editorInstance.value = editor
  if (props.item.value) {
    editor.clipboard.dangerouslyPasteHTML(props.item.value)
  }
}

function onTextChange() {
  if (editorInstance.value) {
    props.item.value = editorInstance.value.root.innerHTML
  }
}
</script>

<style scoped>
/* opcjonalny styl lokalny */
</style>
