import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import {config} from './helpers/firebaseConfig'

import bootstrapVue from 'bootstrap-vue'
import {ValidationProvider, extend, ValidationObserver} from 'vee-validate'
import {required, email} from 'vee-validate/dist/rules'
import Vuesax from 'vuesax'
import Vuetify from 'vuetify'
import firebase from 'firebase'
import EXIF from "exif-js/exif";

import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vuesax/dist/vuesax.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.css'

Vue.config.productionTip = false
Vue.use(bootstrapVue)
Vue.use(Vuesax)
Vue.use(Vuetify)

Vue.component('validation-provider', ValidationProvider)
Vue.component('validation-observer', ValidationObserver)

extend('email', email)

extend('required', {
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true
});

extend('passwordLen', value => {
  if (value.length >= 8 && value.length <= 12) {
    return true;
  }

  return 'Password has to be between 8 and 12 characters'
})

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

firebase.initializeApp(config)

let app = ''

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    store.commit('login', user)
    app = new Vue({
      data: {color: '#eaeaea'},
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

