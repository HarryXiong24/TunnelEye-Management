<template>
  <div class="app-container">
    <aside>
      如果您想学习本系统如何使用, 请点击下方按钮进入系统简介。
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      导航
    </el-button>
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
