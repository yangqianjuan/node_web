<template>
  <div class='login_page'>
    <section class='form_contianer'>
      <div class='titleArea rflex'>
        <span class='title'>智慧门店管理系统</span>
      </div>
      <el-form
        :model='loginForm'
        :rules='loginRules'
        ref='loginForm'
        class='login-form'
      >
        <el-form-item
          prop='username'
          class='login-item'
        >
          <span class='svg-container'>
            <svg-icon icon-class='phone' />
          </span>
          <el-input
            name='username'
            type='text'
            v-model='loginForm.username'
            placeholder='请输入手机号码'
          ></el-input>
        </el-form-item>
        <el-form-item
          prop='password'
          class='login-item'
        >
          <span class='svg-container'>
            <svg-icon icon-class='password' />
          </span>
          <el-input
            name='password'
            :type='pwdType'
            @keyup.enter.native='handleLogin'
            v-model='loginForm.password'
            placeholder='请输入密码'
          ></el-input>
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item>
          <el-button
            type='primary'
            :loading='loading'
            @click.native.prevent='handleLogin'
            class='submit_btn'
          >登录</el-button>
        </el-form-item>
        <div class='tiparea'>
          <p class='wxtip'>上海小萌科技有限公司</p>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { setUserName } from '@/utils/auth'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else if (value.length > 40) {
        callback(new Error('用户名不能大于40位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.length > 40) {
        callback(new Error('密码不能大于40位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // username: 'admin',
        username: '',
        // password: 'admin'
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              // window.sessionStorage.setItem('username', this.loginForm.username)
              setUserName(this.loginForm.username)
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
$dark_gray: #889aa4;
.login_page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../../image/login.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_contianer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  width: 460px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }
  .submit_btn {
    width: 85%;
    margin-left: 45px;
    padding: 13px 0;
    font-size: 16px;
  }
  .titleArea {
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-size: 26px;
    width: 100%;
    padding-bottom: 20px;
    .logo {
      width: 40px;
      margin-right: 10px;
    }
    .title {
      i {
        color: #ff6c60;
      }
    }
  }

  .svg-container {
    color: $dark_gray;
    width: 40px;
    display: inline-block;
    padding: 6px 5px 6px 10px;
    vertical-align: middle;
  }
  .show-pwd {
    position: absolute;
    right: 15px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.manage_tip {
  margin-bottom: 20px;
  .title {
    font-family: cursive;
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }
  .logo {
    width: 60px;
    height: 60px;
  }
}

.tiparea {
  text-align: center;
  font-size: 12px;
  color: $dark_gray;
  padding: 20px 0 0px 0;
  .tip {
    margin: auto;
  }
  .tips {
    color: red;
  }
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.loginForm {
  .el-button--primary {
    background-color: #ff7c1a;
    border: 1px solid #ff7c1a;
  }
}
.sanFangArea {
  border-top: 1px solid #dcdfe6;
  padding: 10px 0;
  display: none;
  .title {
    font-size: 14px;
    color: #8b9196;
    margin-bottom: 10px;
  }
  ul {
    li {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .svg-icon {
        font-size: 24px;
      }
    }
  }
}
</style>
