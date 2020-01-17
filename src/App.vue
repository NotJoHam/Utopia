<template>
  <div id="app">
        <Navbar/>
        <transition name="fade" mode="out-in">
          <router-view id="page-wrap"/>
        </transition>
  </div>
</template>

<script>
  import Navbar from '@/components/NavbarOld'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      myStyle: {
        backgroundColor: "#eaeaea"
      }
    }
  }
}
</script>

<style>

  html {
    background-color: #eaeaea;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  height: 100%;
  background-color: #eaeaea;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>
