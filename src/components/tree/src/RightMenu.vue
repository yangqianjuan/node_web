<template>
  <div
    v-if="showPop"
    class="menu-box"
    :style="freeStyle"
    ref="menu"
  >
    <!--<slot name="above"></slot>-->
    <!--<ul class="list-unstyled">-->
    <!--<li v-for="(item,it) in items" @click="listItemClick(it)">-->
    <!--<span>-->
    <!--<i :class="item.class"></i>-->
    <!--</span>-->
    <!--<span>{{item.txt}}</span>-->
    <!--</li>-->
    <!--</ul>-->
    <!--<slot name="below"></slot>-->

    <!--<el-menu class="el-menu-vertical-demo">-->
    <!--<el-menu-item v-for="(item, key) in items" :key="key" @mousedown="mousedown($event)" :index="item.index" @click="handleSelectOptions(key)">{{item.title}}</el-menu-item>-->
    <!--</el-menu>-->
    <ul class="el-menu-vertical-demo el-menu">
      <li
        v-for="(item, key) in items"
        @mousedown="handleSelectOptions(key)"
        class="el-menu-item"
      >{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  componentName: 'RightMenu',
  props: [
    'popItems', 'mouse', 'zIndex', 'width', 'height', 'border', 'padding',
    'boxShadow', 'background', 'borderRadius', 'color'
  ],
  data() {
    return {
      freeStyle: '',
      showPop: false
    }
  },
  watch: {
    mouse() {
      const self = this
      const x = self.mouse[0]
      const y = self.mouse[1]
      if (x === 'close') {
        self.showPop = false
      } else {
        // 计算鼠标位置
        self.freeStyle = `left:${x}px; top:${y}px;` +
          `z-index:${self.zIndex};
                            width:${self.width}; height:${self.height};
                            border:${self.border}; padding: ${self.padding};
                            box-shadow:${self.boxShadow}; background: ${self.background};
                            border-radius:${self.borderRadius}; color: ${self.color}
                           `
        self.showPop = true
        if (!this.$refs.menu) {
          this.$nextTick(() => {
            const { menu } = this.$refs
            this.menu = menu
            document.body.appendChild(menu)
          })
        }
      }
      this.handleMenuStatus(self.showPop)
    },
    showPop(showPop) {
      const { overrideOncontextmenu, resetOncontextmenu } = this
      // this.$emit('open')
      if (showPop) {
        overrideOncontextmenu()
        // this.$emit('close')
      } else {
        resetOncontextmenu()
      }
    }
  },
  // mounted() {
  //   document.onmousedown = function(e) {
  //     e.preventDefault()
  //   }
  // },
  computed: {
    items() {
      return this.popItems
    }
  },
  methods: {
    handleSelectOptions(key) {
      if (key === undefined) {
        return
      }
      this.showPop = false
      this.$emit('handleSelectOptions', key)
    },

    handleMenuStatus(menuStatus) {
      this.$emit('menuStatus', menuStatus)
    },

    listItemClick(it) {
      const self = this
      self.$emit('ListItemClick', it)
    },
    overrideOncontextmenu() {
      document.body.oncontextmenu = preventExplorerMenu
    },
    resetOncontextmenu() {
      document.body.oncontextmenu = null
    }
  },
  destroyed() {
    this.resetOncontextmenu()
    this.menu && this.menu.parentNode === document.body && document.body.removeChild(this.menu)
  }
}
function preventExplorerMenu() {
  return false
}
</script>

<style scoped>
.menu-box {
  width: 150px;
  position: absolute;
  z-index: 10;
  background-color: #eee;
}
.menu-box ul li {
  cursor: pointer;
  box-sizing: border-box;
}
.menu-box ul li:hover {
  background: #f5f7fa;
}
</style>
