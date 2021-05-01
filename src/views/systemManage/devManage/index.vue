<template>
  <div class="devManage">
 
    <div class="nav">
      
      <div class="item">
        <el-button type="primary" @click="addNew" icon="el-icon-plus">新增成员</el-button>
      </div>
      
      <div class="item">
        <el-button type="primary" @click="refresh" icon="el-icon-refresh-right">刷新信息</el-button>
      </div>

      <div class="item">
        <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>

    </div>

    <div class="title">所有下位机信息</div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.devNo).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="60"
          label="节点"
          prop="nodeId">
        </el-table-column>
        <el-table-column
          label="名称"
          prop="devName">
        </el-table-column>
        <el-table-column
          sortable
          min-width="60"
          label="编号"
          prop="devNo">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="地址"
          prop="devAddress">
        </el-table-column>
        <el-table-column
          sortable
          min-width="60"
          label="状态"
          prop="status">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="最近在线时间"
          prop="onlineLastTime">
        </el-table-column>
        <el-table-column
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
              placeholder="输入下位机编号搜索"/>
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
          
          <el-form-item label="下位机节点" prop="nodeId">
            <el-input v-model="ruleForm.nodeId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item>

          <el-form-item label="下位机名称" prop="devName">
            <el-input v-model="ruleForm.devName"></el-input>
          </el-form-item>

          <el-form-item label="下位机编号" prop="devNo">
            <el-input v-model.number="ruleForm.devNo"></el-input>
          </el-form-item>

          <el-form-item label="下位机地址" prop="devAddress">
            <el-input v-model="ruleForm.devAddress"></el-input>
          </el-form-item>

          <el-form-item label="下位机状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio label="1">在线</el-radio>
              <el-radio label="0">离线</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <!-- <el-form-item label="下位机最近在线时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.onlineLastTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item> -->

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

      <el-dialog title="新增成员" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="下位机节点" prop="nodeId">
            <el-input :disabled="true" placeholder="系统指定, 禁止创建"></el-input>
          </el-form-item>

          <el-form-item label="下位机名称" prop="devName">
            <el-input v-model="addForm.devName"></el-input>
          </el-form-item>          

          <el-form-item label="下位机编号" prop="devNo">
            <el-input v-model.number="addForm.devNo"></el-input>
          </el-form-item>

          <el-form-item label="下位机地址" prop="devAddress">
            <el-input v-model="addForm.devAddress"></el-input>
          </el-form-item>

          <el-form-item label="下位机状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio label="1">在线</el-radio>
              <el-radio label="0">离线</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <!-- <el-form-item label="下位机最近在线时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.onlineLastTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item> -->

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
import { reqDev, addDev, deleteDev, reviewDev } from '@/api/devManage'
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

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        nodeId: null,
        devNo: '',
        devName: '',
        devAddress: '',
        status: '',
        // onlineLastTime: '',
        remark: null,
      },
      rules: {
        // devName: [
        //   { required: true, message: '请填写下位机名称', trigger: 'blur' }
        // ],
        devNo: [
          { required: true, message: '请输入下位机编号', trigger: 'blur' },
          { type: 'number', message: '下位机编号必须为数字', trigger: 'blur'}
        ],
        devAddress: [
          { required: true, message: '请输入下位机地址', trigger: 'blur' },
        ],
        // onlineLastTime: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        status: [
          { required: true, message: '请选择下位机状态', trigger: 'blur' }
        ],
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        nodeId: null,
        devNo: null,
        devName: '',
        devAddress: '',
        status: '',
        // onlineLastTime: new Date(),
        remark: null,
      },
      addRules: {
        // devName: [
        //   { required: true, message: '请填写下位机名称', trigger: 'blur' }
        // ],
        devNo: [
          { required: true, message: '请输入下位机编号', trigger: 'blur' },
          { type: 'number', message: '下位机编号必须为数字', trigger: 'blur'}
        ],
        devAddress: [
          { required: true, message: '请输入下位机地址', trigger: 'blur' },
        ],
        // onlineLastTime: [
        //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        // ],
        status: [
          { required: true, message: '请选择下位机状态', trigger: 'change' }
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
      let respone = await reqDev(data)
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
      this.ruleForm.nodeId = row.nodeId
      this.ruleForm.devNo = row.devNo
      this.ruleForm.devName = row.devName
      this.ruleForm.devAddress = row.devAddress
      this.ruleForm.status = String(row.status)
      // this.ruleForm.onlineLastTime = new Date()
      this.ruleForm.remark = row.remark
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteDev( row.nodeId, row)
        let msg = response.data.msg
        // 这里后台有bug,若要删除的记录被从表关联了，则不能删除，待处理
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
            devNo: this.ruleForm.devNo,
            devName: this.ruleForm.devName,
            devAddress: this.ruleForm.devAddress,
            status: Number(this.ruleForm.status),
            remark: this.ruleForm.remark
          }
          let response = await reviewDev(this.ruleForm.nodeId, data)
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
            devNo: this.addForm.devNo,
            devName: this.addForm.devName,
            devAddress: this.addForm.devAddress,
            status: Number(this.addForm.status),
            remark: this.addForm.remark
          }
          let response = await addDev(data)
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
        const tHeader = ['下位机节点', '下位机编号', '下位机地址', '下位机状态', '下位机最近在线时间', '备注']
        const filterVal = ['nodeId', 'devNo', 'devAddress', 'status', 'onlineLastTime', 'remark']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页下位机信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
  },
  async mounted() {
    await this.getDevInfo(1)
  },
}
</script>

<style lang="scss">
  .devManage {
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