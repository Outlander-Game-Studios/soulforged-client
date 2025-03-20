import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/Main.vue'
import Queue from '../views/Queue.vue'
import Stats from '../views/Stats.vue'
import Login from '../views/Login.vue'
import LoginElectron from '../views/LoginElectron.vue'
import ClosePrompt from '../views/ClosePrompt.vue'
import CharacterCreator from '../views/CharacterCreator.vue'
import BannedView from '../views/BannedView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/login/electron',
    name: 'LoginElectron',
    component: LoginElectron,
  },
  {
    path: '/closePrompt',
    name: 'ClosePrompt',
    component: ClosePrompt,
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
  },
  {
    path: '/queue',
    name: 'Queue',
    component: Queue,
  },
  {
    path: '/character-creator',
    name: 'CharacterCreator',
    component: CharacterCreator,
  },
  {
    path: '/banned',
    name: 'BannedView',
    component: BannedView,
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
  },
  { path: '/:pathMatch(.*)*', redirect: '/main' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
