<template>
  <div class="UWBManage">
 
    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增UWB系统信息</el-button>
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

    <div class="title">所有UWB系统信息</div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || String(data.sysId).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="80"
          label="系统ID"
          prop="sysId">
        </el-table-column>
        <el-table-column
          sortable
          min-width="80"
          label="节点ID"
          prop="nodeId">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="系统名"
          prop="sysName">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="串口号"
          prop="serialNo">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="波特率"
          prop="baud">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="检验位"
          prop="checkBit">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="数据位"
          prop="dataBit">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="停止位"
          prop="stopBit">
        </el-table-column>
        <el-table-column
          min-width="100"
          label="安装位置"
          prop="setUpAdd">
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
              placeholder="输入系统ID搜索"/>
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
          
          <el-form-item label="系统ID" prop="sysId">
            <el-input v-model="ruleForm.sysId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item>

          <el-form-item label="node节点" prop="nodeId">
            <el-select v-model="ruleForm.nodeId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="系统名称" prop="sysName">
            <el-input v-model="ruleForm.sysName"></el-input>
          </el-form-item>

          <el-form-item label="串口号" prop="serialNo">
            <el-input v-model.number="ruleForm.serialNo"></el-input>
          </el-form-item>

          <el-form-item label="波特率" prop="baud">
            <el-input v-model.number="ruleForm.baud"></el-input>
          </el-form-item>

          <el-form-item label="检验位" prop="checkBit">
            <el-input v-model.number="ruleForm.checkBit"></el-input>
          </el-form-item>

          <el-form-item label="数据位" prop="dataBit">
            <el-input v-model.number="ruleForm.dataBit"></el-input>
          </el-form-item>

          <el-form-item label="停止位" prop="stopBit">
            <el-input v-model.number="ruleForm.stopBit"></el-input>
          </el-form-item>

          <el-form-item label="安装位置" prop="setUpAdd">
            <el-input v-model="ruleForm.setUpAdd"></el-input>
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

      <el-dialog title="新增UWB系统信息" :visible.sync="addFormVisible" center>

        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="系统ID" prop="sysId">
            <el-input v-model="addForm.sysId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item>

          <el-form-item label="node节点" prop="nodeId">
            <el-select v-model="addForm.nodeId" size="medium" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="系统名称" prop="sysName">
            <el-input v-model="addForm.sysName"></el-input>
          </el-form-item>

          <el-form-item label="串口号" prop="serialNo">
            <el-input v-model.number="addForm.serialNo"></el-input>
          </el-form-item>

          <el-form-item label="波特率" prop="baud">
            <el-input v-model.number="addForm.baud"></el-input>
          </el-form-item>

          <el-form-item label="检验位" prop="checkBit">
            <el-input v-model.number="addForm.checkBit"></el-input>
          </el-form-item>

          <el-form-item label="数据位" prop="dataBit">
            <el-input v-model.number="addForm.dataBit"></el-input>
          </el-form-item>

          <el-form-item label="停止位" prop="stopBit">
            <el-input v-model.number="addForm.stopBit"></el-input>
          </el-form-item>

          <el-form-item label="安装位置" prop="setUpAdd">
            <el-input v-model="addForm.setUpAdd"></el-input>
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
import { reqUWBInfo, addUWBInfo, deleteUWBInfo, reviewUWBInfo } from '@/api/UWBManage'
import { reqNodeId } from '@/api/getSelectId'
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
      centerDialogVisible: false,

      // 两个表单的下拉框
      options: [],

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        sysId: null,
        nodeId: null,
        sysName: '',
        serialNo: null,
        baud: null,
        checkBit: null,
        dataBit: null,
        stopBit: null,
        setUpAdd: '',
        remark: '',
      },
      rules: {
        nodeId: [
          { required: true, message: '请输入节点ID', trigger: 'blur' },
          { type: 'number', message: '节点ID必须为数字', trigger: 'blur'}
        ],
        sysName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },  
        ],
        serialNo: [
          { required: true, message: '请输入串口号', trigger: 'blur' },
          { type: 'number', message: '串口号必须为数字', trigger: 'blur'}
        ],
        baud: [
          { validator: validateNumber, trigger: 'blur'}
        ],
        checkBit: [
          { validator: validateNumber, trigger: 'blur'}, 
        ],
        dataBit: [
          { validator: validateNumber, trigger: 'blur'},
        ],
        stopBit: [
          { validator: validateNumber, trigger: 'blur'},
        ],
        setUpAdd: [
          { required: true, message: '请输入系统安装位置', trigger: 'blur' },  
        ]
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        sysId: null,
        nodeId: null,
        sysName: '',
        serialNo: null,
        baud: null,
        checkBit: null,
        dataBit: null,
        stopBit: null,
        setUpAdd: '',
        remark: '',
      },
      addRules: {
        nodeId: [
          { required: true, message: '请输入节点ID', trigger: 'blur' },
          { type: 'number', message: '节点ID必须为数字', trigger: 'blur'}
        ],
        sysName: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },  
        ],
        serialNo: [
          { required: true, message: '请输入串口号', trigger: 'blur' },
          { type: 'number', message: '串口号必须为数字', trigger: 'blur'}
        ],
        baud: [
          { validator: validateNumber, trigger: 'blur'}
        ],
        checkBit: [
          { validator: validateNumber, trigger: 'blur'}, 
        ],
        dataBit: [
          { validator: validateNumber, trigger: 'blur'},
        ],
        stopBit: [
          { validator: validateNumber, trigger: 'blur'},
        ],
        setUpAdd: [
          { required: true, message: '请输入系统安装位置', trigger: 'blur' },  
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
      let respone = await reqUWBInfo(data)
      let result = respone.data

      this.count = result.count
      this.page = page
      this.tableData = result.data
    },
    async getNodeId() {
      let respone = await reqNodeId()
      let result = respone.data

      // 使用前先清空
      this.options = []

      result.forEach(value => {
        let arr = {
          value: value.nodeId,
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
      this.ruleForm.sysId = row.sysId      
      this.ruleForm.nodeId = row.nodeId
      this.ruleForm.sysName = row.sysName
      this.ruleForm.serialNo = row.serialNo
      this.ruleForm.baud = row.baud
      this.ruleForm.checkBit = row.checkBit
      this.ruleForm.dataBit = row.dataBit
      this.ruleForm.stopBit = row.stopBit
      this.ruleForm.setUpAdd = row.setUpAdd
      this.ruleForm.remark = row.remark

      this.getNodeId()
      
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteUWBInfo( row.sysId, row)
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
            nodeId: this.ruleForm.nodeId,
            serialNo: this.ruleForm.serialNo,
            sysName: this.ruleForm.sysName,
            baud: this.ruleForm.baud,
            checkBit: this.ruleForm.checkBit,
            dataBit: this.ruleForm.dataBit,
            stopBit: this.ruleForm.stopBit,
            setUpAdd: this.ruleForm.setUpAdd,
            remark: this.ruleForm.remark,
          }
          let response = await reviewUWBInfo(this.ruleForm.sysId, data)
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
      this.getNodeId()
      this.addFormVisible = true
      this.resetAddForm('addForm')
    },
    submitAddForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 有问题待讨论解决
          let data = {
            nodeId: this.addForm.nodeId,
            serialNo: this.addForm.serialNo,
            sysName: this.addForm.sysName,
            baud: this.addForm.baud,
            checkBit: this.addForm.checkBit,
            dataBit: this.addForm.dataBit,
            stopBit: this.addForm.stopBit,
            setUpAdd: this.addForm.setUpAdd,
            remark: this.addForm.remark,
          }
          let response = await addUWBInfo(data)
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
        const tHeader = ['系统ID', '节点ID', '系统名称', '串口号', '波特率', '检验位', '数据位', '停止位', '安装位置', '备注']
        const filterVal = ['sysId', 'nodeId', 'sysName', 'serialNo', 'baud', 'checkBit', 'dataBit', 'stopBit', 'setUpAdd', 'remark']
        const data = this.formatJson(filterVal, this.tableData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页UWB系统信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['系统ID', '节点ID', '系统名称', '串口号', '波特率', '检验位', '数据位', '停止位', '安装位置', '备注']
        const filterVal = ['sysId', 'nodeId', 'sysName', 'serialNo', 'baud', 'checkBit', 'dataBit', 'stopBit', 'setUpAdd', 'remark']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        const filename = "第" + this.page + "页UWB系统信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
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
}
</script>

<style lang="scss">
  .UWBManage {
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