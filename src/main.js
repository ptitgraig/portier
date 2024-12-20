import './assets/main.css'
import 'vant/lib/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Locale } from 'vant';
import frFR from 'vant/es/locale/lang/fr-FR'

Locale.use('fr-FR', frFR);
const app = createApp(App)
import { ConfigProvider } from 'vant'

app.use(router)
app.use(ConfigProvider)

app.mount('#app')
