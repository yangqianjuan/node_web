<template>
  <div
    class="sidebar-logo-container"
    :class="{'collapse':collapse}"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
        >
        <h1
          v-else
          class="sidebar-title"
        >{{ title }} </h1>
      </router-link>
      <router-link
        v-else
        key="expand"
        class="sidebar-logo-link"
        to="/"
      >
        <img
          v-if="logo"
          :src="logo"
          class="sidebar-logo"
        >
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import iconLogo from '@/image/logo.png'
export default {
  name: 'SidebarLogo',
  component: {
    iconLogo
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '智慧门店系统',
      logo: iconLogo
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #001529;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 500;
      line-height: 50px;
      font-size: 18px;
      font-family: PingFangSC-Medium, Microsoft YaHei;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
