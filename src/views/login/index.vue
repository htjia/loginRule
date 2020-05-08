<template>
  <div class="login-container">
    <img class="login-img" src="../../../static/img/login-bg.jpg" alt="logo-img">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <img class="login-title-logo" src="../../../static/img/logo.png" alt="title">
      <img class="login-title-logo-two" src="../../../static/img/login-logo.png" alt="title">
      <div class="cut-line"/>
      <div class="input-label user-name">账号：</div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.username" size="mini" name="username" type="text" auto-complete="on" placeholder="请输入账号" />
      </el-form-item>
      <div class="input-label">密码：</div>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          size="mini"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon v-if="pwdType" icon-class="eye" />
          <i v-if="!pwdType" class="el-icon-view" style="margin-bottom: 2px"/>
        </span>
      </el-form-item>
      <el-checkbox v-model="remember">记住密码</el-checkbox><span class="forgetPwd" @click="forgetPwd">忘记密码?</span>
      <el-form-item class="login-btn">
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="copyright">Copyright &copy; 2018 Brain Matrix, All Rights Reserved</div>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入账号'))
      } else if (value.length > 20) {
        callback(new Error('账号长度不能大于 20 位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('密码不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    return {
      remember: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.loginForm.username = localStorage.getItem('keyName')
    this.loginForm.password = localStorage.getItem('keyPass')
  },
  created() {
  },
  methods: {
    forgetPwd() {
      this.$alert('请联系系统管理员找回密码！', '提示', {
        confirmButtonText: '确定'
      })
    },
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
          this.$store.dispatch('Login', this.loginForm).then(() => {
            if (this.remember) {
              localStorage.setItem('keyName', this.loginForm.username)
              localStorage.setItem('keyPass', this.loginForm.password)
            } else {
              localStorage.removeItem('keyName')
              localStorage.removeItem('keyPass')
            }
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch((msg) => {
            this.loading = false
            // this.$message({
            //   type: 'warning',
            //   message: msg
            // })
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

<style rel="stylesheet/scss" lang="scss">
$bg:#fff;
$light_gray:#494949;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    input {
      background: #fff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 8px 5px 8px 15px;
      color: $light_gray;
      height: 40px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #494949 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 30px;
  }
  .el-form-item.login-btn{
    border: 1px solid #009494;
    margin-bottom: 45px;
  }
  .input-label{
    margin-bottom: 15px;
    color: #606266
  }
  .cut-line{
    border-top: 1px solid #ddd;
    margin-bottom: 20px;
    margin-top: 13px;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#666;
$light_gray:#444;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  /*background-image: url("../../../static/img/login.jpg");*/
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  .login-img{
    width: 100%;
    height: 100%;
  }
  .login-form {
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width: 460px;
    max-width: 100%;
    padding: 35px 60px 15px;
    margin: 0 auto;
    margin-bottom: 50%;
    background-color: #fff;
    border-radius: 10px;
    .login-title-logo{
      height: 30px;
      width: 107px;
      margin-bottom: 15px;
      margin-left: -22px;
      margin-top: -8px;
    }
    .login-title-logo-two{
      width: 340px;
      height: 48px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 0px 5px 0px 15px;
    font-size: 16px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 18px;
    }
  }
  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .forgetPwd{
    color: #009494;
    margin-left: 180px;
    cursor: pointer;
  }
  .el-checkbox{
    margin-left: 10px;
    margin-bottom: 20px;
  }
  .copyright{
    margin-bottom: -40px;
    color: #ccc;
    padding-left: 10px;
    font-size: 12px;
  }
}
</style>
