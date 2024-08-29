import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import { en, th } from './locales'

const app = createApp(App)

const i18n = createI18n({
  locale: localStorage.getItem('your-locale-key') ?? 'en',
  fallbackLocale: 'en',
  messages: { en, th },
  legacy: false
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
