import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";
import Queue from "../views/Queue.vue";
import Stats from "../views/Stats.vue";
import Login from "../views/Login.vue";
import LoginElectron from "../views/LoginElectron.vue";
import ClosePrompt from "../views/ClosePrompt.vue";
import CharacterCreator from "../views/CharacterCreator.vue";
import BannedView from "../views/BannedView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/login/electron",
    name: "LoginElectron",
    component: LoginElectron,
  },
  {
    path: "/closePrompt",
    name: "ClosePrompt",
    component: ClosePrompt,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
  {
    path: "/queue",
    name: "Queue",
    component: Queue,
  },
  {
    path: "/character-creator",
    name: "CharacterCreator",
    component: CharacterCreator,
  },
  {
    path: "/banned",
    name: "BannedView",
    component: BannedView,
  },
  {
    path: "/stats",
    name: "Stats",
    component: Stats,
  },
  { path: "*", redirect: "/main" },
];

const router = new VueRouter({
  routes,
});

export default router;
