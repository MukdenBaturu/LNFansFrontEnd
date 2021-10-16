<template>
  <div class='lft-wrapper'>
    <ul>
      <li><div class="item">New Blog</div></li>
      <li><div class="item">Verify</div></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LeftBar',
  data () {
    return {
      power: 0
    }
  },
  mounted () {
    console.log(this.$route)
    if (this.$route.params.power !== undefined) {
      this.power = this.$route.params.power
      console.log('defined')
    } else {
      this.power = 0
      console.log('undefined')
    }
  }
}
</script>

<style scoped>
.lft-wrapper {
  width: 200px;
  margin-top: 20px;
  margin-right: 10px;
}
.item {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px black solid;
  border-radius: 5px;
}
</style>
