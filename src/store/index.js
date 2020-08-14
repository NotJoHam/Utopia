import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    color: '#00aabb',
    srcIdx: 0,
    username: ''
  },
  mutations: {
    login (state, user) {
      state.user = user
    },
    logout(state){
      state.user = null
    },
    setColor(state, color) {
      state.color = color
    },
    updateIdx(state) {
      state.srcIdx += 1
    },
    setUsername(state, username) {
      state.username = username
    }

  },
  actions: {
  },
  modules: {
  }
})
