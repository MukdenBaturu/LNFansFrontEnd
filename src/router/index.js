import Vue from 'vue'
import Router from 'vue-router'
import TopBar from '../components/TopBar'
import Blogger from '../components/Blogger'
import Register from '../components/User/Register'
import Login from '../components/User/Login'
import PowerUserInterface from '../components/User/PowerUser/PowerUserInterface'
import LeftBar from '../components/User/PowerUser/LeftBar'
import NewBlogger from '../components/User/PowerUser/NewBlogger'
import Verify from '../components/User/PowerUser/Verify'
import DetailedArticle from '../components/DetailedArticle'
import MatchManager from '../components/User/PowerUser/MatchManager'
import MatchList from '../components/MatchList'
import WordCloud from '../components/BlogComponents/WordCloud'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      components: {
        header: TopBar,
        content: PowerUserInterface
      },
      children: [
        {
          path: '/',
          components: {
            left: Blogger,
            content: WordCloud
          }
        }
      ]
    },
    {
      // only for test
      path: '/testwordcloud',
      name: 'testwordcloud',
      components: {
        header: TopBar,
        content: WordCloud
      }
    },
    {
      path: '/match',
      name: 'match',
      components: {
        header: TopBar,
        content: MatchList
      }
    },
    {
      path: '/article',
      name: 'index',
      components: {
        header: TopBar,
        content: Blogger
      }
    },
    {
      path: '/register',
      name: 'register',
      components: {
        header: TopBar,
        content: Register
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        header: TopBar,
        content: Login
      }
    },
    {
      path: '/article/:id',
      name: 'article',
      components: {
        header: TopBar,
        content: DetailedArticle
      }
    },
    {
      path: '/admin',
      components: {
        header: TopBar,
        content: PowerUserInterface
      },
      children: [
        {
          path: 'addBlog/',
          name: 'adminAddBlog',
          components: {
            left: LeftBar,
            content: NewBlogger
          }
        },
        {
          path: 'verify/',
          name: 'adminVerify',
          components: {
            left: LeftBar,
            content: Verify
          }
        },
        {
          path: 'manageMatch/',
          name: 'adminManageMatch',
          components: {
            left: LeftBar,
            content: MatchManager
          }
        },
        {
          path: '',
          name: 'adminDefault',
          redirect: 'addBlog/'
        }
      ]
    }
  ]
})
