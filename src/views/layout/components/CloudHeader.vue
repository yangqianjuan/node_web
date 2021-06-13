<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <template>
        <el-select
          class="select-container"
          v-show="this.editPrivilege && (this.$route.path.indexOf('op') <= 0) &&(this.$route.path.indexOf('dev') <= 0 || this.$route.name === 'MatchTimes' ||this.$route.name === '客流概况dev'||this.$route.name === '客流属性dev'||this.$route.name ==='VisitData')&&this.$route.path.indexOf('detail')<=0"
          v-model="brandType"
          filterable
          placeholder="请输入"
          size="mini"
          @change="typeChange"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
        <el-select
          class="select-container"
          v-show="this.editPrivilege && (this.$route.path.indexOf('op') <= 0) &&(this.$route.path.indexOf('dev') <= 0 || this.$route.name === 'MatchTimes' ||this.$route.name === '客流概况dev'||this.$route.name === '客流属性dev'||this.$route.name ==='VisitData')&&this.$route.path.indexOf('detail')<=0"
          v-model="brandId"
          filterable
          placeholder="请输入"
          size="mini"
          @change="brandChange"
        >
          <el-option
            v-for="item in brandOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          > </el-option>
        </el-select>
      </template>
      <el-button
        type="text"
        style="color:#1890FF;height:50px;padding:0px;
    vertical-align: text-bottom;"
        v-if="editBigScreenPrivilege"
        @click="toBigScreen"
      >监控大屏</el-button>
      <el-dropdown class="avatar-container right-menu-item hover-effect">
        <div class="avatar-wrapper">
          <!-- <img
            v-if="this.$store.state.user.avatar !== 'null'"
            :src="avatar + '?token=' + token"
            alt=""
            class="user-avatar"
          />
          <img
            v-else
            :src="headPic"
            alt=""
            class="user-avatar"
          /> -->
          <span class="header-user-text">{{ userInfo.name }}</span>
          <img
            :src="settingImg"
            alt=""
            class="set-avatar"
          />
        </div>
        <el-dropdown-menu
          class="user-dropdown"
          slot="dropdown"
        >
          <el-dropdown-item>
            <span
              @click="resetPassword"
              style="display:block;"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              @click="logout"
              style="display:block;"
            >安全退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <reset-pwd
        ref="resetPwd"
        :dialog="resetPwdDialog"
        :closeDialog="closeResetPwdDialog"
        :userInfo="userInfo"
      ></reset-pwd>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import cloudImg from '@/image/cloud.png'
import settingImg from '@/image/icon-set.png'
import headPic from '@/image/headpic-default.png'
import { getOptions } from '@/api/brand'
import { brandChange, getUserInfo } from '@/api/account'
import { fetchDictionary } from '@/api/dictionary.js'
import resetPwd from './resetPwd'
import { getToken } from '@/utils/auth'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  name: 'CloudHeader',
  components: {
    resetPwd,
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      token: getToken(),
      cloudImg,
      settingImg,
      headPic,
      userName: this.$store.state.user.name,
      brandId: '',
      brandOptions: [],
      brandType: '',
      typeOptions: [],
      resetPwdDialog: false,
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'version',
      'sidebar',
      'avatar'
    ]),
    avatar() {
      return this.$store.state.user.avatar
    },
    role() {
      return this.$store.state.user.roles
    },
    privilege() {
      return this.$store.getters.getPrivilege
    },
    editPrivilege() {
      return this.$store.getters.getPermissionList.indexOf('切换品牌') > -1
    },
    editBigScreenPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('BigScreen') > -1
    }
  },
  watch: {
  },
  mounted() {
    this.getUserInfo()
    this.getTypeOptions()
  },
  methods: {
    toBigScreen() {
      this.$router.push({ name: 'BigScreen' })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    resetPassword() {
      this.resetPwdDialog = true
    },
    closeResetPwdDialog() {
      this.resetPwdDialog = false
      this.$refs.resetPwd.clear()
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
      sessionStorage.removeItem('iconColorName')
    },
    getTypeOptions() {
      const params = {
        dictionaries: ['BRAND_TYPE']
      }
      fetchDictionary(params).then((res) => {
        this.typeOptions = res.brandType
        this.getOptions()
      })
    },
    typeChange(value) {
      const params = {
        type: value
      }
      getOptions(params).then((res) => {
        this.brandOptions = res
        this.brandId = res[0].id + ''
        this.brandChange()
      })
    },
    getOptions(type) {
      const params = {
        type: type || this.brandType
      }
      getOptions(params).then((res) => {
        this.brandOptions = res
      })
    },
    brandChange() {
      const params = {
        brandId: this.brandId
      }
      brandChange(params).then((res) => {
        this.$router.push({ query: null })
        location.reload()
        // window.history.go(0)
      })
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        this.userInfo = res
        sessionStorage.setItem('structType', res.structType)
        sessionStorage.setItem('userId', res.id)
        this.brandId = res.brandId + ''
        this.brandType = res.brandType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .select-container {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    vertical-align: 17px;
    margin-right: 20px;
    width: 140px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
        }

        .header-user-text {
          font-size: 16px;
          margin: 0px 25px;
          color: rgba(0, 0, 0, 0.45);
        }
        .set-avatar {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
