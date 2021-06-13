<template>

</template>

<script>
export default {
  created() {
    setTimeout(() => {
      this.redirectDefault()
    }, 200)
  },
  methods: {
    redirectDefault() {
      if (this.permission.length > 0) {
        if (parseInt(this.role) === 1 || (parseInt(this.role) === 3 && process.env.BASE_API === 'http://test.store.xmartmonkey.com/manage/')) {
          this.$router.push({ name: 'MengManage' })
        } else {
          if (this.permission[0].type !== 2) {
            this.$router.push({ name: this.permission[0].name })
          } else {
            this.$router.push({ name: this.permission[1].name })
          }
        }
      } else {
        this.$router.push({ name: 'Blank' })
      }
    }
  },
  computed: {
    permission() {
      return this.$store.getters.getPermission
    },
    role() {
      return this.$store.state.user.roles
    }
  }
}
</script>

<style scoped>
</style>
