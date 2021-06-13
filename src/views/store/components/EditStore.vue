<template>
  <el-dialog
    :visible.sync="dialog"
    :title="title"
    width="620px"
    :before-close="closeDialog"
  >
    <template slot="title">
      <span class="dialog_title">{{title}}</span>
      <el-button
        @click="toEdit"
        :style="{display: !isAdd && !isEdit ? '' : 'none'}"
        type="plain"
        icon="el-icon-edit"
        style="margin-left: 10px;padding: 5px 5px;"
      ></el-button>
    </template>

    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormRef"
      label-width="180px"
      class="demo-ruleForm"
    >

      <el-form-item
        label="所属层级:"
        prop="parentStructName"
        class="item_class"
      >
        <template slot="label">
          <span
            v-if="isAdd"
            class="form-item_label"
          >已选区域:</span>
          <span
            v-else-if="isEdit"
            class="form-item_label"
          ><span style="color: red;">*</span>选择所属层级:</span>
          <span
            v-else
            class="form-item_label"
          >所属层级:</span>
        </template>
        <span v-if="isAdd || !isEdit">{{ruleForm.parentStructName}}</span>
        <!--<el-input v-if="isAdd || !isEdit" disabled v-model="ruleForm.parentStructName"  placeholder="请选择" size="mini" clearable @clear="clearStore" style="width: 300px;height: 40px;"></el-input>-->
        <el-dropdown
          v-else
          trigger="click"
          ref="formDrop"
          placement="bottom-start"
        >
          <el-input
            readonly
            v-model="ruleForm.parentStructName"
            placeholder="请选择"
            size="mini"
            clearable
            @clear="clearStore"
            style="width: 300px;height: 40px;"
          ></el-input>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkedNode">
              <el-dropdown-item style="padding: 0px;width: 300px;height: 300px">
                <el-scrollbar
                  wrap-class="dataTab-scrollbar-wrap"
                  style="height: 100%"
                >
                  <el-tree
                    ref="formTree"
                    default-expand-all
                    :data="treeData"
                    node-key="id"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                  >
                    <span
                      class="custom-tree-node"
                      slot-scope="{ node, data }"
                    >
                      <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                      <span style="margin-left: 5px">{{ node.label }}</span>
                      <el-checkbox
                        :label="data.id"
                        @change="handleSelectStore(data)"
                        class="dataTab-checkbox"
                      ></el-checkbox>
                    </span>
                  </el-tree>
                </el-scrollbar>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <p
        v-if="isAdd"
        style="margin: 0 0 20px 105px"
      >(仅支持在当前所选层级下添加门店)</p>
      <el-form-item
        label="门店名称:"
        prop="name"
        class="item_class"
      >
        <template slot="label">
          <span style="color: red;">*</span><span class="form-item_label">门店名称:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.name}}</span>
        <el-input
          v-model="ruleForm.name"
          v-else
          placeholder="请输入门店名称"
          class="input_item"
          type="text"
          maxlength="10"
          show-word-limit
          style="width: 300px; height: 25px"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="门店地址:"
        prop="address"
      >
        <template slot="label">
          <span style="color: red;">*</span><span class="form-item_label">门店地址:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.completeAddress}}</span>
        <div v-else>
          <el-select
            v-model="ruleForm.province"
            placeholder="请选择省份"
            style="width: 97px"
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
            v-model="ruleForm.city"
            placeholder="请选择城市"
            style="width: 97px"
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
            v-model="ruleForm.area"
            placeholder="请选择区县"
            style="width: 97px"
            @change="handleAreaChange"
          >
            <el-option
              v-for="item in trdRegions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="ruleForm.address"
            placeholder="请输入街道门牌号等详细地址信息"
            type="text"
            maxlength="30"
            show-word-limit
            class="input_item"
            style="width: 300px; height: 25px"
            size="mini"
          ></el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="门店联系人:"
        prop="linkman"
      >
        <template slot="label">
          <span class="form-item_label">门店联系人:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.linkman || '无'}}</span>
        <el-input
          v-model="ruleForm.linkman"
          v-else
          placeholder="请输入门店联系人"
          type="text"
          maxlength="5"
          show-word-limit
          class="input_item"
          style="width: 300px; height: 25px"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="联系人方式:"
        prop="phone"
      >
        <template slot="label">
          <span class="form-item_label">联系人方式:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.phone || '无'}}</span>
        <el-input
          v-model="ruleForm.phone"
          v-else
          placeholder="请输入联系人电话"
          class="input_item"
          style="width: 300px; height: 25px"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="营业时间:"
        prop="time"
      >
        <template slot="label">
          <span class="form-item_label">营业时间:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{(!time || time[0] === '' || time[1] === '') ? '无' : time[0] + ' - ' + time[1]}}</span>
        <el-time-picker
          v-else
          class="input_item"
          is-range
          v-model="time"
          value-format="HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          style="width: 300px; height: 34px"
          size="mini"
        >
        </el-time-picker>
      </el-form-item>
      <el-form-item
        label="门店员工数:"
        prop="eeNum"
      >
        <template slot="label">
          <span class="form-item_label">门店员工数:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.eeNum || '无'}}</span>
        <el-input
          v-model.number="ruleForm.eeNum"
          v-else
          placeholder="请输入门店员工数量"
          class="input_item"
          style="width: 300px; height: 25px"
          size="mini"
          auto-complete="false"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="门店面积(m²):"
        prop="square"
      >
        <template slot="label">
          <span
            v-if="!isAdd && !isEdit"
            class="form-item_label"
          >门店面积(m²):</span>
          <span
            v-else
            class="form-item_label"
          >门店面积:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.square || '无'}}</span>
        <div v-else>
          <el-input
            v-model.number="ruleForm.square"
            placeholder="请输入门店面积"
            class="input_item"
            style="width: 300px; height: 25px"
            size="mini"
          ></el-input> <span>平方米</span>
        </div>
      </el-form-item>
      <el-form-item
        label="备注:"
        prop="note"
      >
        <template slot="label">
          <span class="form-item_label">备注:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.note || '无'}}</span>
        <el-input
          v-model.number="ruleForm.note"
          v-else
          type="textarea"
          maxlength="50"
          show-word-limit
          rows="3"
          oninput="if(value.length > 50) value = value.slice(0, 50)"
          placeholder="请输入"
          class="input_item"
          style="width: 300px;"
          size="mini"
        ></el-input>
      </el-form-item>

      <el-form-item
        v-if="!isAdd && !isEdit"
        label="安装设备总数:"
        prop="devNum"
      >
        <template slot="label">
          <span class="form-item_label">安装设备总数:</span>
        </template>
        <span v-if="!isAdd && !isEdit">{{ruleForm.devNum}}</span>
        <!--<el-input v-model.number="ruleForm.devNum" :disabled="!isAdd && !isEdit" placeholder="请输入安装设备总数" class="input_item" style="width: 300px; height: 25px" size="mini"></el-input>-->
      </el-form-item>

      <div
        v-if="isAdd || isEdit"
        align="center"
        style="margin-top: 60px"
      >
        <el-button
          @click="closeDialog"
          style="margin-right: 30px; font-weight: normal; font-size: 12px"
          class="cancel-button"
          size="small"
        >取 消</el-button>
        <el-button
          @click="submitForm('ruleFormRef')"
          type="primary"
          style="margin-left: 30px; font-weight: normal; font-size: 12px"
          class="confirm-button"
          size="small"
        >保存</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { getOrgStructDic, fetchDictionary, fetchRegion } from '@/api/dictionary'
export default {
  name: 'edit-store',
  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    closeDialog: {
      type: Function,
      default: null
    }
  },

  data() {
    var validateRequiredSelect = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择'))
      } else {
        callback()
      }
    }
    var validateRequired = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        callback()
      }
    }
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
      if (value === '') {
        callback()
      } else if (!Number.isInteger(value)) {
        callback(new Error('请输入数字'))
      } else if (value <= 0) {
        callback(new Error('请输入大于0的数字'))
      } else {
        callback()
      }
    }
    return {
      checkedNode: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isAdd: false,
      isEdit: false,
      time: ['', ''],
      ruleForm: {
        parentStructId: '',
        parentStructName: '',
        name: '',
        address: '',
        linkman: '',
        phone: '',
        note: '',
        eeNum: '',
        square: '',
        province: '',
        city: '',
        area: '',
        completeAddress: ''
      },
      rules: {
        name: [
          { validator: validateRequired, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        parentStructName: [
          { validator: validateRequiredSelect, trigger: 'change' }
        ],
        address: [
          { validator: validateRequired, trigger: 'blur' }
        ],
        eeNum: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        square: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      title: '添加门店',
      fstRegions: [],
      sndRegions: [],
      trdRegions: [],
      isShow: false
    }
  },

  methods: {
    initEdit(storeInfo) {
      getOrgStructDic({ 'type': 1 }).then((res) => {
        this.treeData = res
      })
      this.ruleForm = storeInfo
      this.checkedNode = [storeInfo.parentStructId]
      if (storeInfo.startTime !== undefined) {
        this.time = [storeInfo.startTime, storeInfo.endTime]
      } else {
        this.time = ['', '']
      }
      if (this.ruleForm.eeNum === 0) {
        this.ruleForm.eeNum = ''
      }
      if (this.ruleForm.square === 0) {
        this.ruleForm.square = ''
      }
      if (storeInfo.province === undefined) {
        this.ruleForm.province = ''
      }
      if (storeInfo.city === undefined) {
        this.ruleForm.city = ''
      }
      if (storeInfo.area === undefined) {
        this.ruleForm.area = ''
      }
      this.title = '门店详情'
      this.fetchDictionary()
    },

    toEdit() {
      this.isEdit = true
      this.title = '编辑门店'
    },

    initAdd(data) {
      getOrgStructDic({ 'type': 1 }).then((res) => {
        this.treeData = res
      })
      this.ruleForm.parentStructName = data.parentName
      this.ruleForm.parentStructId = data.parentId
      this.checkedNode = [data.parentId]
      this.isAdd = true
      this.title = '添加门店'
      this.fetchDictionary()
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 是否选择了时间
          if (this.time.length > 0) {
            this.ruleForm.startTime = this.time[0]
            this.ruleForm.endTime = this.time[1]
          }
          if (!this.isShow) {
            this.ruleForm.area = ''
          }
          this.$emit('submit-form', this.ruleForm)
        } else {
          return false
        }
      })
    },

    resetForm() {
      this.time = ['', '']
      this.checkedNode = []
      this.ruleForm = {
        parentStructId: '',
        parentStructName: '',
        name: '',
        address: '',
        linkman: '',
        phone: '',
        note: '',
        eeNum: '',
        square: '',
        province: '',
        city: '',
        area: '',
        completeAddress: ''
      }
      this.fstRegions = []
      this.sndRegions = []
      this.trdRegions = []
      this.isAdd = false
      this.isEdit = false
      this.title = '添加门店'
    },

    clearStore() {
      this.ruleForm.parentStructId = ''
      this.ruleForm.parentStructName = ''
      this.checkedNode = []
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    handleSelectStore(data) {
      this.$nextTick(() => {
        this.ruleForm.parentStructName = data.label
        this.ruleForm.parentStructId = data.id
        this.$refs.formDrop.hide()
        this.checkedNode = []
        this.checkedNode.push(data.id)
      })
    },
    fetchDictionary: function () {
      this.isShow = false
      const params = {
        dictionaries: ['REGION']
      }
      fetchDictionary(params).then((res) => {
        this.fstRegions = res.regions
        this.handleProvinceChange()
      })
    },
    handleProvinceChange(val) {
      if (!val && !this.ruleForm.province) {
        return
      }
      const params = {
        code: val || this.ruleForm.province
      }
      fetchRegion(params).then((res) => {
        if (val) {
          this.ruleForm.city = ''
          this.ruleForm.area = ''
          this.isShow = false
        }
        this.sndRegions = res.data
        this.handleCityChange()
      })
    },
    handleCityChange(val) {
      if (!val && !this.ruleForm.city) {
        return
      }
      const params = {
        code: val || this.ruleForm.city
      }
      fetchRegion(params).then((res) => {
        if (val) {
          this.ruleForm.area = ''
        }
        if (res.data.length > 0) {
          this.trdRegions = res.data
          this.isShow = true
        } else {
          this.isShow = false
        }
      })
    },
    handleAreaChange(val) {
    }
  }
}
</script>

<style>
/*.el-form-item {*/
/*margin-bottom: 10px;*/
/*}*/
.dialog_title {
  font-weight: normal;
  font-size: 18px;
  font-family: 微软雅黑;
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
