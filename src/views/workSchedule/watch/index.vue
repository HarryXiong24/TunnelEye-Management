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

    </div>

    <div class="table">

      <el-table
        :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
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

  </div>
</template>

<script>
import { reqPersonInfo } from '@/api/reqPersonInfo'
import moment from 'moment';
import { reqWorkEditor } from '@/api/workEditor'

export default {
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
      console.log(index, row);
    },
    submitForm(formName) {
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          // 未写完
          console.log(JSON.stringify(this.ruleForm))
          // let response = await reqWorkEditor(this.ruleForm)
          
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
      justify-content: flex-start;
      align-items: center;
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