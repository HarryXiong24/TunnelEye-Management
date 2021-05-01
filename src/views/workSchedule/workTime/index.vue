<template>
  <div class="watch">

    <div class="title">出勤信息查看</div>

    <div class="nav">
      
      <div class="item">
        <!-- 这里必须要失焦时触发，这个组件没有安排click -->
        <el-date-picker
          v-model="date"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00" @blur="getPersonInfo">
        </el-date-picker>
      </div>

      <div class="item">
        <el-select class="item" v-model="value" placeholder="请选择" @change="groupShow(value)">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

 
      <div class="item">
        <el-button plain type="primary" @click="refresh" icon="el-icon-refresh-right">刷新信息</el-button>
      </div>

      <div class="item">
        <el-button plain v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="centerDialogVisible = true">
          导出信息
        </el-button>
      </div>    
  
    </div>

    <el-dialog
      title="请选择导出的文件形式"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <el-button plain v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出Excel文件
      </el-button>
      <el-button plain :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownloadZip">
        导出TXT文件
      </el-button>
    </el-dialog>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
          sortable
          label="工号"
          prop="userid">
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="userName">
        </el-table-column>
        <el-table-column
          label="性别"
          prop="sex">
        </el-table-column>
        <el-table-column
          label="是否在岗"
          prop="state">
        </el-table-column>
        <el-table-column
          label="出勤时间"
          prop="clockInTime">
        </el-table-column>

        <el-table-column
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入姓名搜索"/>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
import { reqPersonInfo } from '@/api/reqPersonInfo'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  data() {
    return {
      options: [],
      value: '', // 选项的值
      label: '', // 选项的内容
      date: new Date('2020-06-01'),

      tableData: [],
      search: '',
      lists: [],

      resData: [],
      
      // 导出Excel的属性
      downloadLoading: false,
      excelTitle: '',
      centerDialogVisible: false,
    }
  },
  methods: {
    async getPersonInfo() {
      let date = {date: moment(this.date).format('YYYY-MM-DD')}
      let response = await reqPersonInfo(date)
      let data = response.data
      this.resData = data
      this.options = []
      this.value = ''
      this.label = ''
     
      data.forEach( (value) => {
        let params = { 
          value: value.groupId,
          label: value.groupName 
        }
        this.options.push(params)
      })
    },
    async init() {
      // 异步的方法，一定要await
      await this.getPersonInfo()
      this.value = this.options[0].value
      this.groupShow(this.value)  
    },
    groupShow(value) {
      for (let i = 0; i < this.resData.length; i++) {
        if (value === this.resData[i].groupId) {
          this.excelTitle = this.resData[i].groupName
          this.tableData = this.resData[i].users
        }
      }
    },
    refresh() {
      this.init()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['工号', '姓名', '性别', '是否在岗', '到岗时间']
        const filterVal = ['userid', 'userName', 'sex', 'state', 'clockInTime']
        const data = this.formatJson(filterVal, this.tableData)
        console.table(this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.excelTitle + moment(this.date).format('YYYY-MM-DD HH.mm.ss') + "的出勤信息" })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['工号', '姓名', '性别', '是否在岗', '到岗时间']
        const filterVal = ['userid', 'userName', 'sex', 'state', 'clockInTime']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const filename = this.excelTitle + moment(this.date).format('YYYY-MM-DD HH.mm.ss') + "的出勤信息"
        zip.export_txt_to_zip(tHeader, data, filename, filename)
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  mounted() {
    this.init()
  },
}
</script>

<style lang="scss">
  .watch {
    width: 100%;
    height: 100%;
    margin: 20px;
    .title {
      margin: 20px 0;
      font-size: 20px;
      color: #5f6464;
      font-weight: bold;
    }
    .nav {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      margin: 0 40px;
      .item {
        margin: 0 20px;
      }
    }
    .table {
      margin: 24px 0;
      width: 95%;
    }
  }
</style>