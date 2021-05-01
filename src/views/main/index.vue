<template>
  <div class="index-container">

    <div class="welcome">欢迎您! 尊敬的 {{ name }} 用户:</div>

    <div class="text">隧道环境及人员检测管理系统——致力于为您提供全方位的服务!</div>

    <div class="chart-container">
      <chart height="100%" width="100%" />
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Chart from '@/components/Charts/Keyboard'


export default {
  name: 'Main',
  components: { Chart },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss">
.index-container {
  width: 100%;
  height: 100%;

  .welcome {
    margin: 26px 20px 10px 20px;
    font-size: 24px;
    color: #5f6464;
  }

  .text {
    text-align: center;
    font-size: 30px;
    color: #5f6464;
    line-height: 54px;
    margin: 20px auto 0;
  }

  .chart-container{
    width: 100%;
    height: calc(100vh - 200px);
  }
}
</style>
