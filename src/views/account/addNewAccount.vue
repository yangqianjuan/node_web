<template>
  <div class="app-container">
    <div id="addNewAccount">
      <el-row>
        <el-col :span="12">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="130px"
            style="width:500px;float:right"
            size='small'
          >

            <el-form-item
              label="登录名:"
              prop="username"
            >
              <el-input
                v-model="form.username"
                style="width: 372px"
                :disabled="editStatus"
                maxlength='11'
                placeholder="请输入手机号码"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="登录密码:"
              prop="password"
            >
              <el-input
                v-model="form.password"
                style="width: 372px"
                placeholder="不填则默认初始密码为88888888"
                :type='pwdType'
                auto-complete="new-password"
                :disabled="editStatus"
              ></el-input>
              <span
                class="show-pwd"
                @click="showPwd"
              >
                <svg-icon
                  :class="editStatus?'curor':''"
                  :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <el-form-item
              label="员工姓名:"
              prop="name"
            >
              <el-input
                v-model="form.name"
                style="width: 372px"
                placeholder="请输入员工姓名"
                maxlength="5"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              label="员工编号:"
              prop="employeeNumber"
            >
              <el-input
                v-model="form.employeeNumber"
                style="width: 372px"
                placeholder="请输入员工编号"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              label="员工邮箱:"
              prop="email"
            >
              <el-input
                v-model="form.email"
                style="width: 372px"
                placeholder="请输入员工邮箱"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="所属部门:"
              prop="structId"
            >
              <span>
                <span
                  v-show="form.structId"
                  style="margin:0px 40px 0px 20px;font-size:12px"
                >{{form.structName}}</span>
                <el-button
                  v-if="structType!==2"
                  :type="form.structId?'text':''"
                  @click="selectDepartmentDialog=true"
                >{{form.structId?'修改':'选择部门'}}</el-button>
              </span>
            </el-form-item>
            <el-form-item
              label="角色名称:"
              prop="roleId"
            >
              <el-select
                ref="accountSelect"
                v-model="form.roleId"
                placeholder="请选择角色名称"
                style="width: 372px;"
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
              label="上传头像:"
              prop="avatar"
            >
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="imageUrl"
                  :src="imageUrl+'?token='+token"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                ></i>
              </el-upload>
            </el-form-item>
            <div
              align="center"
              style="margin: 20px 0px 0px 130px"
            >
              <el-button
                style="margin-right: 30px"
                size="small"
                @click="toStaffManager"
              >取消</el-button>
              <el-button
                @click="submitForm('form')"
                style="margin-left: 30px;"
                size="small"
                type="primary"
                :disabled="btnDisabled"
              >保存</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div
            style="padding-left:67px"
            v-show="rightList.length>0"
          >
            <span style="display:inline-block;vertical-align:top;margin-top:18px">权限明细：</span>
            <div class="rightTree">
              <el-row
                v-for="item in rightList"
                :key='item.name'
                style="margin-bottom:14px"
              >
                <el-checkbox
                  disabled
                  v-model="checked"
                >{{item.name}}</el-checkbox>
                <template>
                  <el-row
                    v-for="it in item.children"
                    :key='it.name'
                    style="margin:14px 0px 0px 24px"
                  >
                    <el-checkbox
                      disabled
                      v-model="checked"
                    >{{it.name}}</el-checkbox>
                    <template>
                      <el-row
                        v-for="i in it.children"
                        :key='i.name'
                        style="margin:14px 0px 0px 24px"
                      >
                        <span
                          v-show="!i.children||i.children.length===0"
                          style="margin-right:20px"
                        >操作权限:</span>
                        <el-checkbox
                          disabled
                          v-model="checked"
                        >{{i.name}}</el-checkbox>
                      </el-row>
                    </template>
                  </el-row>
                </template>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <div class="title">角色权限</div> -->
      <el-dialog
        title="选择部门"
        :visible.sync="selectDepartmentDialog"
        width="450px"
        class="selectDepartment"
      >
        <div class="departTree">
          <el-tree
            :data="data"
            :props="defaultProps"
            node-key='id'
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          ></el-tree>
        </div>

        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="selectDepartmentDialog= false"
            size="small"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="confirmDepartment"
          >确认</el-button>
        </span>
      </el-dialog>

    </div>

  </div>
</template>
<script>
import treeImg from '@/image/treeImg.png'
import { getToken } from '@/utils/auth'
import crypto from 'crypto'
import { saveAccountInfo, getEditAccountInfo, checkAccount, listRoleOptions, listPermissionTree, rightListRoleOptions } from '@/api/account'
export default {
  name: 'addStaffManage',
  watch: {
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      if (this.editStatus) {
        callback()
      }
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!value) {
        callback(new Error('账号ID不能为空'))
      } else if (isNaN(value) || !reg.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        const params = {
          username: value
        }
        checkAccount(params).then((res) => {
          const checkAccountFlag = res
          if (!checkAccountFlag) {
            callback(new Error('账号ID已存在'))
          } else {
            callback()
          }
        })
      }
    }
    var validatePassword = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]{6,16}$/g
      if (value === '') {
        callback()
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入6 - 16位数字或字母'))
        } else {
          callback()
        }
      }
    }
    return {
      btnDisabled: false,
      checked: true,
      structId: {},
      roleOptions: [],
      rightList: [],
      token: getToken(),
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectDepartmentDialog: false,
      treeImg,
      pwdType: 'password',
      form: {
        username: '',
        password: '',
        name: '',
        employeeNumber: '',
        email: '',
        roleId: '',
        structId: ''
      },
      tree: [],
      // checkedStore: [],
      imageUrl: '',
      editStatus: false,
      rules: {
        username: { required: true, validator: validateAccount, trigger: 'blur' },
        password: { required: false, validator: validatePassword, trigger: 'blur' },
        name: { required: true, message: '员工姓名不能为空', trigger: 'blur' },
        employeeNumber: { required: false },
        email: { required: false },
        structId: { required: true, message: '所属部门不能为空', trigger: 'blur' },
        roleId: { required: true, message: '角色岗位不能为空', trigger: 'blur' }
      },
      loginUsername: this.$store.state.user.name
    }
  },
  methods: {
    listPermissionTree() {
      listPermissionTree().then(res => {
        this.data = res
        if (this.structType === 2) {
          this.form.structName = this.data[0].label
          this.form.structId = this.data[0].id
        }
      })
    },
    toStaffManager() {
      this.$router.push({ name: 'staffManager' })
    },
    listRoleOptions() {
      let type = this.structId.type
      if (type === undefined) {
        type = ''
      }
      const params = {
        type
      }
      listRoleOptions(params).then((res) => {
        this.roleOptions = res
        if (this.roleOptions.length === 1) {
          this.form.roleId = this.roleOptions[0].value
        }
        this.handleSelectRole(this.form.roleId)
      })
    },
    rightListRoleOptions(id) {
      rightListRoleOptions({ id }).then((res) => {
        this.rightList = res
      })
    },
    showPwd() {
      if (this.editStatus) {
        this.pwdType === 'password'
      } else {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      }
    },
    handleNodeClick(data) {
      this.structId = data
    },
    confirmDepartment() {
      this.form.structName = this.structId.label
      this.form.structId = this.structId.id
      this.form.roleId = ''
      this.listRoleOptions()
      this.selectDepartmentDialog = false
    },
    handleSelectRole(value) {
      this.rightListRoleOptions(value)
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      this.btnDisabled = false
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
      this.btnDisabled = true
      return isJPG && isLt2M
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const hash = crypto.createHash('md5')
          hash.update(this.form.password)
          const submitPassword = hash.digest('hex')
          const params = {
            username: this.form.username,
            password: this.form.password === '********' ? '' : submitPassword,
            name: this.form.name,
            employeeNumber: this.form.employeeNumber,
            email: this.form.email,
            avatar: this.form.avatar,
            roleId: this.form.roleId,
            structId: this.form.structId,
            editStatus: this.editStatus,
            id: this.$route.query.id
          }
          saveAccountInfo(params).then((res) => {
            if (res.msgCode === '200') {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.toStaffManager()
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
    getEditAccountInfo(id) {
      const params = {
        usrId: id
      }
      getEditAccountInfo(params).then((res) => {
        this.form = res
        this.handleSelectRole(this.form.roleId)
        this.form.editStatus = true
        this.structId.type = res.structType
        this.listRoleOptions()
        this.imageUrl = this.form.avatar
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.imageUrl = ''
    }
  },
  mounted() {
    this.editStatus = Boolean(this.$route.query.id)
    if (this.editStatus) {
      this.getEditAccountInfo(this.$route.query.id)
    }
    this.listRoleOptions()
    this.listPermissionTree()
  },
  computed: {
    uploadUrl: function () {
      return process.env.BASE_API + '/account/upload?token=' + getToken()
    },
    structType() {
      return Number(sessionStorage.getItem('structType'))
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  background-color: #fff;
}
.curor {
  cursor: auto;
}
.show-pwd {
  position: absolute;
  right: 15px;
  top: 0px;
  color: #8c8c8c;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
.departTree {
  height: 300px;
  overflow: auto;
}
#addNewAccount {
  padding: 82px 0px 81px;
  color: rgba(0, 0, 0, 0.65);
}
.avatar-uploader .el-upload {
  border: 2px dashed #dddddd;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.rightTree {
  display: inline-block;
  width: 320px;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 38px 0px 0px 30px;
}
.avatar-uploader .el-upload:hover {
  border-color: #dddddd;
}
.avatar-uploader-icon {
  font-weight: bolder;
  font-size: 30px;
  color: #dddddd;
  width: 107px;
  height: 107px;
  line-height: 107px;
  text-align: center;
}
.avatar {
  width: 107px;
  height: 107px;
  display: block;
}
</style>
