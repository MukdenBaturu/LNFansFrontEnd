<template>
  <div class="w">
    <template v-if="editing">
      <input class="blog-title" v-model="newArticle.title">
    </template>
    <template v-else>
      <div v-text="article.title" class="title"></div>
    </template>
    <div v-text="article.author" class="author"></div>
    <!--这里以后要组件化-->
    <ul class="label-lst">
      <li class="sgl-label" v-for="label in labels" :key="label.labelId">
        <span class="btn-sm btn-primary">{{label.labelText}}</span>
      </li>
    </ul>
    <template v-if="editing">
      <mavon-editor
        v-model="newArticle.articleText"
        defaultOpen="preview"
        :boxShadow="false"
        style="z-index:1; height: auto"
        :editable="true"
        :subfield="true"
        :toolbarsFlag="true"
        class="articleText"
        @imgAdd="imgAdd"
        ref="md"
      >
      </mavon-editor>
    </template>
    <template v-else>
      <mavon-editor
          v-model="article.articleText"
          defaultOpen="preview"
          :boxShadow="false"
          style="z-index:1; height: auto"
          :editable="false"
          :subfield="false"
          :toolbarsFlag="false"
          class="articleText"
        >
      </mavon-editor>
    </template>
    <div v-show="edit" class="function-group">
      <button class="btn-primary function-btn" v-show="!editing" @click="editClicked">编辑</button>
      <button class="btn-danger function-btn" v-show="!editing" @click="deleteArticle">删除</button>
      <button class="btn-warning function-btn" v-show="editing" @click="returnClicked">返回</button>
      <button class="btn-danger function-btn" v-show="editing" @click="submitAlteredArticle">提交</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailedArticle',
  data () {
    return {
      text: 'test',
      article: {},
      edit: false,
      editing: false,
      newArticle: {},
      labels: [],
      addButtonText: '添加标签'
    }
  },
  mounted () {
    let articleId = this.$route.params.id

    let reqMsg = {
      articleId: articleId
    }
    if (window.sessionStorage.getItem('userToken') !== undefined) {
      reqMsg.jwt = window.sessionStorage.getItem('userToken')
    }

    this.$axios.post('http://localhost:3000/article/getArticleById', reqMsg).then((response) => {
      if (response.data.status === 'fail') {
        this.$router.replace({name: 'login'})
        return
      }
      this.article = response.data.article
      this.labels = response.data.labels
      this.edit = this.article.author === window.sessionStorage.getItem('userName')
    })
  },
  methods: {
    editClicked () {
      console.log(this.$('.articleText')[0])
      this.editing = true
      this.newArticle = JSON.parse(JSON.stringify(this.article))
    },
    returnClicked () {
      this.editing = false
      this.newArticle = null
    },
    imgAdd (pos, $file) {
      const _this = this
      const formData = new FormData()
      formData.append('img', $file)
      this.$axios.post('http://localhost:3000/article/addimg', formData, {
        headers: {'Content-Type': 'multipart/form-data', 'Authorization': window.sessionStorage.getItem('userToken')}
      }).then((response) => {
        if (response.status === 200) {
          const _url = response.data.picUrl
          console.log(response.data.picUrl)
          console.log(_this.$refs)
          _this.$refs.md.$img2Url(pos, _url)
        }
      })
    },
    submitAlteredArticle () {
      if (this.newArticle.title === '') {
        alert('文章标题不能为空')
      }
      if (this.newArticle.articleText === '') {
        alert('文章内容不能为空')
      }
      this.$axios.post('http://localhost:3000/article/edit', {
        author: this.newArticle.author,
        articleId: this.newArticle.articleId,
        title: this.newArticle.title,
        text: this.newArticle.articleText,
        jwt: window.sessionStorage.getItem('userToken')
      }).then((response) => {
        if (response.data.status !== 'success') {
          alert('更新失败')
        } else {
          location.reload()
        }
      })
    },
    deleteArticle () {
      const _this = this
      this.$axios.post('http://localhost:3000/article/delete', {
        author: this.article.author,
        jwt: window.sessionStorage.getItem('userToken'),
        articleId: this.article.articleId
      }).then((res) => {
        if (res.data.status !== 'success') {
          alert(res.data.msg)
        } else {
          _this.$router.push({name: 'index'})
        }
      })
    }
  }
}
</script>

<style scoped>
@import "../assets/css/base.css";
@import "../assets/css/components/button.css";
@import "../assets/css/components/label.css";
.blog-title {
  border: none;
  border: 0px;
  outline: none;
  width: 100%;
  font-size: 40px;
  margin-bottom: 20px;
  letter-spacing: 5px;
}
.md-wrapper{
  height: 1000px;
}
.articleText {
  margin-top: 20px;
  height: 1000px;
}
.title {
  margin: 10px auto;
  text-align: center;
  font-size: 40px;
}
.author {
  margin: 10px auto;
  text-align: center;
  font-size: 20px;
}
</style>
