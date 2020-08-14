<template>
  <div class="home">
    <img alt="Utopia" src="../assets/logo-nb-dark.png"/>
    <HelloWorld msg="Welcome to Utopia"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
  img {
      width: 100%;
      height: auto;
      max-width: 600px;
    }
</style>
