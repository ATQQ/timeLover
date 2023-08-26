import { createApp } from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'
import Axios from './apis/ajax'
import { Toast } from 'vant';
import { Dialog } from 'vant';
document.title = import.meta.env.VITE_APP_TITLE

const app = createApp(App)

const vantGlobalComponents = [Toast, Dialog]
vantGlobalComponents.forEach(component => {
    app.use(component)
})

app.provide('$http', Axios)
app.use(router)
app.use(store)
app.mount('#app')
