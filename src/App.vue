<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <router-view name="header"/>
    <router-view name="content"/>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'App'
}
</script>

<style>
</style>
