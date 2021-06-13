<template>
  <el-dialog
    :visible.sync="dialog"
    width="750px"
    :before-close="closeDialog"
    :title="titleName"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="110px"
      style="width: 85%;margin-left: auto;margin-right: auto"
    >
      <el-form-item
        label="角色名称:"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 300px"
          placeholder="请输入（如：店员）"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="permissionLabel"
        prop="rank"
      >
        <div class="permissionBox">
          <div class="permission-title">门店客流数据</div>
          <el-radio-group v-model="form.structType">
            <el-radio
              class="radio-item"
              :label="2"
              @click.native.prevent="structClickitem(2)"
            >查看所属门店数据(含客流分析、日报表、周报表、月报表)</el-radio><br>
            <el-radio
              class="radio-item"
              :label="1"
              @click.native.prevent="structClickitem(1)"
            >查看所属区域所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio><br>
            <el-radio
              class="radio-item"
              :label="0"
              @click.native.prevent="structClickitem(0)"
            >查看品牌下所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
          </el-radio-group>
        </div>
        <div class="permissionBox">
          <div class="permission-title">顾客管理</div>
          <el-radio-group v-model="form.customerPermission">
            <el-radio
              class="radio-item"
              :label="10"
              @click.native.prevent="customerClickitem(10)"
            >查看顾客列表、白名单列表数据</el-radio><br>
            <el-radio
              class="radio-item"
              :label="11"
              @click.native.prevent="customerClickitem(11)"
            >编辑(支持查询顾客、白名单、转为白名单、删除白名单等操作权限)</el-radio>
          </el-radio-group>
        </div>
        <div class="permissionBox">
          <div class="permission-title">门店列表</div>
          <el-radio-group v-model="form.storePermission">
            <el-radio
              class="radio-item"
              :label="3"
              @click.native.prevent="storeClickitem(3)"
            >查看门店列表数据</el-radio><br>
            <el-radio
              class="radio-item"
              :label="4"
              @click.native.prevent="storeClickitem(4)"
            >编辑门店（支持设备、门店及其架构的新增、删除、修改、查询功能）</el-radio>
          </el-radio-group>
          <!--<el-radio-group v-model="form.devicePermission" >-->
          <!--<el-radio :label="5"  @click.native.prevent="deviceClickitem(5)">添加设备</el-radio>-->
          <!--</el-radio-group>-->
        </div>
        <div class="permissionBox">
          <div class="permission-title">账号列表</div>
          <el-radio-group v-model="form.accountPermission">
            <el-radio
              class="radio-item"
              :label="6"
              @click.native.prevent="accountClickitem(6)"
            >查看账号列表数据</el-radio><br>
            <el-radio
              class="radio-item"
              :label="7"
              @click.native.prevent="accountClickitem(7)"
            >编辑账号（支持账号的新增、删除、修改、查询功能）</el-radio><br>
          </el-radio-group>
        </div>
        <div class="permissionBox">
          <div class="permission-title">角色列表</div>
          <el-radio-group v-model="form.rolePermission">
            <el-radio
              class="radio-item"
              :label="8"
              @click.native.prevent="roleClickitem(8)"
            >查看角色列表数据</el-radio><br>
            <el-radio
              class="radio-item"
              :label="9"
              @click.native.prevent="roleClickitem(9)"
            >编辑角色（支持角色的新增、删除、修改、查询功能）</el-radio><br>
          </el-radio-group>
        </div>
      </el-form-item>
      <div
        align="center"
        style="margin-top: 20px"
      >
        <el-button
          @click="closeDialog"
          style="margin-right: 30px"
          class="cancel-button"
          size="small"
        >取 消</el-button>
        <el-button
          @click="submitForm('form')"
          class="confirm-button"
          style="margin-left: 30px;"
          size="small"
        >保存</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { saveRole, editRole, checkRole } from '@/api/account'
export default {
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
  watch: {
  },
  data() {
    var validateRole = (rule, value, callback) => {
      if (!this.editStatus) {
        if (!value) {
          this.repeatFlag = false
          callback(new Error('角色名称不能为空'))
        } else {
          const params = {
            name: value
          }
          checkRole(params).then((res) => {
            const checkAccountFlag = res
            if (!checkAccountFlag) {
              this.repeatFlag = true
              callback(new Error('角色名称已存在'))
            } else {
              this.repeatFlag = false
              callback()
            }
          })
        }
      } else {
        callback()
      }
    }
    return {
      tab: 'info',
      form: {
        name: '',
        structType: '',
        storePermission: '',
        customerPermission: '',
        devicePermission: '',
        accountPermission: '',
        rolePermission: ''
      },
      editStatus: false,
      repeatFlag: false,
      rules: {
        name: { required: true, validator: validateRole, trigger: ['blur'] }
      },
      roleId: ''
    }
  },
  methods: {
    structClickitem(value) {
      if (!this.editStatus) {
        value === this.form.structType ? this.form.structType = '' : this.form.structType = value
      }
    },
    customerClickitem(value) {
      value === this.form.customerPermission ? this.form.customerPermission = '' : this.form.customerPermission = value
    },
    storeClickitem(value) {
      value === this.form.storePermission ? this.form.storePermission = '' : this.form.storePermission = value
    },
    deviceClickitem(value) {
      value === this.form.devicePermission ? this.form.devicePermission = '' : this.form.devicePermission = value
    },
    accountClickitem(value) {
      value === this.form.accountPermission ? this.form.accountPermission = '' : this.form.accountPermission = value
    },
    roleClickitem(value) {
      value === this.form.rolePermission ? this.form.rolePermission = '' : this.form.rolePermission = value
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.roleId,
            name: this.form.name,
            structType: this.form.structType,
            storePermission: this.form.storePermission,
            customerPermission: this.form.customerPermission,
            devicePermission: this.form.devicePermission,
            accountPermission: this.form.accountPermission,
            rolePermission: this.form.rolePermission,
            editStatus: this.editStatus
          }
          saveRole(params).then((res) => {
            if (res.msgCode === '200') {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$emit('listRoles')
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
    getEditRoleInfo(row) {
      this.editStatus = true
      this.roleId = row.id
      const params = {
        id: row.id
      }
      editRole(params).then((res) => {
        this.form = res
      })
    },
    resetForm(formName) {
      this.checkedStore = []
      this.$refs[formName].resetFields()
      this.form.structType = ''
      this.form.storePermission = ''
      this.form.devicePermission = ''
      this.form.customerPermission = ''
      this.form.accountPermission = ''
      this.form.rolePermission = ''
      this.editStatus = false
    }
  },
  mounted() {
  },
  computed: {
    titleName() {
      return this.editStatus === true ? '编辑角色' : '添加角色'
    },
    permissionLabel() {
      return this.editStatus === true ? '角色权限:' : '选择权限:'
    },
    showCheckBox() {
      return function (data, rank) {
        if ((data.type === 0 && rank === 1) || (data.type === 1 && rank === 2) || (data.type === 2 && rank === 3) || (data.type === 2 && rank === 4)) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
</script>
<style>
.addAccountDialog .el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  /*border-color: #67c23a;*/
  border-color: #dcdfe6;
}

.addAccount-scrollbar-wrap {
  overflow-x: hidden;
}

.addAccount-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}

.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
  -webkit-box-shadow: 0 0 2px 2px #1890ff;
  box-shadow: 0 0 0px 0px #1890ff;
}
</style>
