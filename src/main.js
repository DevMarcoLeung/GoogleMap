import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import * as  BoostrapVue  from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BoostrapVue)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAaahHV1kYLC8H2_mcrpj9YPq0iW1iHJ94',
    libraries: 'places',
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
