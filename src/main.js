import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'


import App from './App.vue'
import router from './router'
import '@/plugins/api'

import '@fortawesome/fontawesome-free/css/all.css';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

app.mount('#app')
