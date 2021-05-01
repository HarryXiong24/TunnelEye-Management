<template>
  <div class="systemLog">

    <div class="nav">
      <div class="item">
        <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>
    </div>

    <div class="title">系统操作日志</div>
    
    <div class="radio">
      查看的顺序
      <el-radio-group v-model="reverse" class="select">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
    </div>

    <div class="block">

      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(systemLog, index) in systemLogs"
          placement="top"
          :key="index"
          :color="theme"
          :timestamp="systemLog.logTime">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span :style="{'color':theme}">操作内容:</span> <span>{{systemLog.logContent}}</span>
                <el-button @click="deleteLog(systemLog.logId)" style="float: right; padding: 3px 0" type="text">删除此条操作</el-button>
              </div>
              <div class="text item">
                <span :style="{'color':theme}">操作类型:</span> {{systemLog.logType}}
              </div>
              <div class="text item">
                <span :style="{'color':theme}">操作用户:</span> {{systemLog.opUser}}
              </div>
            </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>   
    
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :page-size="20"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { reqSystemLog, deleteSystemLog } from '@/api/systemLog'
import waves from '@/directive/waves' // waves directive
import moment from 'moment';

export default {
  directives: { waves },
  data() {
    return {
      // 总页数
      count: 0,
      // 记录当前页码数
      page: 0,

      // 排序
      reverse: true,
      
      // 存放日志的数组
      systemLogs: [],

      // 导出Excel的属性
      downloadLoading: false,
    }
  },
  methods: {
    // 获得数据
    async getInfo(page) {
      let data = {
        page: page,
        limit: 20
      }
      let respone = await reqSystemLog(data)
      let result = respone.data

      console.log(result);

      this.count = result.count
      this.page = page
      this.systemLogs = result.data
    },
    handleCurrentChange(val) {
      this.getInfo(val)
    },
    deleteLog(id) {
      this.$confirm('此操作将删除该条日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteSystemLog(id)
        let msg = response.data.msg
        this.$message({
          type: 'success',
          message: msg
        });
        // 每次修改完之后需要刷新一次，确保数据最新
        this.getInfo(this.page)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });      
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['操作ID', '操作内容', '操作类型', '操作用户', '操作时间']
        const filterVal = ['logId', 'logContent', 'logType', 'opUser', 'logTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页系统操作日志-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.systemLogs.map(v => filterVal.map(j => {
        if (j === 'lockInTime') {
          // return parseTime(v[j])
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  async mounted() {
    await this.getInfo(1)
  }
}
</script>

<style lang="scss">
  .systemLog {
    margin: 20px 20px;

    .nav {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin: 0 20px;
      float: right;
      .item {
        margin: 0 20px;
      }
    }

    .title {
      margin: 30px 0;
      font-size: 24px;
      color: #5f6464;
      font-weight: bold;
    }

    .radio {
      margin: 20px 20px;
      font-size: 16px;
      color: #5f6464;

      .select {
        margin: 0 20px;
      }
    }
  
    .box-card {

      margin: 20px 0;
      width: 95%;

      .text {
        font-size: 14px;
      }

      .item {
        margin-bottom: 18px;
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