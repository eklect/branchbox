import {createApp} from 'vue'
import {createPinia} from 'pinia'

// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {aliases, mdi} from 'vuetify/iconsets/mdi'

//Axios
import axios from 'axios';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'branchBox',
        themes      : {
            branchBox: {
                dark  : false,
                colors: {
                    primary  : '#343750',
                    secondary: '#684aa4',
                    accent   : '#82B1FF',
                    error    : '#FF5252',
                    info     : '#2196F3',
                    success  : '#4CAF50',
                    warning  : '#FFC107'

                }
            }
        }
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets      : {
            mdi,
        }
    }
})
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
