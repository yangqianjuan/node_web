<template>
  <el-dialog
    :visible.sync="dialog"
    width="45%"
    :before-close="closeDialog"
    title="修改密码"
  >
    <el-row
      type="flex"
      justify="space-around"
      style="display: flex;align-items: center;"
    >
      <el-col :span="9">
        <el-form
          :model="info"
          label-position="right"
          label-width="100px"
          size="small"
        >
          <el-form-item label="用户名:">
            {{userInfo.account}}
          </el-form-item>
          <el-form-item label="姓名:">
            {{userInfo.name}}
          </el-form-item>
          <el-form-item label="角色岗位:">
            <span>{{userInfo.roleName}}</span>
          </el-form-item>
          <el-form-item
            v-if="userInfo.roleId !== 1 && userInfo.roleId !== 3"
            label="所属架构:"
          >
            {{userInfo.structName}}
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <div style="width: 2px;background-color: #f5f6fa;height: 230px;margin-left: auto;margin-right: auto;"></div>
      </el-col>
      <el-col :span="13">
        <el-form
          :model="form"
          ref="form"
          :rules="rules"
          size="small"
          style="width: 80%;margin-left: auto;margin-right: auto;"
        >
          <el-form-item
            label=""
            prop="oldPassword"
          >
            <el-input
              type="password"
              v-model="form.a"
              name='1'
              style="display: none"
              placeholder="隐藏"
            ></el-input>
            <el-input
              :type="form.oldPassword !== '' ? 'password' : 'text'"
              v-model="form.oldPassword"
              placeholder="请输入原密码"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: -12px;height: 12px;text-align: right;">
            <span style="font-size: 12px;height: 12px;line-height: 12px;color: #c0c4cc;">如忘记密码，请联系系统管理员</span>
          </el-form-item>
          <el-form-item
            label=""
            prop="newPassword"
          >
            <el-input
              :type="form.newPassword!== '' ? 'password' : 'text'"
              v-model="form.newPassword"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label=""
            prop="checkPassword"
          >
            <el-input
              :type="form.checkPassword !== '' ? 'password' : 'text'"
              v-model="form.checkPassword"
              placeholder="请再次确认密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="space-around"
      style="margin-top: 5%"
    >
      <el-col
        :span="12"
        style="margin-left: 30%;margin-right: auto;te-xt-align: center;"
      >
        <el-button
          @click="closeDialog"
          class="cancel-button"
        >取消</el-button>
      </el-col>
      <el-col
        :span="12"
        style="margin-left: auto;margin-right: 30%;text-align: center;"
      >
        <el-button
          @click="onSubmit"
          class="confirm-button"
        >保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import crypto from 'crypto'
import { checkPassWord, updatePassword } from '@/api/account'

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
    userInfo: {
      type: Object,
      default: null
    }
  },
  watch: {
  },
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else {
        const hash = crypto.createHash('md5')
        hash.update(value)
        const params = {
          account: this.userInfo.account,
          password: hash.digest('hex')
        }
        checkPassWord(params).then((res) => {
          const checkAccountFlag = res
          if (!checkAccountFlag) {
            callback(new Error('密码不正确'))
          } else {
            callback()
          }
        })
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('checkPassword')
        }
        callback()
      }
    }
    var validateCheckPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      info: {},
      form: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: [
          { validator: validateOldPass, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validateCheckPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    clear() {
      this.form.oldPassword = ''
      this.form.newPassword = ''
      this.form.checkPassword = ''
      this.$refs['form'].resetFields()
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const hash = crypto.createHash('md5')
          hash.update(this.form.newPassword)
          const params = {
            account: this.userInfo.account,
            password: hash.digest('hex')
          }
          updatePassword(params).then((res) => {
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
    }
  },
  mounted() {
  },
  computed: {
  }
}
</script>
<style>
</style>
