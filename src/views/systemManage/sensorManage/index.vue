<template>
  <div class="SensorsManage">
 
    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增传感器信息</el-button>
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

    <div class="title">所有传感器信息</div>

    <div class="table">

      <el-table
        :data="tableShowData.filter(data => !search || String(data.sensorId).includes(search))"
        style="width: 100%">
        <el-table-column
          sortable
          min-width="70"
          label="传感器ID"
          prop="sensorId">
        </el-table-column>
        <el-table-column
          min-width="60"
          label="传感器名"
          prop="sensorNo">
        </el-table-column>
        <el-table-column
          min-width="70"
          label="传感器类型"
          prop="sensorType">
        </el-table-column>
        <el-table-column
          sortable
          min-width="100"
          label="传感器地址码"
          prop="sensorAdd">
        </el-table-column>
        <el-table-column
          sortable
          min-width="70"
          label="节点ID"
          prop="nodeId">
        </el-table-column>
        <el-table-column
          min-width="110"
          label="安装位置"
          prop="setUpAdd">
        </el-table-column>
        <el-table-column
          min-width="110"
          label="安装时间"
          prop="importTime">
        </el-table-column>

        <el-table-column
          min-width="110"
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入传感器ID搜索"/>
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
          
          <el-form-item label="传感器ID" prop="sensorId">
            <el-input v-model.number="ruleForm.sensorId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="传感器名称" prop="sensorNo">
            <el-input v-model="ruleForm.sensorNo"></el-input>
          </el-form-item>

          <el-form-item label="传感器类型" prop="sensorType">
            <el-radio-group v-model="ruleForm.sensorType">
              <el-radio :label="1">甲烷</el-radio>
              <el-radio :label="2">氧气</el-radio>
              <el-radio :label="3">硫化氢</el-radio>
              <el-radio :label="4">一氧化碳</el-radio>
              <el-radio :label="5">液位传感器</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="标签地址码" prop="sensorAdd">
            <el-input v-model.number="ruleForm.sensorAdd"></el-input>
          </el-form-item>

          <el-form-item label="node节点ID" prop="nodeId">
            <el-input v-model.number="ruleForm.nodeId"></el-input>
          </el-form-item>

          <el-form-item label="传感器安装地址" prop="setUpAdd">
            <el-input v-model="ruleForm.setUpAdd"></el-input>
          </el-form-item>

          <el-form-item label="传感器安装时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="ruleForm.importTime"
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
          
          <el-form-item label="传感器ID" prop="sensorId">
            <el-input v-model.number="addForm.sensorId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="传感器名称" prop="sensorNo">
            <el-input v-model="addForm.sensorNo"></el-input>
          </el-form-item>

          <el-form-item label="传感器类型" prop="sensorType">
            <el-radio-group v-model="addForm.sensorType">
              <el-radio :label="1">甲烷</el-radio>
              <el-radio :label="2">氧气</el-radio>
              <el-radio :label="3">硫化氢</el-radio>
              <el-radio :label="4">一氧化碳</el-radio>
              <el-radio :label="5">液位传感器</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="标签地址码" prop="sensorAdd">
            <el-input v-model.number="addForm.sensorAdd"></el-input>
          </el-form-item>

          <el-form-item label="node节点ID" prop="nodeId">
            <el-input v-model.number="addForm.nodeId"></el-input>
          </el-form-item>

          <el-form-item label="传感器安装地址" prop="setUpAdd">
            <el-input v-model="addForm.setUpAdd"></el-input>
          </el-form-item>

          <el-form-item label="传感器安装时间" required>
            <el-col :span="11">
              <el-date-picker
                v-model="addForm.importTime"
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
</template>

<script>
import { reqSensorInfo, addSensor, deleteSensor, reviewSensor } from '@/api/sensors'
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

      // 接受的数据, 存放返回的数据
      tableData: [],

      // 表格的属性, 因为传感器类型需要翻译一下
      tableShowData: [],
      search: '',
      centerDialogVisible: false,
      
      // 导出Excel的属性
      downloadLoading: false,
      excelTitle: '',

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        sensorId: null,
        sensorNo: '',
        sensorType: null,
        sensorAdd: null,
        nodeId: null,
        setUpAdd: '',
        importTime: '',
      },
      rules: {
        sensorNo: [
          { required: true, message: '请输入传感器编号', trigger: 'blur' },  
        ],
        sensorType: [
          { required: true, message: '请选择传感器类型', trigger: 'blur' }
        ],
        sensorAdd: [
          { required: true, message: '请输入传感器地址码', trigger: 'blur' },
          { type: 'number', message: '标签地址必须为数字', trigger: 'blur'}
        ],
        nodeId: [
          { required: true, message: '请输入节点ID', trigger: 'blur' },
          { type: 'number', message: '节点ID必须为数字', trigger: 'blur'}
        ],
        setUpAdd: [
          { required: true, message: '请输入传感器安装地址', trigger: 'blur' },  
        ],
        importTime: [
          { type: 'datetime', trigger: 'blur'}
        ]
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        sensorId: null,
        sensorNo: '',
        sensorType: null,
        sensorAdd: null,
        nodeId: null,
        setUpAdd: '',
        importTime: new Date(),
      },
      addRules: {
        sensorNo: [
          { required: true, message: '请输入传感器编号', trigger: 'blur' },  
        ],
        sensorType: [
          { required: true, message: '请选择传感器类型', trigger: 'blur' }
        ],
        sensorAdd: [
          { required: true, message: '请输入传感器地址码', trigger: 'blur' },
          { type: 'number', message: '标签地址必须为数字', trigger: 'blur'}
        ],
        nodeId: [
          { required: true, message: '请输入节点ID', trigger: 'blur' },
          { type: 'number', message: '节点ID必须为数字', trigger: 'blur'}
        ],
        setUpAdd: [
          { required: true, message: '请输入传感器安装地址', trigger: 'blur' },  
        ],
        importTime: [
          { type: 'datetime', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    translate(mode, val) {
      if (mode === 'ntos') {
        if (val === 1) {
          return '甲烷'
        } else if (val === 2) {
          return '氧气'
        } else if (val === 3) {
          return '硫化氢'
        } else if (val === 4) {
          return '一氧化碳'
        } else if (val === 5) {
          return '液位传感器'
        }
      } else if (mode === 'ston') {
        if (val === '甲烷') {
          return 1
        } else if (val === '氧气') {
          return 2
        } else if (val === '硫化氢') {
          return 3
        } else if (val === '一氧化碳') {
          return 4
        } else if (val === '液位传感器') {
          return 5
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
      let respone = await reqSensorInfo(data)
      let result = respone.data

      this.count = result.count
      this.page = page
      this.tableData = result.data
      this.tableShowData = []

      this.tableData.forEach( (val) => {
        let data =  {
          sensorId: val.sensorId,
          sensorNo: val.sensorNo,
          sensorType: this.translate('ntos', val.sensorType),
          sensorAdd: val.sensorAdd,
          nodeId: val.nodeId,
          setUpAdd: val.setUpAdd,
          importTime: val.importTime,
        }
        this.tableShowData.push(data)
      })
    },
    // 处理分页请求, 同时更新数据
    handleCurrentChange(val) {
      this.getDevInfo(val)
    },
    handleEdit(index, row) {

      this.ruleForm.sensorId = row.sensorId
      this.ruleForm.sensorNo = row.sensorNo      
      this.ruleForm.sensorType = this.translate('ston', row.sensorType)
      this.ruleForm.sensorAdd = row.sensorAdd
      this.ruleForm.nodeId = row.nodeId
      this.ruleForm.setUpAdd = row.setUpAdd
      this.ruleForm.importTime = row.importTime
      
      this.dialogFormVisible = true;
    },
    handleDelete(index, row) {
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteSensor( row.sensorId, row)
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
            sensorNo: this.ruleForm.sensorNo,
            sensorType: this.ruleForm.sensorType,
            sensorAdd: this.ruleForm.sensorAdd,
            nodeId: this.ruleForm.nodeId,
            setUpAdd: this.ruleForm.setUpAdd,
            importTime: moment(this.ruleForm.importTime).format('YYYY-MM-DD HH:mm:ss'),
          }
          let response = await reviewSensor(this.ruleForm.sensorId, data)
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
            sensorNo: this.addForm.sensorNo,
            sensorType: this.addForm.sensorType,
            sensorAdd: this.addForm.sensorAdd,
            nodeId: this.addForm.nodeId,
            setUpAdd: this.addForm.setUpAdd,
            importTime: moment(this.addForm.importTime).format('YYYY-MM-DD HH:mm:ss'),
          }
          let response = await addSensor(data)
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
        const tHeader = ['传感器ID', '传感器名称', '传感器类型', '传感器地址码', 'node节点ID', '标签安装地址', '标签安装时间']
        const filterVal = ['sensorId', 'sensorNo', 'sensorType', 'sensorAdd', 'nodeId', 'setUpAddk', 'importTime']
        const data = this.formatJson(filterVal, this.tableShowData)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "第" + this.page + "页传感器信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss') })
        this.downloadLoading = false
      })
      this.centerDialogVisible = false
    },
    handleDownloadZip() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['传感器ID', '传感器名称', '传感器类型', '传感器地址码', 'node节点ID', '标签安装地址', '标签安装时间']
        const filterVal = ['sensorId', 'sensorNo', 'sensorType', 'sensorAdd', 'nodeId', 'setUpAddk', 'importTime']
        const list = this.tableShowData
        const data = this.formatJson(filterVal, list)
        const filename = "第" + this.page + "页传感器信息-导出于" + moment().format('YYYY-MM-DD HH.mm.ss')
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
</style>
