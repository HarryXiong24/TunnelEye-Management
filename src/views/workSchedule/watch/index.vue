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
      value: '',
      date: new Date('2020-06-01'),

      tableData: [],
      search: '',

      groupId: -1
    }
  },
  methods: {
    async getPersonInfo() {
      let date = {date: moment(this.date).format('YYYY-MM-DD')}
      let response = await reqPersonInfo(date)
      let data = response.data
      this.options = []
      this.value = ''

      this.tableData = []
      this.groupId = -1
     
      data.forEach( (value) => {
        let params = { value: value.groupName }
        this.options.push(params)
        this.tableData.push(value.users)
      })
      this.value = this.options[0].value
      console.log(this.value)
    },
    groupShow(value) {
      for (let i = 0; i < this.options.length; i++) {
        if (value === this.options[i]) {
          this.groupId = i;
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
    this.getPersonInfo()
    this.value = this.options[0].value
    this.groupShow(this.value)
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