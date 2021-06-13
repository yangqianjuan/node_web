<template>
  <div
    id="AddNewStore"
    class="app-container"
  >
    <div class="setting-container">
      <el-row class="rule-container">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleFormRef"
          label-width="180px"
          size='small'
          class="form-container"
        >
          <el-form-item
            label="选择区域:"
            prop="parentStructName"
          >
            <el-input
              :disabled="true"
              v-model="form.parentStructName"
              placeholder="请选择区域"
              style="width: 373px;"
            ></el-input>
            <el-button
              type="text"
              @click="selectStructDialog = true"
            >重新选择</el-button>
          </el-form-item>
          <el-form-item
            label="门店名称:"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="请输入门店名称"
              class="input_item"
              type="text"
              maxlength="10"
              show-word-limit
              style="width: 373px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店地址:"
            prop="address"
          >
            <el-row>
              <el-select
                v-model="form.province"
                placeholder="请选择省份"
                style="width: 122px"
                @change="handleProvinceChange"
              >
                <el-option
                  v-for="item in fstRegions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="form.city"
                placeholder="请选择市"
                style="width: 122px"
                @change="handleCityChange"
              >
                <el-option
                  v-for="item in sndRegions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select
                v-show="isShow"
                v-model="form.area"
                placeholder="请选择区"
                style="width: 122px"
                @change="handleAreaChange"
              >
                <el-option
                  v-for="item in trdRegions"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-row>
            <el-row style="padding-top: 10px;">
              <el-input
                v-model="form.address"
                placeholder="请输入街道、门牌号等详细地址"
                type="text"
                maxlength="30"
                show-word-limit
                class="input_item"
                style="width: 373px;"
              ></el-input>
            </el-row>
          </el-form-item>
          <el-form-item
            label="联系人:"
            prop="linkman"
          >
            <el-input
              v-model="form.linkman"
              placeholder="请输入联系人"
              type="text"
              maxlength="5"
              show-word-limit
              class="input_item"
              style="width: 373px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系电话:"
            prop="phone"
          >
            <el-input
              v-model="form.phone"
              placeholder="请输入联系人电话"
              class="input_item"
              style="width: 373px;"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="营业时间:"
            prop="time"
          >
            <el-time-select
              v-model="form.startTime"
              style="width: 175px;"
              placeholder="开始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00' }"
            >
            </el-time-select>
            <span>至</span>
            <el-time-select
              arrow-control
              v-model="form.endTime"
              style="width: 175px;"
              placeholder="结束时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                minTime: form.startTime }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item
            label="门店面积:"
            prop="square"
          >
            <el-input
              v-model="form.square"
              placeholder="请输入门店面积"
              class="input_item"
              style="width: 373px;"
            ></el-input>
            <span>m<sup>2</sup></span>
          </el-form-item>
          <el-row style="padding-top: 80px;">
            <el-col align="center">
              <el-button
                size="small"
                style="margin-right: 60px;"
                @click="cancelEdit"
              >取 消</el-button>
              <el-button
                @click="submitForm('ruleFormRef')"
                type="primary"
                size="small"
              >保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

      <!-- 选择区域 -->
      <el-dialog
        ref="selectStructDialog"
        title="选择区域"
        :visible.sync="selectStructDialog"
        width="450px"
        class="selectDepartment"
      >
        <div class="departTree">
          <el-tree
            ref="formTree"
            node-key='id'
            highlight-current
            default-expand-all
            :data="treeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="selectStructDialog= false"
            size="small"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmStruct"
          >确认</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import { getOrgStructDic, fetchDictionary, fetchRegion } from '@/api/dictionary'
import { addStore } from '@/api/store'
export default {
  name: 'addNewStore',
  data() {
    var validatePhone = (rule, value, callback) => {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (value === '' || value === undefined) {
        callback()
      } else if (isNaN(value) || !reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    var checkNumber = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback()
      } else if (!Number(value)) {
        callback(new Error('请输入数字'))
      } else if (value <= 0) {
        callback(new Error('请输入大于0的数字'))
      } else {
        callback()
      }
    }
    var checkAdress = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('门店地址不能为空'))
      } else {
        if (this.form.province === '') {
          return callback(new Error('请选择省'))
        }
        if (this.form.city === '') {
          return callback(new Error('请选择市'))
        }
        if (this.trdRegions.length > 0 && this.form.area === '') {
          return callback(new Error('请选择区'))
        }
        return callback()
      }
    }
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        parentStructId: '',
        parentStructName: '',
        level: '',
        name: '',
        address: '',
        province: '',
        city: '',
        area: '',
        completeAddress: '',
        linkman: '',
        phone: '',
        startTime: '09:00',
        endTime: '21:00',
        square: ''
      },
      selectStructDialog: false,
      rules: {
        parentStructName: [
          { required: true, message: '区域不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '门店名称不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: false, validator: validatePhone, trigger: 'blur' }
        ],
        address: [
          { required: true, validator: checkAdress, trigger: 'blur' }
        ],
        square: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      treeData: [],
      selectData: '',
      fstRegions: [],
      sndRegions: [],
      trdRegions: [],
      isShow: true
    }
  },
  created() {
    this.routerQuery()
  },
  mounted() {
    this.init()
  },
  methods: {
    routerQuery() {
      this.form.parentStructName = this.$route.query.parentStructName || ''
      this.form.parentStructId = this.$route.query.parentStructId || ''
      this.form.level = this.$route.query.level || ''
    },
    init() {
      this.fetchDictionary()
      this.getTreeData()
    },
    getTreeData() {
      getOrgStructDic({ 'type': 1 }).then((res) => {
        this.treeData = res
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            storeInfo: {
              name: this.form.name,
              address: this.form.address,
              province: this.form.province,
              city: this.form.city,
              area: this.form.area,
              linkman: this.form.linkman,
              phone: this.form.phone,
              startTime: this.form.startTime,
              endTime: this.form.endTime,
              square: this.form.square
            },
            struct: {
              parentId: this.form.parentStructId,
              parentName: this.form.parentStructName,
              type: 2,
              level: this.form.level
            }
          }
          addStore(params).then((res) => {
            if (res.data) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              // 保存成功后，跳回“门店管理”
              // this.$router.push({
              //   name: 'StoreManage'
              // })
              this.$router.back(-1)
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    handleNodeClick(data) {
      this.selectData = data
    },
    confirmStruct() {
      this.form.parentStructId = this.selectData.id
      this.form.parentStructName = this.selectData.label
      this.form.level = this.selectData.level
      this.selectStructDialog = false
    },
    cancelEdit() {
      // 保存成功后，跳回“门店管理”
      // this.$router.push({
      //   name: 'StoreManage'
      // })
      this.$router.back(-1)
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['REGION']
      }
      fetchDictionary(params).then((res) => {
        this.fstRegions = res.regions
        this.handleProvinceChange()
      })
    },
    handleProvinceChange(val) {
      this.isShow = true
      if (!val && !this.form.province) {
        return
      }
      if (val) {
        this.form.city = ''
        this.form.area = ''
        this.sndRegions = []
      }
      const params = {
        code: val || this.form.province
      }
      fetchRegion(params).then((res) => {
        this.sndRegions = res.data
        this.handleCityChange()
      })
    },
    handleCityChange(val) {
      if (!val && !this.form.city) {
        return
      }
      if (val) {
        this.form.area = ''
        this.trdRegions = []
      }
      const params = {
        code: val || this.form.city
      }
      fetchRegion(params).then((res) => {
        if (res.data) {
          this.trdRegions = res.data
          this.isShow = true
        } else {
          this.isShow = false
        }
      })
    },
    handleAreaChange(val) {
      // this.E = val
    }

  }
}
</script>
<style lang="scss" scoped>
.setting-container {
  min-height: calc(100vh - 84px);
  background-color: #ffffff;
  font-size: 14px;
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  line-height: 12px;
}
.departTree {
  height: 300px;
  overflow: auto;
}
.rule-container {
  padding: 80px 0;
  .form-container {
    width: 630px;
    margin: auto;
  }
}

.text-content {
  font-size: 12px;
  font-weight: 400;
  color: rgba(24, 144, 255, 1);
  line-height: 12px;
}

.form-item_label {
  font-size: 14px;
  font-weight: normal;
  font-family: 微软雅黑;
}
.input_item input::-webkit-input-placeholder {
  font-size: 14px !important;
  font-weight: normal !important;
}
.input_item textarea::-webkit-input-placeholder {
  font-size: 14px !important;
  font-weight: normal !important;
}
.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}
.dataTab-scrollbar-wrap {
  overflow-x: hidden;
}
.el-textarea .el-input__count {
  margin-top: 0px;
  padding-top: 0px;
  height: 0px;
}
</style>
