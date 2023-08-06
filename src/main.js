import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { theme: "bootstrap" })
app.component('MultiSelect', MultiSelect);
// eslint-disable-next-line vue/multi-word-component-names
app.component('Dropdown', Dropdown);

app.mount('#app')
