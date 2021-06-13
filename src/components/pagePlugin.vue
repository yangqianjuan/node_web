<template>
  <div
    v-show="page.total > 0"
    style="border-radius: 5px;background-color: #F2F2F2;height: 50px;box-shadow: 8px 8px 8px 5px;"
    class="page-plugin"
  >
    <span style="margin-left: 60px;font-size: 14px;line-height: 56px;color: #4a4a4a;">共{{page.total}}条,&nbsp;当前为第{{page.currentPage}}页
      <el-input
        placeholder=""
        type="text"
        v-model="jumperNumber"
        @input.native="changeCode"
        style="width: 80px;float: right;margin-right: 60px;margin-left: 20px"
        size="mini"
      >
        <el-button
          slot="append"
          @click="jumpPage"
          style="color: #4a4a4a;"
        >跳转</el-button>
      </el-input>
      <el-pagination
        background
        :page-size="page.pageSize"
        :pager-count="5"
        @current-change="handleCurrentChange"
        :current-page.sync="page.currentPage"
        layout=" prev, pager, next"
        :total="page.total"
      >
      </el-pagination>
    </span>
  </div>
</template>
<script>
import bus from '@/rootbus'
export default {
  props: {
    page: {
      type: Object,
      default: true
    }
  },
  watch: {
    // page: {
    //   handler: function(cur, old) {
    //     this.jumperNumber = cur.currentPage
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      jumperNumber: ''
    }
  },
  methods: {
    changeCode() {
      this.$nextTick(() => {
        if (this.jumperNumber !== null) {
          this.jumperNumber = this.jumperNumber.replace(/[^\d]/g, '')
        }
      })
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.$emit('currentPage')
      this.jumperNumber = ''
    },
    jumpPage() {
      if (this.jumperNumber > Math.floor(this.page.total / this.page.pageSize) + 1) {
        this.jumperNumber = Math.floor(this.page.total / this.page.pageSize) + 1
      }
      if (this.jumperNumber === 0 || this.jumperNumber === '0') {
        this.jumperNumber = 1
      }
      if (this.jumperNumber) {
        this.handleCurrentChange(parseInt(this.jumperNumber))
      }
    }
  },
  mounted() {
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.jumpPage()
    })
  },
  computed: {
  }
}
</script>
<style>
.page-plugin {
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100vw - 200px);
}

.page-plugin .el-pagination {
  /*padding: 2px 5px;*/
  color: #303133;
  font-weight: normal;
  float: right;
  line-height: 30px;
  height: 40px;
  padding-top: 12px;
}

.page-plugin .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  margin: 0 5px;
  background-color: #f4f4f5;
  color: #4a4a4a;
  min-width: 28px;
  height: 28px;
  border-radius: 5px;
  border: solid 1px #c2c2c2;
  line-height: 28px;
}

.page-plugin .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #477cfb;
  color: #fff;
  font-weight: bolder;
  border: solid 0px #c2c2c2;
}

.page-plugin .el-input-group__append,
.el-input-group__prepend {
  background-color: #f5f7fa;
  color: #000000;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  padding: 0 5px;
  width: 1px;
  white-space: nowrap;
}

.page-plugin .el-input__inner {
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #4a4a4a;
  display: inline-block;
  font-size: inherit;
  height: 28px !important;
  line-height: 28px !important;
  outline: 0;
  padding: 0 5px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  text-align: center;
}
.page-plugin .el-input {
  padding-top: 12px;
  color: #4a4a4a;
}
</style>
