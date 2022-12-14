import 'uno.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'

createApp(App)
  .use(
    createVuetify({
      theme: {
        defaultTheme: 'light',
      },
    })
  )
  .use(createPinia())
  .mount('#app')
