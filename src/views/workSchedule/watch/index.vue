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
              @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
import { reqPersonInfo } from '@/api/reqPersonInfo'
import moment from 'moment';

export default {
  data() {
    return {
      options: [],
      value: -1, // 选项的值
      label: '', // 选项的内容
      date: new Date('2020-06-01'),

      tableData: [],
      search: '',
      lists: [],

      resData: [],

    }
  },
  methods: {
    async getPersonInfo() {
      let date = {date: moment(this.date).format('YYYY-MM-DD')}
      let response = await reqPersonInfo(date)
      let data = response.data
      this.resData = data
      this.options = []
      this.value = -1
      this.label = ''
     
      data.forEach( (value) => {
        let params = { 
          value: value.groupId,
          label: value.groupName 
        }
        this.options.push(params)
      })
      console.log(this.options)
    },
    async init() {
      // 异步的方法，一定要await
      await this.getPersonInfo()
      console.log(this.options)
      console.log(this.options[0].value)
      this.value = this.options[0].value
      this.groupShow(this.value)  
    },
    groupShow(value) {
      console.log(value)
      for (let i = 0; i < this.resData.length; i++) {
        if (value === this.resData[i].groupId) {
          this.tableData = this.resData[i].users
        }
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    // async update() {
    //   await this.submit()
    //   this.normal.value = this.options[0]
    //   this.groupShow(this.normal.value)
    // }
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