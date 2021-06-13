<template>
  <span>
    <span
      v-for="item in attribute"
      :class="['age',{'checked':checkedList.indexOf(item.value)>-1}]"
      @click="()=>{changeChecked(item.value)}"
    >
      {{item.label}}
    </span>
  </span>
</template>
<script>
export default {
  name: 'checked',
  props: {
    attribute: {
      default: []
    },
    checked: {
      default: []
    },
    maxTags: {
      default: 10
    }
  },
  data() {
    return {}
  },
  computed: {
    checkedList: {
      get() {
        return this.checked
      },
      set(val) {
        this.$emit('changeCheckList', val)
      }
    }
  },
  methods: {
    changeChecked(value) {
      if (this.checkedList.indexOf(value) > -1) {
        this.checkedList = this.checkedList.filter(item => item !== value)
      } else {
        if (this.checkedList.length >= this.maxTags) {
          this.$message.error('最多可添加10个标签')
          return
        }
        this.checkedList.push(value)
        this.checkedList = this.checkedList.filter(item => item !== '')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.age {
  color: rgba(0, 0, 0, 0.65);
  display: inline-block;
  padding: 0px 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  margin: 0px 20px 10px 0px;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-right: 48px;
  }
  height: 28px;
  line-height: 28px;
  // opacity: 0.15;
  font-size: 12px;
}

.checked {
  color: #1890ff;
  border-color: #1890ff;
  opacity: 1;
}
</style>
