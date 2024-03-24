import { createApp } from 'vue';
import App from './App.vue';

import '@/styles/global/reset.scss';
import '@/styles/global/app.scss';

const app = createApp(App);
app.mount('#app');
