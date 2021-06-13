<template>
  <div id="EditConfigDialog">
    <el-dialog
      :visible.sync="dialog"
      width="520px"
      :before-close="closeDialog"
      :title="titleName"
      class="selectDepartment"
    >
      <el-form
        ref="form"
        :model="form"
        size="mini"
      >
        <el-form-item
          label="品牌名称:"
          prop="brandId"
        >
          <template v-for="item in options.brandOptions">
            <template v-if="parseInt(item.id) === form.brandId">
              <span>{{item.brandName}}</span>
            </template>
          </template>
        </el-form-item>
        <el-form-item
          label="门店名称:"
          prop="storeId"
          v-show="search.type === '1'"
        >
          <template v-for="item in options.allStoreOptions">
            <template v-if="parseInt(item.value) === parseInt(form.storeId)">
              <span>{{item.name}}</span>
            </template>
          </template>
        </el-form-item>
        <el-row style="padding-bottom: 10px;">
          <span class="filter-text">当前算法参数:&nbsp;&nbsp; {{this.detail}}</span>
        </el-row>
        <el-form-item label="参数设置:">
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
import { saveConfig, toEditConfig, listStoreOptions } from '@/api/brand'
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
        editStatus: true,
        oldData: {}
      },
      detail: '',
      storeOptions: [],
      allStoreOptions: []
    }
  },
  computed: {
    titleName() {
      return '编辑参数'
    }
  },
  methods: {
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
              this.$emit('listConfig')
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
        if (!this.form.brandId) {
          this.storeOptions = res
        } else {
          this.allStoreOptions = res
        }
      })
    },
    getEditConfig(row) {
      this.listStoreOptions()
      this.form.brandId = row.brandId
      this.form.storeId = row.storeId
      if (row.currentConfig === '') {
        this.detail = row.parentConfig
      } else {
        this.detail = row.currentConfig
      }
      const params = {
        brandId: this.form.brandId,
        storeId: this.form.storeId
      }
      toEditConfig(params).then((res) => {
        this.form = res
        this.form.editStatus = true
        var str = JSON.stringify(res)
        this.form.oldData = JSON.parse(str)
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-container {
  margin: 0 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.65);

  .filter-text {
    padding-left: 20px;
    color: rgba(0, 0, 0, 0.45);
  }

  .filter-options {
    margin: 0 24px;
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
}
.addAccountDialog .el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  /*border-color: #67c23a;*/
  border-color: #dcdfe6;
}

.button-container {
  margin-top: 10px;
  padding: 10px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.09);
}

.option-container {
  padding: 0 20px;
  line-height: 12px;
}
</style>
