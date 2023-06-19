import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/useAuthStore'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
const authStore = useAuthStore()
authStore.onAuthStateChange()

app.mount('#app')
