import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './App.vue'

import './assets/main.css'
import Home from "@/components/Home.vue";
import Callback from "@/components/Callback.vue";
import PlaylistSelectSuspense from "@/components/playlist/PlaylistSelectSuspense.vue";

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/callback', component: Callback },
        { path: '/playlist', component: PlaylistSelectSuspense }
    ]
})

const app = createApp(App)

app.use(router)

app.mount('#app')
