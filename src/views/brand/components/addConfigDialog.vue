<template>
  <div id="AddConfigDialog">
    <el-dialog
      :visible.sync="dialog"
      width="500px"
      :before-close="closeDialog"
      :title="titleName"
      class="selectDepartment"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
      >
        <el-form-item
          label="品牌名称:"
          prop="brandId"
        >
          <el-select
            v-model="form.brandId"
            filterable
            placeholder="请输入"
            @change="handleBrandChange"
          >
            <el-option
              v-for="item in options.brandOptions"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            > </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="门店名称:"
          prop="storeId"
          v-show="search.type === '1'"
        >
          <el-select
            v-model="form.storeId"
            filterable
            placeholder="请输入"
          >
            <el-option
              v-for="item in storeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            > </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="margin-left:12px;">参数设置:</div>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="form.scltFlag"
            active-color="#1989FA"
            :active-value=1
            :inactive-value=0
            active-text="开"
            inactive-text="关"
          ></el-switch>
          <span class="text-desc">质量分小于</span>
          <el-input-number
            v-model="form.scoreLt"
            controls-position="right"
            :min=0
            :max=100
            :disabled="form.scltFlag == 0"
            :step=1
          ></el-input-number>
          <span class="filter-text">直接过滤</span>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="form.msltFlag"
            active-color="#1989FA"
            :active-value=1
            :inactive-value=0
            active-text="开"
            inactive-text="关"
          ></el-switch>
          <span class="text-desc">匹配分小于</span>
          <el-input-number
            v-model="form.matchScoreLt"
            controls-position="right"
            :min=0
            :max=100
            :disabled="form.msltFlag == 0"
            :step=1
          ></el-input-number>
          <span class="filter-text">当中，过滤以下条件数据</span>
        </el-form-item>
        <el-row class="filter-options">
          <el-form-item>
            <el-switch
              v-model="form.sltFlag"
              active-color="#1989FA"
              :active-value=1
              :inactive-value=0
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">清晰度小于</span>
            <el-input-number
              v-model="form.sharpnessLt"
              controls-position="right"
              :min=0
              :max=60
              :disabled="form.sltFlag == 0"
              :step=1
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="form.bltFlag"
              active-color="#1989FA"
              :active-value=1
              :inactive-value=0
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">亮度分小于</span>
            <el-input-number
              v-model="form.brightnessLt"
              controls-position="right"
              :min=0
              :max=60
              :disabled="form.bltFlag == 0"
              :step=1
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="form.bgtFlag"
              active-color="#1989FA"
              :active-value=1
              :inactive-value=0
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">亮度分大于</span>
            <el-input-number
              v-model="form.brightnessGt"
              controls-position="right"
              :min=0
              :max=100
              :disabled="form.bgtFlag == 0"
              :step=1
            ></el-input-number>

          </el-form-item>
          <el-row style="padding-bottom: 10px;">
            <span class="filter-text">将满足以上三个条件的照片数据过滤，但保留：</span>
          </el-row>
          <el-form-item>
            <el-switch
              v-model="form.rscGtFlag"
              active-color="#1989FA"
              :active-value=1
              :inactive-value=0
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">质量分大于</span>
            <el-input-number
              v-model="form.retainScoreGt"
              controls-position="right"
              :min=0
              :max=100
              :disabled="form.rscGtFlag == 0"
              :step=1
            ></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="form.rsGtFlag"
              active-color="#1989FA"
              :active-value=1
              :inactive-value=0
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">清晰度大于</span>
            <el-input-number
              v-model="form.retainSharpnessGt"
              controls-position="right"
              :min=0
              :max=100
              :disabled="form.rsGtFlag == 0"
              :step=1
            ></el-input-number>
          </el-form-item>
        </el-row>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="closeDialog"
          size="small"
        >取 消</el-button>
        <el-button
          @click="submitForm('form')"
          type="primary"
          class="btn-save"
          size="small"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { saveConfig, checkConfig, listStoreOptions, getCfgDefult } from '@/api/brand'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    closeDialog: {
      type: Function,
      default: null
    },
    search: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: []
    }
  },
  data() {
    var validateBrandConfig = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        this.repeatFlag = false
        callback(new Error('品牌名称不能为空'))
      } else if (this.search.type === '0') {
        const params = {
          brandId: value
        }
        checkConfig(params).then((res) => {
          const checkFlag = res
          if (!checkFlag) {
            this.repeatFlag = true
            callback(new Error('该品牌已设置算法参数'))
          } else {
            this.repeatFlag = false
            callback()
          }
        })
      } else {
        callback()
      }
    }
    var validateStoreConfig = (rule, value, callback) => {
      if (this.search.type !== '1') {
        callback()
      }
      if (value === '' || value === undefined) {
        this.repeatFlag = false
        callback(new Error('门店名称不能为空'))
      } else {
        const params = {
          storeId: value
        }
        checkConfig(params).then((res) => {
          const checkFlag = res
          if (!checkFlag) {
            this.repeatFlag = true
            callback(new Error('该门店已设置算法参数'))
          } else {
            this.repeatFlag = false
            callback()
          }
        })
      }
    }
    return {
      form: {
        brandId: '',
        storeId: '',
        scoreLt: '',
        matchScoreLt: '',
        sharpnessLt: '',
        brightnessLt: '',
        brightnessGt: '',
        scltFlag: 0,
        msltFlag: 0,
        sltFlag: 0,
        bltFlag: 0,
        bgtFlag: 0,
        retainScoreGt: '',
        retainSharpnessGt: '',
        rscGtFlag: 0,	// 质量分大于开关
        rsGtFlag: 0, // 清晰度大于开关
        editStatus: false
      },
      detail: '',
      storeOptions: [],
      repeatFlag: false,
      rules: {
        brandId: { required: true, validator: validateBrandConfig, trigger: 'change' },
        storeId: { required: true, validator: validateStoreConfig, trigger: 'change' }
      }
    }
  },
  computed: {
    titleName() {
      return this.search.type === '0' ? '品牌参数设置' : '门店参数设置'
    }
  },
  mounted() {
    this.getCfgDefult()
  },
  methods: {
    getCfgDefult() {
      getCfgDefult().then(res => {
        this.form = res
        this.form.editStatus = false
      })
    },
    handleBrandChange() {
      this.listStoreOptions()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveConfig(this.form).then((res) => {
            if (res.msgCode === '200') {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.closeDialog()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    listStoreOptions() {
      const params = {
        brandId: this.form.brandId
      }
      listStoreOptions(params).then((res) => {
        this.storeOptions = res
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-text {
  padding-left: 20px;
  color: rgba(0, 0, 0, 0.45);
}

.filter-options {
  margin: 0 40px 16px 14px;
  padding-top: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 12px;
}

.text-desc {
  padding-right: 20px;
}
.addAccountDialog .el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  /*border-color: #67c23a;*/
  border-color: #dcdfe6;
}
</style>
