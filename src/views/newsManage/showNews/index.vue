<template>
  <div class="showNews">
 
    <div class="nav">
      
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

    <div class="title">所有预警消息</div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.infoAuthor).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="80"
          label="消息ID"
          prop="infoId">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="消息发布者"
          prop="infoAuthor">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="信息来源"
          prop="infoSource">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="发布时间"
          prop="infoTime">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="信息标题"
          prop="infoTitle">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="信息类型"
          prop="infoType">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="预警等级"
          prop="level">
        </el-table-column>

        <el-table-column
          min-width="120"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入消息发布者搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog
        :title="infoDetail.infoTitle"
        :visible.sync="visible"
        width="50%"
        class="dialog"
        center>
          <span :style="{'color':theme, 'font-size': '16px'}">信息内容: </span>
          <el-card class="box-card" shadow="never">
            <div class="text item">
              {{infoDetail.infoContent}}
            </div>
          </el-card>
          <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="visible = false">关闭</el-button>
        </span>
      </el-dialog>

    </div>

    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="count"
        :page-size="10"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { reqNews, reqNewsDetail } from '@/api/showNews'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  data() {
    return {
      // 总页数
      count: 0,
      // 记录当前页码数
      page: 0,

      // 表格的属性
      tableData: [], // 存放返回的数据
      search: '',
      
      // 导出Excel的属性
      downloadLoading: false,
      excelTitle: '',
      centerDialogVisible: false,

      // 消息详情
      infoDetail: [],
      // 是否可见
      visible: false,
    }
  },
  methods: {
    // 获得数据
    async getDevInfo(page) {
      let data = {
        page: page,
        limit: 10
      }
      let respone = await reqNews(data)
      let result = respone.data
      
      this.count = result.count
      this.page = page
      this.tableData = result.data
    },
    // 处理分页请求, 同时更新数据
    handleCurrentChange(val) {
      this.getDevInfo(val)
    },
    async handleEdit(index, row) {
      let data = {
        infoId: row.infoId
      }
      this.infoDetail = []  // 每次查看前要清空
      let respone = await reqNewsDetail(data)
      let result = respone.data

      this.infoDetail = result
      this.visible = true
    },
    refresh() {
      this.getDevInfo(this.page)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['消息ID', '消息发布者', '信息来源', '发布时间', '信息标题', '信息类型', '预警等级']
        const filterVal = ['infoId', 'infoAuthor', 'infoSource', 'infoTime', 'infoTitle', 'infoType', 'level']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页预警信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['消息ID', '消息发布者', '信息来源', '发布时间', '信息标题', '信息类型', '预警等级']
        const filterVal = ['infoId', 'infoAuthor', 'infoSource', 'infoTime', 'infoTitle', 'infoType', 'level']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const filename = "第" + this.page + "页UWB标签信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
        zip.export_txt_to_zip(tHeader, data, filename, filename)
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  async mounted() {
    await this.getDevInfo(1)
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
}
</script>

<style lang="scss">
  .showNews {
    width: 100%;
    height: 100%;
    margin: 20px;
    .title {
      margin: 30px 0;
      font-size: 24px;
      color: #5f6464;
      font-weight: bold;
    }
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
    .table {
      margin: 24px 0;
      width: 95%;
    }

    .dialog {
      .box-card {
        margin: 20px 0;
        .text {
          font-size: 14px;
          color: #5f6464; 
        }
        .item {
          padding: 2px 0;
        }
      }
    }
  }
</style>