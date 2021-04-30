<template>
  <div class="watch">

    <div class="title">基本信息选择</div>

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
        <el-button type="primary" @click="addWorker" icon="el-icon-plus">新增成员</el-button>
      </div>
      
      <div class="item">
        <el-button type="primary" @click="refresh" icon="el-icon-refresh-right">刷新信息</el-button>
      </div>

      <div class="item">
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出Excel
        </el-button>
      </div>     

    </div>

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
          
          <el-form-item label="工号" prop="userid">
            <el-input v-model="ruleForm.userid"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="userName">
            <el-input v-model="ruleForm.userName"></el-input>
          </el-form-item>

            <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否在岗" prop="state">
            <el-radio-group v-model="ruleForm.state">
              <el-radio label="在岗"></el-radio>
              <el-radio label="未在岗"></el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="到岗时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.lockInTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>

      </el-dialog>
    </div>

     <div class="addEditor">

      <el-dialog title="信息修改" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="工号" prop="userid">
            <el-input v-model="addForm.userid"></el-input>
          </el-form-item>

          <el-form-item label="姓名" prop="userName">
            <el-input v-model="addForm.userName"></el-input>
          </el-form-item>

            <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addForm.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否在岗" prop="state">
            <el-radio-group v-model="addForm.state">
              <el-radio label="在岗"></el-radio>
              <el-radio label="未在岗"></el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="到岗时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.lockInTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm('addForm')">确认修改</el-button>
          <el-button @click="resetAddForm('addForm')">重置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
        </div>

      </el-dialog>
    </div>

  </div>
</template>

<script>
import { reqPersonInfo } from '@/api/reqPersonInfo'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { reqWorkerEditor, reqDeleteWorker, addWorker } from '@/api/workerEditor'

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

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        userid: null,
        userName: '',
        sex: '',
        state: '',
        lockInTime: null,
      },
      rules: {
        userid: [
          { required: true, message: '请填写工号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        lockInTime: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        userid: null,
        userName: '',
        sex: '',
        state: '',
        lockInTime: new Date(),
      },
      addRules: {
        userid: [
          { required: true, message: '请填写工号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        lockInTime: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      }
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
    handleEdit(index, row) {
      this.ruleForm.userid = row.userid
      this.ruleForm.userName = row.userName
      this.ruleForm.sex = row.sex
      this.ruleForm.state = row.state
      this.ruleForm.lockInTime = new Date()
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        // 未写完
        console.log(JSON.stringify(row))
        // let response = await reqDeleteWorker(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        // 每次修改完之后需要刷新一次，确保数据最新
        this.init()
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
          // 未写完
          console.log(JSON.stringify(this.ruleForm))
          // let response = await reqWorkerEditor(this.ruleForm)
          
          this.dialogFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.init()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addWorker() {
      this.addFormVisible = true
    },
    submitAddForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 未写完
          console.log(JSON.stringify(this.addForm))
          // let response = await addWorker(this.addForm)
          
          this.addFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.init()
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
      this.init()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['工号', '姓名', '性别', '是否在岗', '到岗时间']
        const filterVal = ['userid', 'userName', 'sex', 'state', 'clockInTime']
        const data = this.formatJson(filterVal)
        console.table(this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.excelTitle + "-" + parseTime(this.date)        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        console.table(v[j])
        if (j === 'lockInTime') {
          // return parseTime(v[j])
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
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
      justify-content: flex-start;
      align-items: center;
      margin: 0 20px;
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