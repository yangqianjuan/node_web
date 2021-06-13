<template>
  <el-menu
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :collapse="isCollapse"
    :active-text-color="variables.menuActiveText"
    :default-active="activeName"
  >
    <template
      v-for="p in routes"
      v-if="!p.hidden&&p.children"
    >
      <template
        v-for="item in p.children"
        v-if="!item.hidden&&item.children"
      >
        <template
          v-for="child in item.children"
          v-if="!child.hidden && (p.name === $route.matched[0].name)"
        >
          <router-link
            :to="child.path"
            :key="child.name"
            v-if="child.meta&&child.meta.title"
          >
            <el-menu-item
              :index="child.name"
              router
            >
              <span>{{child.meta.title}}</span>
              <i
                v-if="child.meta.title === activeName || (!activeName)"
              ></i>
              <span
                v-else
              >&nbsp;</span>
            </el-menu-item>
          </router-link>
        </template>
      </template>
    </template>
  </el-menu>
</template>
<script>
import variables from '@/styles/variables.scss'
export default {
  props: {
    headerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  watch: {
  },
  mounted() {
  },
  computed: {
    routes() {
      return this.$router.options.routes
    },
    activeName() {
      return this.$route.name
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
