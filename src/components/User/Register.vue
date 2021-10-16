<template>
  <form class="form-signin" action="#">
    <h1 class="h3 mb-3 font-weight-normal">请注册</h1>
    <label for="username" class="sr-only" >用户名</label>
    <input type="text" id="username" class="form-control" v-model="username" placeholder="Username" required autofocus>
    <label for="inputPassword" class="sr-only">密码</label>
    <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="Password" required>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" value="remember-me"> Remember me
      </label>
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit" v-on:click="registerClicked">注册</button>
  </form>
</template>

<script>
import {JSEncrypt} from 'jsencrypt'

export default {
  name: 'Register',
  data () {
    return {
      username: '',
      password: '',
      publicKey: ''
    }
  },
  mounted () {
    this.$axios.get('http://localhost:3000/user/getPublicKey').then((response) => {
      this.publicKey = response.data.publicKey
    }).catch(function (error) {
      console.log(error)
    })
  },
  methods: {
    registerClicked () {
      const self = this
      if (this.username === '' || this.password === '') {
        alert('用户名或密码不能为空')
        return
      }
      const encrypt = new JSEncrypt(this.publicKey.length)
      encrypt.setPublicKey(this.publicKey)
      const newUsername = encrypt.encrypt(this.username)
      const newPassword = encrypt.encrypt(this.password)
      this.$axios.post('http://localhost:3000/user/register', {
        username: newUsername, password: newPassword}).then(function (response) {
        if (parseInt(response.data.success, 10) === 1) {
          alert(response.data.success)
          self.$router.push({name: 'login'})
        }
      }).catch(function (err) {
        throw err
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
