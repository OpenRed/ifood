<template>
  <div>
    <VueHeader></VueHeader>
    <div class="container">
      <router-view></router-view>
    </div>
    <VueFooter></VueFooter>
  </div>
</template>

<script>
  import VueHeader from './VueHeader'
  import VueFooter from './VueFooter'

  export default {
    name: "BasePage",
    components:{
      VueHeader, VueFooter
    },
    data(){
      return {
        msg: 'Hello, base page.'
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 100px;
  }
  .margin-0 { margin:0 !important; }
  .padding { padding:0 !important; }
</style>
