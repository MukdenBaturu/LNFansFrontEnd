<template>
 <div>
   <input class="blog-title" v-model="title">
   <ul class="label-lst">
     <li class="sgl-label" v-for="label in labels" :key="label">
       <span class="btn-sm btn-primary" v-on:click="removeLabel(label)">{{label}}</span>
     </li>
     <span class="btn-sm btn-danger" v-on:click="addLabelClicked">
       {{addButtonText}}<input v-show="showInput" class="addLabelInput" v-model="newLabel" @blur="addLabel" @keyup.enter="addLabel">
     </span>
   </ul>
   <mavon-editor class="edit" v-model="textValue" ref="md" @imgAdd="imgAdd"></mavon-editor>
   <div class="functionBtn">
     <button class="btn btn-warning" @click="resetArticle">重置</button>
     <button class="btn btn-success" @click="submitArticle">提交</button>
   </div>
 </div>
</template>

<script>
export default {
  name: 'NewBlogger',
  data () {
    return {
      title: '',
      textValue: '',
      labels: [],
      showInput: false,
      newLabel: '',
      addButtonText: '添加标签'
    }
  },
  mounted () {
    console.log('power ' + this.$route.params.power)
  },
  methods: {
    removeLabel (labelText) {
      console.log(labelText)
      this.labels.splice(this.labels.indexOf(labelText), 1)
    },
    addLabelClicked () {
      this.addButtonText = ''
      this.showInput = true
    },
    addLabel () {
      this.showInput = false
      this.addButtonText = '添加标签'
      if (this.newLabel !== '' && this.newLabel.length <= 20) {
        this.labels.push(this.newLabel)
      }
      this.newLabel = ''
    },
    resetArticle () {
      this.title = ''
      this.labels = []
      this.textValue = ''
      this.showInput = false
      this.newLabel = ''
      this.addButtonText = '添加标签'
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
    submitArticle () {
      if (this.title === '') {
        alert('标题不能为空')
        return
      }
      if (this.labels === []) {
        alert('标签不能为空')
        return
      }
      if (this.textValue === '') {
        alert('文章内容不能为空')
        return
      }
      this.$axios.post('http://localhost:3000/article/submit', {
        title: this.title,
        text: this.textValue,
        labels: this.labels,
        jwt: window.sessionStorage.getItem('userToken')
      }).then((response) => {
        this.resetArticle()
        console.log(response.data.status)
        this.$router.push({name: 'index'})
      })
    }
  }
}
</script>

<style scoped>
.blog-title {
  border: none;
  border: 0px;
  outline: none;
  width: 100%;
  font-size: 40px;
  margin-bottom: 20px;
  letter-spacing: 5px;
}

.edit {
  width: 1000px;
}

.label-lst {
  margin-bottom: 10px;
}

.sgl-label {
  display: inline;
  margin-right: 5px;
}

.addLabelInput {
  width: 50px;
  background-color: white;
  border: none 0px;
  outline: none;
  height: 100%;
}

.functionBtn button {
  margin-top: 10px;
  margin-right: 10px;
  float: right;
}

</style>
