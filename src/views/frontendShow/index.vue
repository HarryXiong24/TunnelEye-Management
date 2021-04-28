<template>
  <div class="frontendShow">
    <iframe src="http://tunneleye.coyote416.cn/" width="30%" height="100%" frameborder="0" class="show">
    </iframe>
    
    <el-card shadow="always" class="card">
      <div slot="header" class="clearfix">
          <span class="title">说明</span>
      </div>
      <div class="item">
          1. 本系统还配有手机APP, 移动端网页APP用来显示实时定位和气体监测等数据 
      </div>
      <div class="item">
          2. 右边即为内嵌移动端APP, 可登录后直接查看数据，方便管理
      </div>
      <div class="item">
          3. 建议全屏查看效果更佳
      </div>
      <div class="item">
          4. 若想访问移动端网页APP, 请用手机浏览器访问: 
          <el-link @click="goTo" type="warning" herf="http://tunneleye.coyote416.cn">隧道之眼(http://tunneleye.coyote416.cn)</el-link>
      </div>
    </el-card>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
     
    }
  },
  methods: {
    goTo() {
      window.location.href = "http://tunneleye.coyote416.cn"
    }
  }
}
</script>

<style lang="scss">
  .frontendShow {
    width: 100%;
    height: 600px;
    position: relative;
    .show {
      float: right;
      margin-right: 50px;
      margin-top: 5px
    }

    .card {
      position: absolute;
      top: 20px;
      margin: 0 20px 0 20px;
      width: 60%;

      .title {
        padding-left: -20px;
        font-size: 24px;
        color: #5f6464;        
      }
      
      .item {
        margin-bottom: 18px;
        font-size: 14px;
        color: #434444;
      }

      .clearfix:before,
      .clearfix:after {
        display: table;
        content: "";
      }
      .clearfix:after {
        clear: both
      }
    }
  }
</style>

