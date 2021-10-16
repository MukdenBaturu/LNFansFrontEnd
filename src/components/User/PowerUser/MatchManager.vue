<template>
  <div id="match-manager-wrapper">
    <div class="add-label-wrapper">
      <div id="top"></div>
      <div>添加比赛标签</div>
      <span>比赛标签：</span><input id="labelText" v-model="matchLabelText">
      <button class="btn-primary" @click="addMatchLabel">提交</button>
      <div v-show="showLabelMsg">{{labelMsgText}}</div>
      <hr>
    </div>
    <div class="manage-label-wrapper">
      <span class="search-label">查找</span><input id="searchText" v-model="searchLabelText">
      <button class="btn-primary" @click="searchLabel">查找</button>
      <div v-show="hasResult" class="search-result-wrapper">
        <div>
          <span class="search-result-match-label" v-text="searchResult"></span>
          <button class="search-result-function btn-danger" @click="deleteLabel">删除</button>
          <button class="search-result-function btn-primary">修改</button>
        </div>
      </div>
      <hr>
      <!--数据展示部分-->
    </div>
    <div class="add-match-wrapper">
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">日期</span><DatePicker v-model="matchTime"></DatePicker>
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">主队</span><input v-model="homeTeam">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">客队</span><input v-model="guestTeam">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">网盘链接</span><input v-model="videoLink">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">提取码</span><input v-model="videoCode">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">主队进球</span><input v-model="homeGoal">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">客队进球</span><input v-model="guestGoal">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">比赛描述</span><input v-model="matchComment">
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">添加标签</span>
        <span class="dropdown">
          <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            Dropdown
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li v-for="label in candidateLabels" :key="label.MatchLabelId" @click="selectLabel(label.MatchLabelId, label.LabelText)" v-show="label.valid === 1"><a>{{label.LabelText}}</a></li>
          </ul>
        </span>
      </div>
      <div class="add-match-detail-wrapper">
        <span class="add-match-detail">已选标签</span>
        <span @click="delSelectedLabel(selectedLabel.MatchLabelId)" class="sgl-label" v-for="selectedLabel in selectedLabels" :key="selectedLabel.MatchLabelId">{{selectedLabel.LabelText}}</span>
      </div>
      <div class="add-match-detail-wrapper">
        <button class="btn-danger" @click="submitMatch">添加比赛信息</button>
      </div>
      <div class="add-match-detail-wrapper" v-show="submitMatchMsg !== ''">
        {{submitMatchMsg}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchManager',
  data () {
    return {
      matchLabelText: '',
      showLabelMsg: false,
      labelMsgText: '',
      searchLabelText: '',
      hasResult: false,
      searchResult: '',
      curLabelId: -1,
      matchTime: null,
      homeTeam: '',
      guestTeam: '',
      videoLink: '',
      videoCode: '',
      homeGoal: 0,
      guestGoal: 0,
      matchComment: '',
      matchSearchLabel: '',
      candidateLabels: [],
      selectedLabels: [],
      submitMatchMsg: ''
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
    addMatchLabel () {
      const _this = this
      if (_this.matchLabelText === '') {
        return
      }
      this.$axios.post('http://localhost:3000/match/addLabel', {
        labelText: _this.matchLabelText,
        jwt: window.sessionStorage.getItem('userToken')
      }).then((res) => {
        if (res.data.status === 'success') {
          _this.labelMsgText = '成功添加标签' + _this.matchLabelText
          _this.showLabelMsg = true
          _this.matchLabelText = ''
        } else {
          _this.labelMsgText = res.data.msg
          _this.showLabelMsg = true
          _this.matchLabelText = ''
        }
      })
    },
    searchLabel () {
      const _this = this
      if (_this.searchLabelText === '') {
        return
      }
      this.$axios.post('http://localhost:3000/match/getLabelByName', {
        jwt: window.sessionStorage.getItem('userToken'),
        labelText: _this.searchLabelText
      }).then((response) => {
        if (response.data.status === 'failed') {
          _this.hasResult = false
          _this.curLabelId = -1
          _this.searchResult = ''
          return
        }
        _this.hasResult = true
        _this.curLabelId = response.data.matchLabelId
        _this.searchResult = response.data.labelText
      })
    },
    deleteLabel () {
      const _this = this
      console.log(this.curLabelId)
      this.$axios.post('http://localhost:3000/match/deleteLabel', {
        matchLabelId: _this.curLabelId,
        jwt: window.sessionStorage.getItem('userToken')
      }).then((res) => {
        if (res.data.status === 'success') {
          _this.hasResult = false
          _this.curLabelId = -1
          _this.searchResult = ''
        }
      })
    },
    selectLabel (id, text) {
      this.selectedLabels.push({
        MatchLabelId: id,
        LabelText: text
      })
      let i = 0
      for (; i < this.candidateLabels.length; i++) {
        if (this.candidateLabels[i].MatchLabelId === id) {
          this.candidateLabels[i].valid = 0
          break
        }
      }
    },
    delSelectedLabel (id) {
      let i = 0
      for (; i < this.selectedLabels.length; i++) {
        if (id === this.selectedLabels[i].MatchLabelId) {
          break
        }
      }
      if (i !== this.selectedLabels.length) {
        this.selectedLabels.splice(i, 1)
      }
      for (i = 0; i < this.candidateLabels.length; i++) {
        if (id === this.candidateLabels[i].MatchLabelId) {
          this.candidateLabels[i].valid = 1
          break
        }
      }
    },
    submitMatch () {
      if (this.matchTime === null ||
        this.homeTeam === '' ||
        this.guestTeam === '' ||
        this.videoLink === '' ||
        this.videoCode === '' ||
        this.selectedLabels.length === 0
      ) {
        this.submitMatchMsg = '请添加必要的信息'
        return
      }
      const _this = this
      let matchLabelIds = []
      for (let i = 0; i < this.selectedLabels.length; i++) {
        matchLabelIds.push(this.selectedLabels[i].MatchLabelId)
      }
      this.$axios.post('http://localhost:3000/match/addmatch', {
        jwt: window.sessionStorage.getItem('userToken'),
        matchDate: _this.matchTime,
        homeTeam: _this.homeTeam,
        guestTeam: _this.guestTeam,
        videoLink: _this.videoLink,
        videocode: _this.videoCode,
        homeGoal: _this.homeGoal,
        guestGoal: _this.guestGoal,
        matchComment: _this.matchComment,
        matchLabelIds: matchLabelIds
      }).then((response) => {
        if (response.data.status === 'success') {
          this.submitMatchMsg = '成功添加比赛'
        } else {
          this.submitMatchMsg = '服务器内部错误'
        }
      })
    }
  }
}
</script>

<style scoped>

.add-label-wrapper {
  margin-left: 30px;
}
#match-manager-wrapper {
  margin-top: 20px;
  margin-right: 100px;
  width: 60%;
}
.add-match-wrapper{
  margin-left: 30px;
  background-color: #BDBDBD;
}
.add-match-detail-wrapper {
  padding:5px 10px;
}
.add-match-detail {
  width:100px;
  margin-right: 20px;
  display: inline-block;
}
#top {
  width: 100%;
  height: 50px;
  background-color: red;
}

.manage-label-wrapper {
  margin-left: 30px;
}

.search-result-wrapper {
  margin-top: 20px;
}

.search-result-function {
  float: right;
}

.sgl-label {
  margin-right: 5px;
  display: inline-block;
  color: white;
  background-color: red;
  border: red solid 4px;
  border-radius: 4px;
}

</style>
