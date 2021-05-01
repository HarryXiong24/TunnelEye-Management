<template>
  <div class="UWBTagManage">
 
    <div class="nav">
      
      <div class="item">
        <el-button type="primary" @click="addNew" icon="el-icon-plus">新增UWB标签信息</el-button>
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

    <div class="title">所有UWB标签信息</div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.labelId).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="80"
          label="标签ID"
          prop="labelId">
        </el-table-column>
        <el-table-column
          sortable
          min-width="80"
          label="系统ID"
          prop="sysId">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="标签编号"
          prop="labelNo">
        </el-table-column>
        <el-table-column
          sortable
          min-width="80"
          label="标签地址码"
          prop="labelAdd">
        </el-table-column>
        <el-table-column
          min-width="120"
          label="安装时间"
          prop="importTime">
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark">
        </el-table-column>

        <el-table-column
          min-width="140"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入标签ID搜索"/>
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
          
          <el-form-item label="标签ID" prop="labelId">
            <el-input v-model.number="ruleForm.labelId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="系统ID" prop="sysId">
            <el-input v-model.number="ruleForm.sysId"></el-input>
          </el-form-item>

          <el-form-item label="标签编号" prop="labelNo">
            <el-input v-model="ruleForm.labelNo"></el-input>
          </el-form-item>

          <el-form-item label="标签地址码" prop="labelAdd">
            <el-input v-model.number="ruleForm.labelAdd"></el-input>
          </el-form-item>

          <el-form-item label="标签安装时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.importTime"
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

      <el-dialog title="新增UWB标签信息" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="标签ID" prop="labelId">
            <el-input v-model.number="addForm.labelId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="系统ID" prop="sysId">
            <el-input v-model.number="addForm.sysId"></el-input>
          </el-form-item>

          <el-form-item label="标签编号" prop="labelNo">
            <el-input v-model="addForm.labelNo"></el-input>
          </el-form-item>

          <el-form-item label="标签地址码" prop="labelAdd">
            <el-input v-model.number="addForm.labelAdd"></el-input>
          </el-form-item>

          <el-form-item label="标签安装时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.importTime"
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
import { reqUWBTagManage, addUWBTagManage, deleteUWBTagManage, reviewUWBTagManage } from '@/api/UWBTagManage'
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

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        labelId: null,
        sysId: null,
        labelNo: '',
        labelAdd: null,
        importTime: '',
        remark: '',
      },
      rules: {
        sysId: [
          { required: true, message: '请输入系统ID', trigger: 'blur' },
          { type: 'number', message: '系统ID必须为数字', trigger: 'blur'}
        ],
        labelNo: [
          { required: true, message: '请输入标签编号', trigger: 'blur' },  
        ],
        labelAdd: [
          { required: true, message: '请输入标签地址码', trigger: 'blur' },
          { type: 'number', message: '标签地址必须为数字', trigger: 'blur'}
        ],
        importTime: [
          { type: 'datetime', trigger: 'blur'}
        ]
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        labelId: null,
        sysId: null,
        labelNo: '',
        labelAdd: null,
        importTime: new Date(),
        remark: '',
      },
      addRules: {
        sysId: [
          { required: true, message: '请输入系统ID', trigger: 'blur' },
          { type: 'number', message: '系统ID必须为数字', trigger: 'blur'}
        ],
        labelNo: [
          { required: true, message: '请输入标签编号', trigger: 'blur' },  
        ],
        labelAdd: [
          { required: true, message: '请输入标签地址码', trigger: 'blur' },
          { type: 'number', message: '标签地址必须为数字', trigger: 'blur'}
        ],
        importTime: [
          { type: 'datetime', trigger: 'blur'}
        ]
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
      let respone = await reqUWBTagManage(data)
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
      this.ruleForm.labelId = row.labelId
      this.ruleForm.sysId = row.sysId      
      this.ruleForm.labelNo = row.labelNo
      this.ruleForm.labelAdd = row.labelAdd
      this.ruleForm.importTime = row.importTime
      this.ruleForm.remark = row.remark
      
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteUWBTagManage( row.labelId, row)
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
            sysId: this.ruleForm.sysId,
            labelNo: this.ruleForm.labelNo,
            labelAdd: this.ruleForm.labelAdd,
            importTime: moment(this.ruleForm.importTime).format('YYYY-MM-DD-HH:mm:ss'),
            remark: this.ruleForm.remark,
          }
          let response = await reviewUWBTagManage(this.ruleForm.labelId, data)
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
            sysId: this.addForm.sysId,
            labelNo: this.addForm.labelNo,
            labelAdd: this.addForm.labelAdd,
            importTime: moment(this.addForm.importTime).format('YYYY-MM-DD-HH:mm:ss'),
            remark: this.addForm.remark,
          }
          let response = await addUWBTagManage(data)
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
        const tHeader = ['标签ID', '系统ID', '标签编码', '标签地址码', '标签安装时间', '备注']
        const filterVal = ['labelId', 'sysId', 'labelNo', 'labelAdd', 'importTime', 'remark']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页UWB标签信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
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
  .UWBTagManage {
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