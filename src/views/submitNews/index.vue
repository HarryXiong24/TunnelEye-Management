<template>
  <div class="submitNews">

    <div class="title">请输入新消息的内容:</div>

    <el-form ref="form" :model="form" label-width="80px">

      <el-form-item label="消息标题">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
   
      <el-form-item label="发布时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item label="严重等级">
        <el-radio-group v-model="form.resource">
          <el-radio label="一般"></el-radio>
          <el-radio label="警告"></el-radio>
          <el-radio label="严重"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息正文">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>

<style lang="scss">
  .submitNews {
    margin: 20px 20px;
    .title {
      margin: 20px 0;
      font-size: 20px;
      color: #5f6464;
      font-weight: bold;
    }
  }
</style>