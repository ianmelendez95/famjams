import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './App.vue'

import './assets/main.css'
import Home from "@/components/Home.vue";
import Callback from "@/components/Callback.vue";
import PlaylistStatsSuspense from "@/components/playlist/PlaylistStatsSuspense.vue";
import PlaylistSelectSuspense from "@/components/playlist/PlaylistSelectSuspense.vue";
import {clearAccessToken, SPOTIFY_AUTH_ERROR} from "@/spotify/api";

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/callback', component: Callback },
        { path: '/playlist', component: PlaylistSelectSuspense },
        { path: '/playlist/:id', component: PlaylistStatsSuspense }
    ]
})

const app = createApp(App)

app.use(router)

app.config.errorHandler = function (err: unknown, _instance, _info) {
    if ((err as Error).message) {
        const error = err as Error
        if (error.message.startsWith(SPOTIFY_AUTH_ERROR)) {
            clearAccessToken()
            router.push("/")
        }
    }
}

app.mount('#app')
