<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="device==='mobile'&&sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    ></div>
    <Sidebar @setHeaderName="setHeaderName"></Sidebar>
    <div
      :class="{hasTagsView:needTagsView}"
      class="main-container"
    >
      <div :class="{'fixed-header':fixedHeader}">
        <cloud-header></cloud-header>
      </div>
      <el-container>
        <el-main style="height: calc(100vh - 50px); width: calc(100vw - 200px); background-color: #F0F2F5;">
          <!-- <div style="height: calc(100vh - 100px);background-color: #f2f7f9;"> -->
          <keep-alive>
            <router-view
              ref="hasSearchForm"
              v-if="$route.meta.keepAlive"
            ></router-view>
          </keep-alive>
          <router-view
            ref="hasSearchForm"
            v-if="!$route.meta.keepAlive"
          ></router-view>
          <!-- </div> -->
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { CloudHeader, Sidebar } from '@/views/layout/components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {
      showMain: true,
      headerName: ''
    }
  },
  components: {
    Sidebar,
    CloudHeader
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
  },
  methods: {
    setHeaderName(headerName) {
      this.headerName = headerName
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}
.el-main {
  display: block;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  overflow: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 16px;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;

  .hideSidebar .fixed-header {
    width: calc(100% - 50px);
  }

  .mobile .fixed-header {
    width: 100%;
  }
}
</style>
