<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import bus from '@/rootbus'
import { log, refreshApp } from '@/utils/index'
import { getInfo } from '@/api/login'

export default {
  name: 'App',
  mounted() {
    document.onkeydown = function (e) {
      const key = window.event.keyCode
      log('debug app key', key)
      if (key === 13) {
        bus.$emit('formquery')
      }
    }
    window.addEventListener('beforeunload', function (event) {
      refreshApp()
    })

    bus.$on('listenmousedown', () => {
      window.addEventListener('mousedown', this.busMouseDown)
    })

    bus.$on('removelistenmousedown', () => {
      window.removeEventListener('mousedown', this.busMouseDown)
    })
  },
  data() {
    return {
      permissionList: []
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    },
    token() {
      return this.$store.getters.getToken
    }
  },
  watch: {
    currentRouteName(cur, old) {
      if (this.permissionList.length <= 0) {
        this.getUserInfo()
      } else {
        this.routeValidate()
      }
    },
    token(cur, old) {
      this.getUserInfo()
    }
  },
  methods: {
    getUserInfo() {
      if (this.token) {
        getInfo().then((res) => {
          this.$store.dispatch('setPermission', res.data.permission)
          this.$store.dispatch('setPermissionList', res.data.permissionList)
          this.permissionList = res.data.permissionList
          this.routeValidate()
        })
      }
    },
    routeValidate() {
      if ((this.permissionList.length <= 0 || this.permissionList.indexOf(this.currentRouteName) === -1) &&
        this.currentRouteName !== '空白页' &&
        this.currentRouteName !== '根' &&
        this.currentRouteName !== '登陆') {
        this.$router.push('/')
      }
    },
    busMouseDown(e) {
      bus.$emit('onmousedown', e)
    }
  }
}
</script>
