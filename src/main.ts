import { createApp } from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'
import Axios from './apis/ajax'
import mountVantUI from './utils/vantUI'

document.title = import.meta.env.VITE_APP_TITLE

const app = createApp(App)

app.provide('$http', Axios)

app.use(router)
app.use(store)
mountVantUI(app)
app.mount('#app')
