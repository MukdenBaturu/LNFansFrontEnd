<template>
  <form class="form-signin" action="#">
    <h1 class="h3 mb-3 font-weight-normal">请登录</h1>
    <h1 v-show="errorMsg">{{ errorMsg }}</h1>
    <label for="username" class="sr-only" >用户名</label>
    <input type="text" id="username" class="form-control" v-model="username" placeholder="Username" required autofocus>
    <label for="inputPassword" class="sr-only">密码</label>
    <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="Password" required>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me"> Remember me
      </label>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit" v-on:click.prevent="loginBtnClicked" >登录</button>
  </form>
</template>

<script>
import {JSEncrypt} from 'jsencrypt'

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      publicKey: '',
      errorMsg: ''
    }
  },
  mounted () {
    this.$axios.get('http://localhost:3000/user/getPublicKey').then((response) => {
      this.publicKey = response.data.publicKey
    }).catch((error) => {
      console.log(error)
    })
  },
  methods: {
    loginBtnClicked () {
      if (this.username === '' || this.password === '') {
        alert('用户名或密码不能为空')
        return
      }
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.publicKey)
      const newUsername = encrypt.encrypt(this.username)
      const newPassword = encrypt.encrypt(this.password)
      this.$axios.post('http://localhost:3000/user/login', {
        username: newUsername,
        password: newPassword
      }).then((response) => {
        if (response.data.status === 'fail') {
          this.errorMsg = response.data.msg
        } else {
          window.sessionStorage.setItem('userToken', response.data.token)
          window.sessionStorage.setItem('userName', this.username)
          this.$router.push({name: 'adminAddBlog', params: {power: response.data.power}})
        }
      })
    }
  }
}
</script>

<style scoped>
@import "../../assets/css/User/register.css";

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

</style>
