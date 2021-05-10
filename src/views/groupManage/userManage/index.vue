<template>
<div>
  <div class="SensorsManage" v-if="adminDialog">
    
    <el-dialog
      title="提示"
      :visible="adminDialogVisible"
      width="30%"
      center>
      <span>您是管理员, 可以进入用户信息修改页面, 请谨慎修改用户信息!</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="adminDialogVisible = false">我已知晓</el-button>
      </span>
    </el-dialog>

    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增用户信息</el-button>
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

    <div class="title">所有用户信息</div>

    <div class="table">

      <el-table
        :data="tableShowData.filter(data => !search || String(data.userName).includes(search))"
        style="width: 100%"
        height="360px">
        <el-table-column
          fixed
          sortable
          width="100"
          label="用户ID"
          prop="userid">
        </el-table-column>
        <el-table-column
          width="80"
          label="用户姓名"
          prop="userName">
        </el-table-column>
        <el-table-column
          width="80"
          label="登录名"
          prop="loginName">
        </el-table-column>
        <el-table-column
          width="100"
          label="用户类型"
          prop="userType">
        </el-table-column>
        <el-table-column
          width="100"
          label="用户密码"
          prop="pass">
        </el-table-column>
        <el-table-column
          width="100"
          label="所属部门ID"
          prop="depId">
        </el-table-column>
        <el-table-column
          width="60"
          label="性别"
          prop="sex">
        </el-table-column>
        <el-table-column
          width="110"
          label="手机"
          prop="mobile">
        </el-table-column>
        <el-table-column
          width="160"
          label="身份证"
          prop="idCard">
        </el-table-column>
        <el-table-column
          width="160"
          label="上一次登录时间"
          prop="lastTime">
        </el-table-column>

        <el-table-column
          fixed="right"
          width="160"
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
          
          <el-form-item label="用户ID" prop="userid">
            <el-input v-model.number="ruleForm.userid" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="ruleForm.userName"></el-input>
          </el-form-item>

          <el-form-item label="用户登录名" prop="loginName">
            <el-input v-model="ruleForm.loginName"></el-input>
          </el-form-item>

          <el-form-item label="用户类型" prop="userType">
            <el-radio-group v-model="ruleForm.userType">
              <el-radio :label="1">管理员</el-radio>
              <el-radio :label="0">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="密码" prop="pass">
            <el-input v-model.number="ruleForm.pass"></el-input>
          </el-form-item>

          <el-form-item label="所属部门" prop="depId">
            <el-select v-model="ruleForm.depId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 

          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="ruleForm.idCard"></el-input>
          </el-form-item>

          <el-form-item label="上一次登录时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.lastTime"
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

      <el-dialog title="新增传感器信息" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="用户ID" prop="userid">
            <el-input v-model.number="addForm.userid" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="addForm.userName"></el-input>
          </el-form-item>

          <el-form-item label="用户登录名" prop="loginName">
            <el-input v-model="addForm.loginName"></el-input>
          </el-form-item>

          <el-form-item label="用户类型" prop="userType">
            <el-radio-group v-model="addForm.userType">
              <el-radio :label="1">管理员</el-radio>
              <el-radio :label="0">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>
        
          <el-form-item label="密码" prop="pass">
            <el-input v-model.number="addForm.pass"></el-input>
          </el-form-item>

          <el-form-item label="所属部门" prop="depId">
            <el-select v-model="addForm.depId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 

          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="addForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>

          <el-form-item label="身份证" prop="idCard">
            <el-input v-model="addForm.idCard"></el-input>
          </el-form-item>

          <el-form-item label="上一次登录时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.lastTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-col>
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

  <div class="disShow" v-else-if="!adminDialog">
     <el-card shadow="always" class="card">
      <div slot="header" class="clearfix">
          <span class="title" :style="{'color':theme}">提示</span>
      </div>
      <div class="item">
          1. 您不是管理员，没有修改用户信息的权限
      </div>
      <div class="item">
          2. 如果想获得该权限，请联系系统已有管理员进行修改
      </div>
    </el-card>
  </div>

</div>

</template>

<script>
import { reqUserInfo, addUserInfo, deleteUserInfo, reviewUserInfo } from '@/api/userGroup'
import { reqDepartmentId } from '@/api/getSelectId'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive
import { decrypt } from '@/utils/crypto'

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

      // 接受的数据, 存放返回的数据
      tableData: [],

      // 进入页面权限的属性
      adminDialogVisible: false,
      adminDialog: false,

      // 表格的属性, 因为传感器类型需要翻译一下
      tableShowData: [],
      search: '',
      centerDialogVisible: false,
      
      // 导出Excel的属性
      downloadLoading: false,
      excelTitle: '',

      // 两个表单的下拉框
      options: [],

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        userid: null,
        userName: '',
        loginName: '',
        userType: null,
        pass: '',
        depId: null,
        sex: null,
        mobile: '',
        idCard: '',
        lastTime: '',
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },  
        ],
        loginName: [
          { required: true, message: '请输入用户登录名', trigger: 'blur' },  
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },  
        ],
        depId: [
          { required: true, message: '请输入所属部门ID', trigger: 'blur' },
          { type: 'number', message: '所属部门ID必须为数字', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ],
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        userid: null,
        userName: '',
        loginName: '',
        userType: null,
        pass: '',
        depId: null,
        sex: null,
        mobile: '',
        idCard: '',
        lastTime: '',
      },
      addRules: {
        userName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },  
        ],
        loginName: [
          { required: true, message: '请输入用户登录名', trigger: 'blur' },  
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },  
        ],
        depId: [
          { required: true, message: '请输入所属部门ID', trigger: 'blur' },
          { type: 'number', message: '所属部门ID必须为数字', trigger: 'blur'}
        ],
        sex: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    judgeAdmin() {
      let userInfo = JSON.parse(decrypt(sessionStorage.getItem('userInfo')))
      console.log(userInfo);
      if (userInfo.userType === 1) {
        this.adminDialogVisible = true
        this.adminDialog = true
      } else {
        this.adminDialogVisible = false
        this.adminDialog = false
      }
    },
    translateType(mode, val) {
      if (mode === 'ntos') {
        if (val === 1) {
          return '管理员'
        } else if (val === 0) {
          return '普通用户'
        }
      } else if (mode === 'ston') {
        if (val === '管理员') {
          return 1
        } else if (val === '普通用户') {
          return 0
        } 
      } else {
        return 'params error!'
      }
    },
    translateSex(mode, val) {
      if (mode === 'ntos') {
        if (val === 1) {
          return '男'
        } else {
          return '女'
        }
      } else if (mode === 'ston') {
        if (val === '男') {
          return 1
        } else {
          return 0
        } 
      } else {
        return 'params error!'
      }
    },
    // 获得数据
    async getDevInfo(page) {
      let data = {
        page: page,
        limit: 10
      }
      let respone = await reqUserInfo(data)
      let result = respone.data

      this.count = result.count
      this.page = page
      this.tableData = result.data
      this.tableShowData = []

      this.tableData.forEach( (val) => {
        let data =  {
          userid: val.userid,
          userName: val.userName,
          loginName: val.loginName,
          userType: this.translateType('ntos', val.userType),
          pass: val.pass,
          depId: val.depId,
          sex: this.translateSex('ntos', val.sex),
          mobile: val.mobile,
          idCard: val.idCard,
          lastTime: val.lastTime,
        }
        this.tableShowData.push(data)
      })
    },
    async getSelectId() {
      let respone = await reqDepartmentId()
      let result = respone.data

      // 使用前先清空
      this.options = []

      result.forEach(value => {
        let arr = {
          value: value.depId,
          label: value.msg
        }
        this.options.push(arr)
      });
    },
    // 处理分页请求, 同时更新数据
    handleCurrentChange(val) {
      this.getDevInfo(val)
    },
    handleEdit(index, row) {
      this.ruleForm.userid = row.userid
      this.ruleForm.userName = row.userName  
      this.ruleForm.loginName = row.loginName      
      this.ruleForm.userType = this.translateType('ston', row.userType)
      this.ruleForm.pass = row.pass
      this.ruleForm.depId = row.depId
      this.ruleForm.sex = this.translateSex('ston', row.sex)
      this.ruleForm.mobile = row.mobile   
      this.ruleForm.idCard = row.idCard
      this.ruleForm.lastTime = row.lastTime

      this.getSelectId()
      
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteUserInfo( row.userid, row)
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
            userName: this.ruleForm.userName,
            loginName: this.ruleForm.loginName,
            userType: this.ruleForm.userType,
            pass: this.ruleForm.pass,
            depId: this.ruleForm.depId,
            sex: this.ruleForm.sex,
            mobile: this.ruleForm.mobile,
            idCard: this.ruleForm.idCard,
            lastTime: moment(this.ruleForm.lastTime).format('YYYY-MM-DD HH:mm:ss'),
          }
          let response = await reviewUserInfo(this.ruleForm.userid, data)
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
      this.getSelectId()
      this.addFormVisible = true
      this.resetAddForm('addForm')
    },
    submitAddForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 有问题待讨论解决
          let data = {
            userName: this.addForm.userName,
            loginName: this.addForm.loginName,
            userType: this.addForm.userType,
            pass: this.addForm.pass,
            depId: this.addForm.depId,
            sex: this.addForm.sex,
            mobile: this.addForm.mobile,
            idCard: this.addForm.idCard,
            lastTime: moment(this.addForm.lastTime).format('YYYY-MM-DD HH:mm:ss'),
          }
          let response = await addUserInfo(data)
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
        const tHeader = ['用户ID', '用户名称', '用户登录名', '用户类型', '密码', '所属部门ID', '性别', '联系方式', '身份证', '最近一次登录时间']
        const filterVal = ['userid', 'userName', 'loginName', 'userType', 'pass', 'depId', 'sex', 'mobile', 'idCard', 'lastTime']
        const data = this.formatJson(filterVal, this.tableShowData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页用户信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['用户ID', '用户名称', '用户登录名', '用户类型', '密码', '所属部门ID', '性别', '联系方式', '身份证', '最近一次登录时间']
        const filterVal = ['userid', 'userName', 'loginName', 'userType', 'pass', 'depId', 'sex', 'mobile', 'idCard', 'lastTime']
        const list = this.tableShowData
        const data = this.formatJson(filterVal, list)
        const filename = "第" + this.page + "页用户信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
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
    this.judgeAdmin()
    if (this.adminDialog === true) {
      await this.getDevInfo(1)
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
}
</script>

<style lang="scss">
  .SensorsManage {
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

  .disShow {
    width: 100%;
    height: 600px;
    position: relative;
    .show {
      float: right;
      margin-right: 50px;
      margin-top: 5px
    }

    .card {
      position: absolute;
      top: 20px;
      margin: 0 20px 0 20px;
      width: 60%;

      .title {
        padding-left: -20px;
        font-size: 24px;
        color: #5f6464;        
      }
      
      .item {
        margin-bottom: 18px;
        font-size: 14px;
        color: #434444;
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
