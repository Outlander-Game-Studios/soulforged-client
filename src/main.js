import './assets/main.css'

import './utils.js'
import '@/../common/utils/index.js'
import '@/services/game.js'
import '@/services/sound.js'
import '@/services/chat.js'
import '@/services/controls.js'
import '@/services/plugin.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
