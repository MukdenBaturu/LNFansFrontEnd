<template>
  <div class="top-bar">
    <div>
      <img class="logo" src="../assets/logo.jpeg"/>
      <ul></ul>
    </div>
    <div class="title">bupt sager</div>
    <div>
      <ul>
        <li v-for="(link,index) in links" :key="index">
          <router-link class="mylink" :to="link.to">{{link.title}}</router-link>
        </li>
      </ul>
    </div>
    <template v-if="!hasUser">
      <div class="func">
        <router-link class="mylink" to="/login">登录</router-link>
        <router-link class="mylink" to="/register">注册</router-link>
      </div>
    </template>
    <template v-else>
      <div class="func">
        <span>欢迎，{{userName}}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TopBar',
  data () {
    return {
      links: [
        {
          title: '杂文',
          to: '/article'
        },
        {
          title: '比赛',
          to: '/match'
        },
        {
          title: '回忆',
          to: '/memory'
        }
      ],
      hasUser: false,
      userName: ''
    }
  },
  mounted () {
    if (window.sessionStorage.getItem('userToken') !== null) {
      this.hasUser = true
      this.userName = window.sessionStorage.getItem('userName')
    } else {
      this.hasUser = false
    }
  },
  watch: {
    '$route': function () {
      if (window.sessionStorage.getItem('userToken') !== null) {
        this.hasUser = true
        this.userName = window.sessionStorage.getItem('userName')
      } else {
        this.hasUser = false
      }
    }
  }
}
</script>

<style scoped>
@import "../assets/css/topbar/topbar.css";
</style>
