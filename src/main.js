import './style.css'
import './reset.min.css'

import './assets/bg'
// import './assets/chalkF'
import './assets/WriteIt.min.js'







import { createPinia } from 'pinia';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount('#app')
