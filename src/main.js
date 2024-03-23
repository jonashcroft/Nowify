import { createApp } from 'vue'; // Update import statement for Vue 3
import App from './App.vue';

import '@/styles/global/reset.scss';
import '@/styles/global/app.scss';

// Gebruik createApp in plaats van new Vue voor Vue 3
const app = createApp(App);
app.mount('#app'); // Vervangt .$mount('#app')
