import './style.css' 
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@vueup/vue-quill/dist/vue-quill.snow.css'  
createApp(App).use(router).mount('#app')
