import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

createApp(App)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right',
  } as ToastContainerOptions)
  .mount('#app')
