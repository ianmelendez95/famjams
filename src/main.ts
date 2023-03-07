import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import App from './App.vue'

import HelloWorld from "@/components/HelloWorld.vue";

import './assets/main.css'
import TheWelcome from "@/components/TheWelcome.vue";

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        { path: '/', component: HelloWorld, props: { msg: 'Ian' } },
        { path: '/about', component: TheWelcome }
    ]
})

const app = createApp(App)

app.use(router)

app.mount('#app')
