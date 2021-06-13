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
        if (this.checkedList.length <= 1) {
          return
        }
        this.checkedList = this.checkedList.filter(item => item !== value)
        return
      }
      if (value !== '') {
        this.checkedList.push(value)
        this.checkedList = this.checkedList.filter(item => item !== '')
      } else {
        this.checkedList = [value]
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
  margin-right: 20px;
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
