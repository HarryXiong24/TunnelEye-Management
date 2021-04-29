<template>
  <div class="guide">
    <i class="el-icon-view" @click.prevent.stop="guide"/>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>

<style lang="scss">
.guide {
  .el-icon-view {
    font-size: 24px;
    margin-top: 11px;
  }
}
</style>