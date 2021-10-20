<template>
  <div id="wordcloudtest" style="width:400px">
    <wordcloud
      :data="words"
      nameKey="name"
      valueKey="value"
      :color="myColors"
      :showTooltip="true"
      :wordClick="wordClickHandler">
    </wordcloud>
  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud'
import WordCloudBus from '../../utils/WordCloudBus'
export default {
  name: 'wordcloudtest',
  components: {
    wordcloud
  },
  mounted () {
    WordCloudBus.$on('WordCloud', (labels) => {
      this.labels = labels
      for (let i = 0; i < labels.length; i++) {
        this.words.push({
          'name': labels[i].labelText,
          'value': 50 + Math.random() * 0
        })
      }
    })
  },
  methods: {
    wordClickHandler (name, value, vm) {
      console.log('wordClickHandler', name, value, vm)
    }
  },
  data () {
    return {
      myColors: ['#fe413b', '#feff1f', '#3a5ece'],
      words: [],
      labels: [],
      defaultWords: [{
        'name': '内容1',
        'value': 26
      },
        {
          'name': '内容2',
          'value': 19
        }, {
          'name': '内容3',
          'value': 18
        },
        {
          "name": "内容4",
          "value": 16
        },
        {
          "name": "内容5",
          "value": 15
        },
        {
          "name": "内容6",
          "value": 9
        },
        {
          "name": "内容7",
          "value": 9
        },
        {
          "name": "内容8",
          "value": 9
        },
        {
          "name": "内容9",
          "value": 6
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
