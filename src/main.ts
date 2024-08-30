import './assets/css/main.css'
import App from './App.vue'

import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { en, th } from './locales'
import { VueQueryPlugin } from '@tanstack/vue-query'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

const i18n = createI18n({
    locale: localStorage.getItem('your-locale-key') ?? 'en',
    fallbackLocale: 'en',
    messages: { en, th },
    legacy: false
})

const pinia = createPinia()

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)
pinia.use(piniaPluginPersistedstate)

app.mount('#app')
