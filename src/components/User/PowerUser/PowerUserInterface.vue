<template>
  <div class='power-user-wrapper'>
    <router-view name='left'></router-view>
    <router-view name='content'></router-view>
  </div>
</template>

<script>
export default {
  name: 'PowerUserInterface'
}
</script>

<style scoped>
.power-user-wrapper *{
  float: left;
}
</style>
