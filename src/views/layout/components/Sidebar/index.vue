<template>
  <div
    :class="{'has-logo':showLogo}"
    class="sidebar-container"
  >
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menu"
        :unique-opened="true"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :default-active="currentRouteName"
        @open="handleOpen"
        @select="handleSelect"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="p in permission">
          <div class="menu-wrapper">
            <template v-if="p.type === 0">
              <el-submenu
                v-if="p.children !== undefined && p.children.length > 0"
                :index="p.children[0].name"
              >
                <template slot="title">
                  <div @click="changeIconColor(p.name)">
                    <template v-if="p.icon !== '' && p.icon !== undefined">
                      <!-- <img
                        :width="$store.state.app.sidebar.opened?'14px':'20px'"
                        class="svg-icon"
                        :src="require('@/image/icon-' + p.icon + '.png')"
                      /> -->
                      <img
                        v-if="iconColorName===p.name"
                        :width="$store.state.app.sidebar.opened?'14px':'20px'"
                        class="svg-icon"
                        :src="require('@/image/' + p.icon + '-white.png')"
                      />
                      <img
                        v-else
                        :width="$store.state.app.sidebar.opened?'14px':'20px'"
                        class="svg-icon"
                        :src="require('@/image/' + p.icon + '-gray.png')"
                      />
                    </template>
                    <span v-if="p.children[0].name === openName">{{p.title}}</span>
                    <span v-else>{{p.title}}</span>
                  </div>
                </template>

                <template v-for="c in p.children">
                  <router-link
                    :to="{ name: c.name }"
                    :key="c.name"
                  >
                    <menu-item
                      :index="c.name"
                      :data="c.children"
                    >
                      <template slot="title">
                        <span class="title-item">{{c.title}}</span>
                      </template>
                    </menu-item>
                  </router-link>
                </template>
              </el-submenu>
            </template>

            <!-- 无子菜单 -->
            <template v-if="p.type === 1">
              <router-link
                :to="{ name: p.name }"
                :key="p.name"
              >
                <menu-item
                  :class="{'submenu-title-noDropdown':true}"
                  :index="p.name"
                  :data="p.children"
                  @click="handleItemCLick(p.name)"
                >
                  <div @click="changeIconColor(p.name)">
                    <template v-if="p.icon !== '' && p.icon !== undefined">
                      <img
                        v-if="iconColorName===p.name"
                        :width="$store.state.app.sidebar.opened?'14px':'20px'"
                        class="svg-icon"
                        :src="require('@/image/' + p.icon + '-white.png')"
                      />
                      <img
                        v-else
                        :width="$store.state.app.sidebar.opened?'14px':'20px'"
                        class="svg-icon"
                        :src="require('@/image/' + p.icon + '-gray.png')"
                      />
                    </template>
                    <span>{{p.title}}</span>
                  </div>
                </menu-item>
              </router-link>
            </template>
          </div>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ElementUI from 'element-ui'
import Logo from './Logo'
import variables from '@/styles/variables.scss'
export default {
  components: {
    Logo,
    MenuItem: {
      extends: ElementUI.MenuItem,
      props: {
        data: {
          // type: Array,
          required: true
        }
      }
    }
  },
  data() {
    return {
      roles: this.$store.state.user.roles,
      openName: this.$route.name,
      retryTimes: 0,
      updated: false,
      iconColorName: ''
    }
  },
  created() {
    this.iconColorName = this.matchRouteName(this.$route.name)
    this.$nextTick(function () {
      setTimeout(() => {
        // this.getUserInfo()
        this.selectMenuItem()
      }, 1)
    })
  },
  updated() {
    // this.routeValidate()
    if (!this.updated) {
      this.updated = true
      if (this.$refs.menu.items[this.currentRouteName]) {
        this.$refs.menu.handleItemClick(this.$refs.menu.items[this.currentRouteName])
      }
      // if (this.$refs.menu.submenus[this.currentRouteName] === undefined) {
      //   this.$refs.menu.open(this.$refs.menu.items[this.currentRouteName].$parent.$parent.index)
      // }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    currentRouteName() {
      return this.$route.matched[1].name
    },
    permission() {
      return this.$store.getters.getPermission
    },
    permissionList() {
      return this.$store.getters.getPermissionList
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    currentRouteName(cur, old) {
      var item = this.$refs.menu.items[cur]
      if (item !== undefined) {
        if (item) {
          this.$refs.menu.handleItemClick(item)
        }
      }
    }
  },
  methods: {
    // store中的数据可能会有延时，加一个循环解决
    matchRouteName(name) {
      const arr = [{ name: 'Dashboard', rName: 'Dashboard' }, { name: 'PassengerFlow', rName: 'StatisticsAnalyse' }, { name: 'StatisticsAnalyse', rName: 'StatisticsAnalyse' }, { name: 'VideoStore', rName: 'VideoStore' }, { name: 'CustomerManage', rName: 'CustomerList' }, { name: 'SystemManage', rName: 'StoreManage' }, { name: 'MengManage', rName: 'BrandManage' }, { name: 'DeveloperTest', rName: 'VisitData' }, { name: 'MengAttendance', rName: 'DailyStatistics' }, { name: 'ListManage', rName: 'WhiteList' }]
      const a = arr.find(item => {
        return item.rName === name
      })
      return a ? a.name : ''
    },
    selectMenuItem() {
      // var items = this.$refs.menu.items
      if ((this.$refs.menu === undefined ||
        this.$refs.menu.items === undefined ||
        this.$refs.menu.items[this.currentRouteName] === undefined) && (this.retryTimes < 5)) {
        this.retryTimes++
        setTimeout(() => { this.$nextTick(() => this.selectMenuItem()) }, 1000)
        return
      }
      this.$nextTick(() => {
        this.retryTimes = 0
        // this.routeValidate()
        if (this.$refs.menu.items[this.currentRouteName]) {
          this.$refs.menu.handleItemClick(this.$refs.menu.items[this.currentRouteName])
        }
      })
    },
    //
    // routeValidate() {
    //   if (this.permissionList.indexOf(this.currentRouteName) === -1 && this.currentRouteName !== '空白页') {
    //     this.$router.push('/')
    //   }
    // },

    handleSelect(key, keyPath, item) {
      this.iconColorName = this.matchRouteName(keyPath[0])
      this.$store.dispatch('setPrivilege', item.data)
    },

    handleItemCLick(name) {
      this.$refs.menu.close(this.openName)
      this.openName = name
    },

    handleOpen(key, keyPath) {
      this.$router.push({ name: key })
      this.openName = key
    },
    changeIconColor(name) {
      this.iconColorName = name
    }
  }
}
</script>

<style>
#app .sidebar-container {
  z-index: 2000;
}
</style>
