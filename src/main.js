import './assets/main.css'
import 'vant/lib/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
import { ConfigProvider } from 'vant'

app.use(router)
app.use(ConfigProvider)

app.mount('#app')
