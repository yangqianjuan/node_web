<template>
  <el-dialog
    title="进店次数设置"
    :visible.sync="Dialog"
    width="500px"
    :before-close="closeDialog"
    size="mini"
    class="addCargo"
  >
    <el-form
      class="addCargoFrom"
      label-width="170px"
      :model="newPlan"
      ref="newPlan"
      label-position="right"
    >
      <el-form-item label="档位">
        <el-button
          size="mid"
          type="text"
          style="color: #000000;margin-left: 25px;"
        >进店次数设置</el-button>
        <el-button
          size="mid"
          type="text"
          style="color: #000000;margin-left: 35px;"
        >操作</el-button>
      </el-form-item>
      <el-form-item
        style="margin-left: 10px"
        v-for="(domain, index) in newPlan.domains"
        :label="index|layerFilter"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
      >
        <div style="display: inline-block;margin-left: 25px;">
          <span v-if="newPlan.domains[index - 1]">{{parseInt(newPlan.domains[index - 1].value) + 1}}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
          <span v-else>1&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</span>
        </div>
        <el-input
          v-model="domain.value"
          placeholder="请输入内容"
          style="width: 50px;"
          size="small"
        ></el-input>
        <i
          @click.prevent="removeDomain(domain)"
          v-show="index === newPlan.domains.length - 1 && index !== 0"
          style="margin-left: 35px;color: #1890FF;font-size: 18px;font-weight: bold;"
          class="el-icon-remove-outline"
        ></i>
      </el-form-item>
      <el-form-item size="mini">
        <template slot="label">
          <i
            @click.prevent="addDomain()"
            style="color: ##1890FF;font-size: 18px;font-weight: bold;"
            class="el-icon-circle-plus-outline"
          ></i>
        </template>
        <el-button
          size="mid"
          type="text"
          style="color: red;font-size: 12px;padding: 0px"
          class="checkMessage"
        >{{checkMessage}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="savePlan"
          :disabled="isDisable"
        >保存</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import { saveStatisticsTimesRange, getStatisticsTimesRange } from '@/api/statistics'
export default {
  props: {
    Dialog: {
      type: Boolean,
      default: true
    },
    closeDialog: {
      type: Function,
      default: null
    }
  },
  filters: {
    layerFilter: function (value) {
      return '第' + (value + 1) + '档'
    }
  },
  data() {
    return {
      // readonly: true,
      newPlan: {
        domains: []
      },
      camNum: 0,
      scaleNum: 0,
      checkMessage: '',
      isDisable: false
    }
  },
  mounted() {
    this.getStatisticsTimesRange()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    removeDomain(item) {
      this.checkMessage = ''
      const index = this.newPlan.domains.indexOf(item)
      if (index !== -1) {
        this.newPlan.domains.splice(index, 1)
      }
    },
    addDomain() {
      if (this.newPlan.domains.length >= 4) {
        this.$message.error('超过设置档位数量上限')
        return
      }
      this.checkMessage = ''
      this.newPlan.domains.push({
        value: parseInt(this.newPlan.domains[this.newPlan.domains.length - 1].value) + 1,
        type: '1',
        key: Date.now()
      })
    },
    getStatisticsTimesRange() {
      getStatisticsTimesRange().then((res) => {
        if (res.length > 0) {
          res.forEach((data, index) => {
            this.newPlan.domains.push({
              value: data,
              type: '1',
              key: index
            })
          })
        }
      })
    },
    savePlan: function () {
      this.isDisable = true
      const range = this.newPlan.domains.map(d => d.value)
      for (var i = 0; i < range.length - 1; i++) {
        if (range[i + 1] <= range[i]) {
          this.$message.error('档位值设置错误')
          this.isDisable = false
          return
        }
      }
      const params = {
        range: this.newPlan.domains.map(d => d.value)
      }
      saveStatisticsTimesRange(params).then((res) => {
        this.isDisable = false
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.closeDialog()
          this.$emit('refreshData')
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    clear: function () {
    }
  }
}
</script>
<style>
.addCargo .error {
  margin-left: 6.5rem;
  color: red;
  font-size: 0.5em;
}
.addCargo .el-dialog__body {
  margin-bottom: 100px;
}
.addCargo .el-dialog__body {
  padding: 15px 15px;
  color: #606266;
  line-height: 24px;
  font-size: 14px;
}
.addCargo .tips2 {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  text-align: center;
  letter-spacing: 1rem;
  padding-left: 1rem;
}
.addCargo .addCargoFrom .el-form-item {
  margin-bottom: 0px;
}
.addCargo .addCargoFrom .el-form-item__label {
  margin-bottom: 0px;
}
.addCargo .addCargoFrom .el-form-item__error {
  padding-top: 0px;
}
.addCargo .addCargoFrom .el-form-item__label {
  padding-left: 50px;
}
.addCargo label {
  display: inline-block;
  max-width: 100%;
  margin-bottom: 5px;
  font-weight: 500 !important;
  color: black !important;
}
.addCargo
  .el-input-number.is-controls-right[class*="small"]
  [class*="decrease"],
.el-input-number.is-controls-right[class*="small"] [class*="increase"] {
  background-color: #1890ff;
  line-height: 15px;
}
.addCargo .addCargoInputNumber .el-icon-arrow-down:before {
  content: "\E603";
  color: white;
}
.addCargo .addCargoInputNumber .el-icon-arrow-up:before {
  content: "\E605";
  color: white;
}
.addCargo .el-icon-circle-plus-outline:before {
  cursor: pointer;
}
.addCargo .el-radio-group {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-size: 14px;
  padding-top: 5px;
}
</style>
