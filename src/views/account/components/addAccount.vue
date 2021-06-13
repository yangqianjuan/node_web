<template>
  <el-dialog
    :visible.sync="dialog"
    width="780px"
    class="addAccountDialog"
    :before-close="closeDialog"
    :title="titleName"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="130px"
      style="margin-left: auto;margin-right: auto"
    >
      <el-row>
        <el-col :span="16">
          <el-form-item
            label="账号ID"
            prop="account"
          >
            <template v-if="!editStatus">
              <el-input
                v-model="form.account"
                style="width: 300px"
                placeholder="请输入手机号码"
              ></el-input>
            </template>
            <template v-else><span>{{form.account}}</span></template>
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="name"
          >
            <el-input
              v-model="form.name"
              style="width: 300px"
              placeholder="请输入姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input
              v-model="form.password"
              style="width: 300px"
              placeholder="请输入密码"
              type="password"
              auto-complete="new-password"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="!editStatus"
            style="margin-top: -33px;height: 12px;"
          >
            <span style="font-size: 12px;margin-left: 65px;line-height: 12px;color: #c0c4cc;">默认密码88888888,如有需要请重新编辑设置</span>
          </el-form-item>
          <el-form-item
            label="企业工号"
            prop="employeeNumber"
          >
            <el-input
              v-model="form.employeeNumber"
              style="width: 300px"
              placeholder="请输入企业工号"
            ></el-input>
          </el-form-item>
          <!--<el-form-item label="联系方式" prop="telephone">-->
          <!--<el-input v-model="form.telephone" style="width: 300px" placeholder="请输入联系方式"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item
            label="用户邮箱"
            prop="email"
          >
            <el-input
              v-model="form.email"
              style="width: 300px"
              placeholder="请输入用户邮箱"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
          <span style="margin: 78px">头&nbsp;像</span>
        </el-col>
      </el-row>
      <div class="title">角色权限</div>
      <el-form-item
        label="角色岗位"
        prop="roleId"
      >
        <el-select
          ref="accountSelect"
          v-model="form.roleId"
          placeholder="请输入"
          style="width: 152px;"
          @change="handleSelectRole"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="组织架构"
        prop="position"
      >
        <el-dropdown
          trigger="click"
          ref="formDrop"
          @visible-change="visibleChange"
        >
          <el-input
            v-model="form.position"
            style="width: 300px"
            placeholder="请选择"
            readonly
            unselectable="on"
          >
            <i
              slot="suffix"
              :class="dropdownFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            ></i>
          </el-input>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkedStore">
              <el-dropdown-item style="padding: 0px;width: 300px;height: 300px">
                <el-scrollbar
                  wrap-class="addAccount-scrollbar-wrap"
                  style="height: 100%"
                >
                  <el-tree
                    ref="formTree"
                    :data="tree"
                    node-key="id"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                  >
                    <span
                      class="custom-tree-node"
                      slot-scope="{ node, data }"
                    >
                      <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                      <span style="margin-left: 5px">{{ data.label }}</span>
                      <el-checkbox
                        :label="data.id"
                        v-show="showCheckBox(data, selectedRoleOption)"
                        @change="handleSelectStore(data)"
                        class="addAccount-checkbox"
                      ></el-checkbox>
                    </span>
                  </el-tree>
                </el-scrollbar>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <div v-show="form.roleId !=='' || editStatus === true">
        <el-form-item
          label="用户权限"
          prop="rank"
        >
          <div
            class="permissionBox"
            v-show="permission.structType>=0"
            style="width: 90%"
          >
            <div class="permission-title">门店客流</div>
            <el-radio-group
              v-show="permission.structType >= 0"
              v-model="permission.structType"
              class="radioPermissionClass"
            >
              <el-radio
                class="radio-item"
                :label="2"
                v-show="permission.structType === 2"
              >查看所属门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
              <el-radio
                class="radio-item"
                :label="1"
                v-show="permission.structType === 1"
              >查看所属区域所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
              <el-radio
                class="radio-item"
                :label="0"
                v-show="permission.structType === 0"
              >查看品牌下所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
            </el-radio-group>
          </div>
          <div
            class="permissionBox"
            v-show="permission.customerPermission>=0"
            style="width: 90%"
          >
            <div class="permission-title">顾客管理</div>
            <el-radio-group
              v-show="permission.customerPermission > 0"
              v-model="permission.customerPermission"
              class="radioPermissionClass"
            >
              <el-radio
                class="radio-item"
                :label="10"
                v-show="permission.customerPermission === 10"
              >查看顾客列表数据</el-radio>
              <el-radio
                class="radio-item"
                :label="11"
                v-show="permission.customerPermission === 11"
              >编辑(支持查询顾客、白名单、转为白名单、删除白名单等操作权限)</el-radio>
            </el-radio-group>
          </div>
          <div
            class="permissionBox"
            v-show="permission.storePermission>=0"
            style="width: 90%"
          >
            <div class="permission-title">门店列表</div>
            <el-radio-group
              v-show="permission.storePermission > 0"
              v-model="permission.storePermission"
              class="radioPermissionClass"
            >
              <el-radio
                class="radio-item"
                :label="3"
                v-show="permission.storePermission === 3"
              >查看门店列表数据</el-radio>
              <el-radio
                class="radio-item"
                :label="4"
                v-show="permission.storePermission === 4"
              >编辑门店（支持设备、门店及其架构的新增、删除、修改、查询功能）</el-radio>
            </el-radio-group>
            <!--<el-radio-group v-model="permission.devicePermission" class="radioPermissionClass">-->
            <!--<el-radio class="radio-item" :label="5" v-show="permission.devicePermission === 5">添加设备</el-radio>-->
            <!--</el-radio-group>-->
          </div>
          <div
            class="permissionBox"
            v-show="permission.accountPermission>=0"
            style="width: 90%"
          >
            <div class="permission-title">账号列表</div>
            <el-radio-group
              v-show="permission.accountPermission > 0"
              v-model="permission.accountPermission"
              class="radioPermissionClass"
            >
              <el-radio
                class="radio-item"
                :label="6"
                v-show="permission.accountPermission === 6"
              >查看账号列表数据</el-radio>
              <el-radio
                class="radio-item"
                :label="7"
                v-show="permission.accountPermission === 7"
              >编辑账号（支持账号的新增、删除、修改、查询功能）</el-radio>
            </el-radio-group>
          </div>
          <div
            class="permissionBox"
            v-show="permission.rolePermission>=0"
            style="width: 90%"
          >
            <div class="permission-title">角色列表</div>
            <el-radio-group
              v-show="permission.rolePermission > 0"
              v-model="permission.rolePermission"
              class="radioPermissionClass"
            >
              <el-radio
                class="radio-item"
                :label="8"
                v-show="permission.rolePermission === 8"
              >查看角色列表数据</el-radio>
              <el-radio
                class="radio-item"
                :label="9"
                v-show="permission.rolePermission === 9"
              >编辑角色（支持角色的新增、删除、修改、查询功能）</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
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
          style="margin-left: 30px;"
          class="confirm-button"
          size="small"
        >保存</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import treeImg from '@/image/treeImg.png'
import { getToken } from '@/utils/auth'
import crypto from 'crypto'
import { saveAccountInfo, checkAccount, listOrgTree, getEditAccountInfo, getRoleDetail } from '@/api/account'
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
    roleOptions: {
      type: Array,
      default: []
    }
  },
  watch: {
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!this.editStatus) {
        if (!value) {
          this.repeatFlag = false
          callback(new Error('账号ID不能为空'))
        } else if (isNaN(value) || !reg.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          const params = {
            account: value
          }
          checkAccount(params).then((res) => {
            const checkAccountFlag = res
            if (!checkAccountFlag) {
              this.repeatFlag = true
              callback(new Error('账号ID已存在'))
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
      treeImg,
      tab: 'info',
      form: {
        account: '',
        name: '',
        password: '',
        employeeNumber: '',
        // telephone: '',
        email: '',
        roleId: '',
        position: '',
        orgId: ''
      },
      tree: [],
      checkedStore: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      imageUrl: '',
      editStatus: false,
      repeatFlag: false,
      rules: {
        account: { required: true, validator: validateAccount, trigger: ['blur'] },
        name: { required: true, message: '姓名不能为空', trigger: 'blur' },
        password: { required: true, message: '密码不能为空', trigger: 'blur' },
        employeeNumber: { required: false },
        // telephone: { required: true, message: '联系方式不能为空', trigger: 'blur' },
        email: { required: false },
        roleId: { required: true, message: '角色岗位不能为空', trigger: 'blur' },
        position: { required: true, message: '组织架构不能为空', trigger: ['change'] }
      },
      roles: this.$store.state.user.roles,
      loginUsername: this.$store.state.user.name,
      permission: {
        structType: '',
        storePermission: '',
        devicePermission: '',
        accountPermission: '',
        rolePermission: ''
      },
      selectedRoleOption: {},
      accountId: '',
      dropdownFlag: false
    }
  },
  methods: {
    handleSelectRole(value) {
      this.selectedRoleOption = this.roleOptions.filter(r => {
        return r.value === value
      })[0]
      this.form.position = ''
      this.form.orgId = ''
      this.checkedStore = []
      this.listOrgTree()
      this.getRoleDetail(value)
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.form.avatar = res
      this.imageUrl = this.form.avatar
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    listOrgTree() {
      this.form.position = ''
      listOrgTree().then((res) => {
        this.tree = res
      })
    },
    getRoleDetail(id) {
      const params = {
        id: id
      }
      getRoleDetail(params).then((res) => {
        this.permission = res
      })
    },
    visibleChange(value) {
      this.dropdownFlag = value
    },
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.form.position = data.label
        this.form.orgId = data.id
        this.$refs.formDrop.hide()
        this.checkedStore = []
        this.checkedStore.push(data.id)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const hash = crypto.createHash('md5')
          hash.update(this.form.password)
          const submitPassword = hash.digest('hex')
          const params = {
            id: this.accountId,
            account: this.form.account,
            name: this.form.name,
            password: this.form.password === '********' ? '' : submitPassword,
            employeeNumber: this.form.employeeNumber,
            // telephone: this.form.telephone,
            email: this.form.email,
            avatar: this.form.avatar,
            roleId: this.form.roleId,
            orgId: this.form.orgId,
            editStatus: this.editStatus
          }
          saveAccountInfo(params).then((res) => {
            if (res.msgCode === '200') {
              this.$message({
                message: res.message,
                type: 'success'
              })
              if (this.loginUsername === this.form.account) {
                this.$nextTick(() => {
                  this.$store.state.user.avatar = this.form.avatar
                })
              }
              this.$emit('listAccount')
              this.closeDialog()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else {
          if (this.repeatFlag) {
            this.tab = 'info'
          } else if (this.tab === 'auth' && (!this.form.position || !this.form.roleId || !this.form.orgId)) {
            this.tab = 'auth'
          } else if (!this.form.account || !this.form.name || !this.form.password || !this.form.telephone) {
            this.tab = 'info'
          } else if (!this.form.position || !this.form.roleId || !this.form.orgId) {
            this.tab = 'auth'
          } else {
            this.tab = 'info'
          }
          return false
        }
      })
    },
    getEditAccountInfo(row) {
      this.editStatus = true
      this.accountId = row.id
      const params = {
        usrId: row.id
      }
      getEditAccountInfo(params).then((res) => {
        this.form = res
        const data = {
          id: this.form.orgId,
          label: this.form.position
        }
        this.handleSelectStore(data)
        this.handleSelectRole(res.roleId)
        this.imageUrl = this.form.avatar
        // this.getRoleDetail(row.roleId)
      })
    },
    resetForm(formName) {
      this.checkedStore = []
      this.$refs[formName].resetFields()
      this.imageUrl = ''
      this.editStatus = false
      this.tab = 'info'
    }
  },
  mounted() {
    if (!this.editStatus) {
      this.form.password = '88888888'
    }
  },
  computed: {
    titleName() {
      return this.editStatus === true ? '编辑账号' : '添加账号'
    },
    uploadUrl: function () {
      return process.env.BASE_API + '/account/upload?token=' + getToken()
    },
    showCheckBox() {
      return function (data, selectedRoleOption) {
        if (parseInt(data.type) === parseInt(selectedRoleOption.structType)) {
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
.avatar-uploader .el-upload {
  border: 2px dashed #dddddd;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #dddddd;
}
.avatar-uploader-icon {
  font-weight: bolder;
  font-size: 30px;
  color: #dddddd;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.addAccountDialog .el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  /*border-color: #67c23a;*/
  border-color: #dcdfe6;
}

/*.addAccountDialog .el-dialog__header {*/
/*padding: 0px;*/
/*}*/
/*.addAccountDialog .el-dialog__body {*/
/*padding: 0px;*/
/*color: #606266;*/
/*font-size: 14px;*/
/*}*/

.addAccountDialog .el-dropdown-menu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

.addAccountDialog .title {
  margin: 30px 0px 40px 10px;
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #282828;
}
</style>
