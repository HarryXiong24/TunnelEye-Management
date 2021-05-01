<template>
  <div class="manageWork">
 
    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增排班信息</el-button>
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

    <div class="title">所有班组的排班信息</div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.groupId).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="80"
          label="序号"
          prop="dutyId">
        </el-table-column>
        <el-table-column
          sortable
          min-width="80"
          label="班组ID"
          prop="groupId">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="开始工作时间"
          prop="startTime">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="结束工作时间"
          prop="endTime">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="备注"
          prop="remark">
        </el-table-column>

        <el-table-column
          min-width="120"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入班组ID搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>

    <div class="workEditor">

      <el-dialog title="信息修改" :visible.sync="dialogFormVisible" center>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="序号" prop="dutyId">
            <el-input v-model.number="ruleForm.dutyId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="班组ID" prop="groupId">
            <el-input v-model.number="ruleForm.groupId"></el-input>
          </el-form-item>

          <el-form-item label="开始工作时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.startTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="结束工作时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>

      </el-dialog>
    </div>

     <div class="addEditor">

      <el-dialog title="新增班组排班信息" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="序号" prop="dutyId">
            <el-input v-model.number="addForm.dutyId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="班组ID" prop="groupId">
            <el-input v-model.number="addForm.groupId"></el-input>
          </el-form-item>

          <el-form-item label="开始工作时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.startTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="结束工作时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.endTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input v-model="addForm.remark"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm('addForm')">确认新增</el-button>
          <el-button @click="resetAddForm('addForm')">重置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
        </div>

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
import { reqManageWork, addManageWork, deleteManageWork, reviewManageWork } from '@/api/manageWork'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  data() {
    let validateNumber = (rule, value, callback) => {
      if (typeof value === 'string' && value !== '') {
        callback(new Error('该项必须为数字'));
      } else {
        callback();
      }
    }
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

      // 导出框选择的属性
      centerDialogVisible: false,

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        dutyId: null,
        groupId: null,
        startTime: '',
        endTime: '',
        remark: '',
      },
      rules: {
        groupId: [
          { required: true, message: '请输入系统ID', trigger: 'blur' },
          { type: 'number', message: '系统ID必须为数字', trigger: 'blur'}
        ],
        startTime: [
          { type: 'date', required: true, message: '请输入时间', trigger: 'blur'}
        ],
        endTime: [
          { type: 'date', required: true, message: '请输入时间', trigger: 'blur'}
        ],
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        dutyId: null,
        groupId: null,
        startTime: new Date(),
        endTime: new Date(),
        remark: '',
      },
      addRules: {
        groupId: [
          { required: true, message: '请输入系统ID', trigger: 'blur' },
          { type: 'number', message: '系统ID必须为数字', trigger: 'blur'}
        ],
        startTime: [
          { type: 'date', required: true, message: '请输入时间', trigger: 'blur'}
        ],
        endTime: [
          { type: 'date', required: true, message: '请输入时间', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    // 获得数据
    async getDevInfo(page) {
      let data = {
        page: page,
        limit: 10
      }
      let respone = await reqManageWork(data)
      let result = respone.data

      this.count = result.count
      this.page = page
      this.tableData = result.data
    },
    // 处理分页请求, 同时更新数据
    handleCurrentChange(val) {
      this.getDevInfo(val)
    },
    handleEdit(index, row) {
      this.ruleForm.dutyId = row.dutyId
      this.ruleForm.groupId = row.groupId      
      this.ruleForm.startTime = row.startTime
      this.ruleForm.endTime = row.endTime
      this.ruleForm.remark = row.remark
      
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteManageWork( row.dutyId, row)
        let msg = response.data.msg
       
        this.$message({
          type: 'success',
          message: msg
        });
        // 每次修改完之后需要刷新一次，确保数据最新
        this.getDevInfo(this.page)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 有问题待讨论解决
          let data = {
            groupId: this.ruleForm.groupId,
            startTime: moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
            remark: this.ruleForm.remark,
          }
          let response = await reviewManageWork(this.ruleForm.dutyId, data)
          let msg = response.data.msg
          this.$message({
            type: 'success',
            message: msg
          });
          this.dialogFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.getDevInfo(this.page)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addNew() {
      // 要清空，不然下一次就会有之前添加的信息
      this.addFormVisible = true
      this.resetAddForm('addForm')
    },
    submitAddForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 有问题待讨论解决
          let data = {
            groupId: this.addForm.groupId,
            startTime: moment(this.addForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(this.addForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
            remark: this.addForm.remark,
          }
          let response = await addManageWork(data)
          let msg = response.data.msg
          this.$message({
            type: 'success',
            message: msg
          });
          this.addFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.getDevInfo(this.page)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetAddForm(formName) {
      this.$refs[formName].resetFields();
    },
    refresh() {
      this.getDevInfo(this.page)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '班组ID', '开始时间', '结束时间', '备注']
        const filterVal = ['dutyId', 'groupId', 'startTime', 'endTime', 'remark']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页排班信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['序号', '班组ID', '开始时间', '结束时间', '备注']
        const filterVal = ['dutyId', 'groupId', 'startTime', 'endTime', 'remark']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const filename = "第" + this.page + "页排班信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
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
    await this.getDevInfo(1)
    let localLocale = moment('2021.5.1');
    localLocale.locale('zh-cn')
    let result = localLocale.format('dddd')
    console.log(result);
  },
}
</script>

<style lang="scss">
  .manageWork {
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
  }
</style>
