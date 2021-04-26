<template>
  <div class="login-container">

    <div class="logo-container">
      <img class="logo" src="../../assets/logo.png">
    </div>
    
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">隧道环境及人员检测后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="captcha" class="captcha-content">
        <span class="svg-container">
          <i class="el-icon-loading"></i>
        </span>
        <el-input
          ref="password"
          v-model="loginForm.captcha"
          type="text"
          placeholder="请输入验证码"
          name="captcha"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <img class="captcha" :src="this.$store.state.captcha.captcha" alt="captcha" @click="changeCaptcha">
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>

    <div class="bio-container">
      <p>Copyright © Harry Xiong</p>
    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { Message } from 'element-ui'
import { setToken } from '@/utils/auth'
import { encrypt } from '@/utils/crypto'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('用户名不能为'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateCaptcha = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }],
      },
      loading: false,
      passwordType: 'password',
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
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    async changeCaptcha() {
      await this.$store.dispatch('captcha/getCaptcha')
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          await this.$store.dispatch('user/doLogin', this.loginForm)
          if (this.$store.state.user.loginInfo) {
            if (this.$store.state.user.loginInfo.success === true) {
              // 加密sessionStorage
              let token = encrypt(this.$store.state.user.loginInfo.token)
              let userInfo = encrypt(JSON.stringify(this.$store.state.user.loginInfo.user))
              // 存入sessionStorage
              sessionStorage.setItem("token", token)
              sessionStorage.setItem("userInfo", userInfo)
              // 跳转
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            } else {
              Message({
                message: this.$store.state.user.loginInfo.msg,
                duration: 3 * 1000
              })
            }
          } else {
            Message({
              message: this.$store.state.user.loginInfo.msg,
              duration: 3 * 1000
            })
          }
        } else {
          Message({
            message: '请确认是否有信息没有填写!',
            duration: 3 * 1000
          })
          return false
        }
      })
    }
  },
  mounted() {
    this.changeCaptcha()
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .logo-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    .logo {
      margin: 30px auto 0 auto;
      height: 120px;
      width: 120px;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 30px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  // .tips {
  //   font-size: 14px;
  //   color: #fff;
  //   margin-bottom: 10px;

  //   span {
  //     &:first-of-type {
  //       margin-right: 16px;
  //     }
  //   }
  // }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha-content {
    position: relative;
    .captcha {
      position: absolute;
      bottom: 3px;
      right: 3px;
    }
  }


  .bio-container {
    font-size: 10px;
    color: rgb(214, 213, 213);
    position: absolute;
    bottom: 5px;
    right: 20px;
  }
}
</style>
