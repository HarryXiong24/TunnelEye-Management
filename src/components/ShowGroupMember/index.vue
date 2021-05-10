<template>
  <div class="showGroupMember">
 
    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增成员</el-button>
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
      center
      append-to-body>
      <el-button plain v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        导出Excel文件
      </el-button>
      <el-button plain :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownloadZip">
        导出TXT文件
      </el-button>
    </el-dialog>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.userName).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="60"
          label="成员ID"
          prop="userid">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="成员姓名"
          prop="userName">
        </el-table-column>

        <el-table-column
          min-width="60"
          label="绑定的标签ID"
          prop="labelId">
        </el-table-column>

        <el-table-column
          min-width="120"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入成员姓名搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)">给用户绑定标签</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>

    <div class="workEditor">

      <el-dialog append-to-body title="信息修改" :visible.sync="dialogFormVisible" center>

        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="成员ID" prop="userid">
            <el-input v-model.number="ruleForm.userid" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="成员姓名" prop="userName">
            <el-input v-model="ruleForm.userName" :disabled="true" placeholder="禁止修改"></el-input>
          </el-form-item>

          <el-form-item label="绑定的标签ID" prop="labelId">
            <el-input v-model.number="ruleForm.labelId"></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>

      </el-dialog>
    </div>

     <div class="addEditor">

      <el-dialog append-to-body title="新增成员" :visible.sync="addFormVisible" center>

        <el-form label-position="top" :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="成员ID" prop="userid">
            <el-input v-model.number="addForm.userid"></el-input>
          </el-form-item> 

          <el-form-item label="成员所在班组" prop="groupId">
            <el-select v-model="addForm.groupId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm('addForm')">确认新增</el-button>
          <el-button @click="resetAddForm('addForm')">重置</el-button>
          <el-button @click="addFormVisible = false">取 消</el-button>
        </div>

      </el-dialog>
    </div>

  </div>
</template>

<script>
import { reqGroup, addWorker, deleteWorker, bindLabel } from '@/api/manageGroup'
import { reqGroupId } from '@/api/getSelectId'
import moment from 'moment';
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  props: {
    users: Array,
    groupId: Number,
    page: Number,
    groupName: String,
  },
  data() {
    return {
      name: this.groupName,

      // 表格的属性
      previousData: [],
      tableData: this.users, // 存放返回的数据
      search: '',
      
      // 导出Excel的属性
      downloadLoading: false,
      excelTitle: '',

      // 导出框选择的属性
      centerDialogVisible: false,

      // 两个表单的下拉框
      options: [],

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        userid: null,
        userName: '',
        labelId: null,
        labelAdd: null,
      },
      rules: {
        userName: [
          { required: true, message: '请输入班组名称', trigger: 'blur' },
        ],
        labelId: [
          { required: true, message: '请输入标签ID', trigger: 'blur' },
          { type: 'number', message: '标签ID必须为数字', trigger: 'blur'}
        ]
      },

      // 新增信息的属性
      showTableTitle: '',
      addFormVisible: false,
      addForm: {
        userid: null,
        userName: '',
        labelAdd: null,
        labelId: null,
        groupId: null,
      },
      addRules: {
        groupId: [
          { required: true, message: '请输入用户所在的班组', trigger: 'blur' },
          { type: 'number', message: '用户所在的班组必须为数字', trigger: 'blur'}
        ],
        userid: [
          { required: true, message: '请输入用户ID', trigger: 'blur' },
          { type: 'number', message: '用户ID必须为数字', trigger: 'blur'}
        ],
      },

    }
  },
  methods: {
    // 获得数据
    async getDevInfo(page) {
      let data = {
        page: page,
        limit: 10
      }
      let respone = await reqGroup(data)
      let result = respone.data

      this.page = page
      this.previousData = result.data

      this.previousData.forEach(value => {
        if(value.groupId === this.groupId) {
          this.tableData = value.users
        }
      })
    },
    async getSelectId() {
      let respone = await reqGroupId()
      let result = respone.data

      // 使用前先清空
      this.options = []

      result.forEach(value => {
        let arr = {
          value: value.groupId,
          label: value.msg
        }
        this.options.push(arr)
      });
    },
    handleEdit(index, row) {
      this.ruleForm.userid = row.userid
      this.ruleForm.userName = row.userName     
      this.ruleForm.labelId = row.labelId
      this.ruleForm.labelAdd = row.labelAdd

      this.getSelectId()

      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let data = {
          groupId: this.groupId,
          userId: row.userid
        }
        console.log(data);
        let response = await deleteWorker(data)
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
            userId: this.ruleForm.userid,
            labelId: this.ruleForm.labelId
          }
          console.log(data)
          let response = await bindLabel(data)
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
          let data = {
            userId: this.addForm.userid,
            groupId: this.groupId,
          }
          let response = await addWorker(data)
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
        const tHeader = ['用户ID', '用户姓名', '绑定标签']
        const filterVal = ['userid', 'userName', 'labelId']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.name + "成员信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['用户ID', '用户姓名', '绑定标签']
        const filterVal = ['userid', 'userName', 'labelId']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const filename = this.name + "成员信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
        zip.export_txt_to_zip(tHeader, data, filename, filename)
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
}
</script>

<style lang="scss">
  .showGroupMember {
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
