import Vue from 'vue'
import axios from 'axios'
import vuetify from '@/plugins/vuetify'
import '@/plugins/veevalidate'
import '@/plugins/common'
import '@/plugins/googleAnalytics'
import i18n from '@/plugins/i18n'
import App from '@/App.vue'
import router from '@/router'
import { store } from '@/store'
import VueToastify from 'vue-toastify'

import * as gMaps from 'vue2-google-maps'

// import { LMarker } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

Vue.config.productionTip = false

Vue.use(VueToastify, {
  singular: true,
  withBackdrop: false,
  theme: 'light'
})

Vue.use(gMaps, {
  load: {
    key: process.env.VUE_APP_GMAPS_API_KEY,
    libraries: 'places,drawing',
    v: '3.44.4'
  }
})

const token = localStorage.getItem('token')
if (token) {
  console.log(token)
  axios.defaults.headers.common.Authorization = `Bearer ${JSON.parse(token)}`
}

const app = new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h) => h(App)
  // created() {
  //   store.dispatch('setLocale', store.getters.locale)
  //   if (store.getters.isTokenSet) {
  //     store.dispatch('autoLogin')
  //   }
  // }
}).$mount('#app')

if (window.Cypress) {
  // Only available during E2E tests
  window.app = app
}
