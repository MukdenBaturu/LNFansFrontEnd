<template>
  <div class="w">
    <select class="form-control label-select" v-model="curLabelText" @change="selectLabel">
      <option v-for="label in candidateLabels" :key="label.MatchLabelId" >{{label.LabelText}}</option>
    </select>
    <div class="informer">当前标签：{{curLabelText}}</div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>比赛日期</th>
          <th>主队</th>
          <th>客队</th>
          <th>比分</th>
          <th>链接</th>
          <th>提取码</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.matchInfoId">
          <th>{{match.matchDate|dataFormat('yyyy-MM-dd')}}</th>
          <th>{{match.homeTeam}}</th>
          <th>{{match.guestTeam}}</th>
          <th>{{match.homeGoal}}:{{match.guestGoal}}</th>
          <th><a :href="match.videoLink">比赛链接</a></th>
          <th>{{match.videocode}}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MatchList',
  data () {
    return {
      test: 1,
      candidateLabels: [],
      curLabelText: '',
      matches: []
    }
  },
  mounted () {
    const _this = this
    this.$axios.post('http://localhost:3000/match/getLabels', {
      jwt: window.sessionStorage.getItem('userToken')
    }).then((res) => {
      _this.candidateLabels = res.data.labels
    })
    for (let i = 0; i < this.candidateLabels.length; i++) {
      this.candidateLabels[i].valid = 1
    }
  },
  methods: {
    selectLabel () {
      console.log('here')
      let curLabelId = -1
      for (let i = 0; i < this.candidateLabels.length; i++) {
        if (this.candidateLabels[i].LabelText === this.curLabelText) {
          curLabelId = this.candidateLabels[i].MatchLabelId
          break
        }
      }
      console.log(curLabelId)
      if (curLabelId === -1) {
        return
      }
      const _this = this
      this.$axios.post('http://localhost:3000/match/getMatchesByLabel', {
        jwt: window.sessionStorage.getItem('userToken'),
        LabelId: curLabelId
      }).then((res) => {
        if (res.data.status === 'success') {
          _this.matches = res.data.lst
        }
      })
    },
    selectMatch (matchInfoId) {
      // for (let i = 0; i < this.matches.length; i++) {
      //
      // }

    }
  }
}
</script>

<style scoped>
.w {
  margin-top: 20px;
}
.label-input {
  width: 50%;
  display: inline;
  margin-left: 10px;
}
.label-select {
  width: 20%;
  margin-left: 10px;
}
.informer {
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.match-info-header {
  width: 100%;
}
.match-info-header span{
  margin-right: 150px;
}
</style>
