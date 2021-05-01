<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click" id="avatar-container">
        <div class="avatar-wrapper hover-effect right-menu-item">
          <i class="el-icon-setting"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              回到主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native.prevent.stop="guide">
            <span style="display:block;">使用帮助</span>
          </el-dropdown-item>
          <router-link to="/profile/index">
            <el-dropdown-item>用户信息</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <theme-picker class="themePicker" @change="themeChange"></theme-picker> -->

      <template v-if="device !== 'mobile'">

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

      </template>

      <guide id="guide" class="right-menu-item hover-effect"></guide>

    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Guide from '@/components/Guide'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from '@/components/Guide/steps'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Guide,
  }, 
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  data() {
    return {
      driver: null
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  },
  mounted() {
    this.driver = new Driver()
  },
}
</script>

<style lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    line-height: 46px;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .themePicker {
      float: right;
      height: 26px;
      margin: -3px 15px 0 0;
    }

    .avatar-container {
      margin-right: 16px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        // .user-avatar {
        //   cursor: pointer;
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 10px;
        // }

        .el-icon-setting {
          font-size: 24px;
          text-align: center;
        }

        // .el-icon-caret-bottom {
        //   cursor: pointer;
        //   position: absolute;
        //   right: -20px;
        //   top: 25px;
        //   font-size: 12px;
        // }
      }
    }
  }
}
</style>
