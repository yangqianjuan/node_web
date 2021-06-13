import router from './router'
// import store from './store'
import { removeRefreshApp } from '@/utils/index'

//
router.beforeEach((to, from, next) => {
  if (from.path !== '/') {
    if (to.path !== from.path) {
      // store.commit('setPage', {
      //   name: from.name,
      //   pageNum: this.page.currentPage
      // })
      removeRefreshApp()
      // log('debug test beforeEach', from, to, to.path, from.path, to.path !== from.path)
      // this.$store.commit('cancelClicked')
    }
  }
  next()
})

router.afterEach((to, from, next) => {})
