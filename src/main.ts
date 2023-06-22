import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/useAuthStore'
import 'vue3-toastify/dist/index.css'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
const authStore = useAuthStore()

authStore.onAuthStateChange()

let currentTheme = localStorage.getItem('theme')
if (currentTheme == null) {
  currentTheme = 'cmyk'
}

document.getElementsByTagName('html')[0].setAttribute('data-theme', currentTheme)

app.mount('#app')
