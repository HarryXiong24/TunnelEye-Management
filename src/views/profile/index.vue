<template>
  <div class="profile">
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <span>用户信息</span>
      </div>

      <div class="user-profile">
        <div class="box-center">
          <el-avatar :size="80" :src="circleUrl"></el-avatar>
        </div>
        <div class="box-center">
          <div class="user-name text-center">{{ userInfo.userName }}</div>
        </div>
      </div>

      <div class="user-bio">
        <div class="user-education user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>部门信息</span></div>
          <div class="user-bio-section-body">
            <div class="text-muted">
              用户ID: {{userInfo.userid}}
            </div>
            <div class="text-muted">
              用户名: {{userInfo.loginName}}
            </div>
            <div class="text-muted">
              所属部门: {{userInfo.depName}}
            </div>
          </div>
        </div>

        <div class="user-skills user-bio-section">
          <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>个人信息</span></div>
          <div class="user-bio-section-body">
            <div class="progress-item">
              身份信息: <span>{{userInfo.idCard}}</span>
            </div>
            <div class="progress-item">
              性别: <span>{{userInfo.sex}}</span>
            </div>
            <div class="progress-item">
              联系方式: <span>{{userInfo.mobile}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { decrypt } from '@/utils/crypto'

export default {
  data() {
    return {
      userInfo: [],
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  mounted() {
    this.userInfo = JSON.parse(decrypt(sessionStorage.getItem('userInfo')))
    if (this.userInfo.sex === 1) {
      this.userInfo.sex = '男'
    } else {
      this.userInfo.sex = '女'
    }
  },
}
</script>

<style lang="scss" scoped>

.profile {
  width: 50%;
  margin: 10px auto;
  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    margin: 5px auto;
    color: #777;
  }

  .user-profile {
    .user-name {
      font-weight: bold;
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .user-bio {
    margin-top: 20px;
    color: #606266;

    span {
      padding-left: 4px;
    }

    .user-bio-section {
      font-size: 14px;
      padding: 15px 0;

      .user-bio-section-header {
        border-bottom: 1px solid #dfe6ec;
        padding-bottom: 10px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      .progress-item {
        margin: 5px auto;
      }
    }
  }
}

</style>
