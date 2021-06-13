import Vue from 'vue'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
// import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/assets/icon/iconfont.css'
import '@/permission' // permission control
import '@/breadcrumb' // breadcrumb store

import echarts from 'echarts'
import moment from 'moment'
import lodash from 'lodash'
import VueVideoPlayer from 'vue-video-player'

import EditableTree from './components/tree'

process.env.MOCK && require('./mock/index.js')

Vue.use(ElementUI, { locale })
Vue.use(VueVideoPlayer)
Vue.use(EditableTree)
Vue.use(echarts)

Vue.config.productionTip = false
// echarts 过大 vue文件按需引用
Vue.prototype.$echarts = echarts
Vue.prototype.$moment = moment
Vue.prototype.$_ = lodash

Vue.prototype.$moment.locale('zh-cn')

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时
  inserted: function(el) {
    // 聚焦元素
    el.focus()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
