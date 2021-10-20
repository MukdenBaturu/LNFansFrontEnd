import '../assets/css/base.css'

<template>
  <div class="blog-list-wrapper" style="text-align: center; width: 800px">
    <ul class="article-list">
      <li v-for="article in articles" :key="article.articleId">
        <div class="article-wrapper">
          <span class="title"><router-link class="mylink" :to="'/article/'+article.articleId">{{article.title}}</router-link>></span>
          <span class="author">{{article.author}}</span>
        </div>
      </li>
    </ul>
    <ul class="mypage">
      <li>
        <a href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <template v-if="pageCount<5">
      <li v-for="count in pageCount" :key="count">
        <a :class="{curPage: pageNum === count}" style="text-decoration: none" href="#" @click.prevent="pageClicked(count)">{{count}}</a>
      </li>
      </template>
      <template v-else>
        <template v-if="pageNum === 1">
          <li v-for="count in 3" :key="count">
            <a :class="{curPage: count === 1}" style="text-decoration: none" href="#" @click.prevent="pageClicked(count-1+pageNum)">{{count-1+pageNum}}</a>
          </li>
          <li>...</li>
          <li><a style="text-decoration: none" href="#" @click.prevent="pageClicked(pageCount)">{{pageCount}}</a></li>
        </template>
        <template v-else-if="pageNum !== pageCount">
          <li v-show="pageNum>2">...</li>
          <li v-for="count in 3" :key="count">
            <a :class="{curPage: count === 2}" style="text-decoration: none" href="#" @click.prevent="pageClicked(count-2+pageNum)">{{count-2+pageNum}}</a>
          </li>
          <li v-show="pageNum<pageCount-1">...</li>
          <li v-show="pageNum<pageCount-1"><a style="text-decoration: none" href="#" @click.prevent="pageClicked(pageCount)">{{pageCount}}</a></li>
        </template>
        <template v-else>
          <li>...</li>
          <li v-for="count in 3" :key="count">
            <a :class="{curPage: count === 3}" style="text-decoration: none" href="#" @click.prevent="pageClicked(count-3+pageNum)">{{count-3+pageNum}}</a>
          </li>
        </template>
      </template>
      <li>
        <a href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import WordCloudBus from '../utils/WordCloudBus'
export default {
  name: 'Blogger',
  data () {
    return {
      pageNum: 1,
      pageLen: 10,
      articles: [],
      pageCount: 0
    }
  },
  mounted () {
    if (this.$route.params.pageNum !== undefined) {
      this.pageNum = this.$route.params.pageNum
    }
    if (this.$route.params.pageLen !== undefined) {
      this.pageLen = this.$route.params.pageLen
    }
    let reqMsg = {
      page: this.pageNum,
      pageLen: this.pageLen
    }
    if (window.sessionStorage.getItem('userToken') !== undefined) {
      reqMsg.jwt = window.sessionStorage.getItem('userToken')
    }

    this.$axios.post('http://localhost:3000/article/getArticles', reqMsg).then((response) => {
      if (response.data.status === 'fail') {
        this.$router.replace({name: 'login'})
        return
      }
      this.articles = response.data.curList
    })

    let pageCountMsg = {
      pageLen: this.pageLen
    }
    if (window.sessionStorage.getItem('userToken') !== undefined) {
      pageCountMsg.jwt = window.sessionStorage.getItem('userToken')
    }

    this.$axios.post('http://localhost:3000/article/getPageCount', pageCountMsg).then((response) => {
      if (response.data.status === 'fail') {
        this.$router.replace({name: 'login'})
        return
      }
      this.pageCount = Math.ceil(parseInt(response.data.pageCount, 10) / this.pageLen)
    })

    this.$axios.post('http://localhost:3000/label/getAllLabels', {
      jwt: window.sessionStorage.getItem('userToken')
    }).then((res) => {
      if (res.data.status === 'success') {
        WordCloudBus.$emit('WordCloud', res.data.labels)
      }
    })
  },
  methods: {
    pageClicked (page) {
      console.log(page)
      if (page === this.pageNum) {
        return
      }
      this.pageNum = page
      let reqMsg = {
        page: this.pageNum,
        pageLen: this.pageLen
      }
      if (window.sessionStorage.getItem('userToken') !== undefined) {
        reqMsg.jwt = window.sessionStorage.getItem('userToken')
      }

      this.$axios.post('http://localhost:3000/article/getArticles', reqMsg).then((response) => {
        if (response.data.status === 'fail') {
          this.$router.replace({name: 'login'})
          return
        }
        this.articles = response.data.curList
      })
    }
  }
}
</script>

<style scoped>
@import "../assets/css/base.css";
.blog-list-wrapper {
  margin-top: 20px;
}

.article-wrapper {
  border-top: solid white 1px;
  padding: 5px;
  text-align: left;
}

.article-list>li:nth-child(2n) {
  background-color: red;
  text-align: center;
}
.article-list>li:nth-child(2n+1) {
  background-color: black;
  text-align: center;
}

.title {
  text-align: left;
  margin-left: 5px;
  color: white;
}

.author {
  float: right;
  color: white;
}

.mylink {
  color: white;
  text-decoration: none;
}

.mypage {
  display: inline-block;
  padding-left: 0;
  border-radius: 4px;
  border: solid lightgray 1px;
  margin: 20px auto;
}

.mypage>li {
  float: left;
  padding:10px;
}

.curPage {
  color: black;
}

</style>
