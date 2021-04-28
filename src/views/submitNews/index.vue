<template>
  <div class="submitNews">

    <div class="title">请输入新消息的内容:</div>

    <el-form label-position="right" :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
      
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="发布者" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
   
      <el-form-item label="发布时间" prop="date">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="严重等级" prop="rank">
        <el-radio-group v-model="form.rank">
          <el-radio label="一般"></el-radio>
          <el-radio label="警告"></el-radio>
          <el-radio label="严重"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="消息正文" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="plus">
        <el-input v-model="form.plus"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>

    </el-form>
<!-- 
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">

      <el-form-item label="消息标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item label="发布者">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
   
      <el-form-item label="发布时间">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-col>

      </el-form-item>

      <el-form-item label="严重等级">
        <el-radio-group v-model="form.rank">
          <el-radio label="一般"></el-radio>
          <el-radio label="警告"></el-radio>
          <el-radio label="严重"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="消息正文">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.plus"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="clear">清空</el-button>
      </el-form-item>

    </el-form> -->
  </div>
</template>

<script>
  import { submitNews } from '@/api/submitNews'

  export default {
    data() {
      return {
        form: {
          title: '',
          name: '',
          date: '',
          rank: '',
          content: '',
          plus: '',
        },
        rules: {
          title: [
            { required: true, message: '请填写消息标题', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入发布人姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          date: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
          ],
          rank: [
            { required: true, message: '请选择预警级别', trigger: 'change' }
          ],
          content: [
            { required: true, message: '请填写消息正文', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            // 未写完
            console.log(JSON.stringify(this.form))
            // let respone = await submitNews(this.form) 
            this.$alert('新消息发布成功!', '提示', {
              confirmButtonText: '确定',
              callback: (action) => {
                this.$refs[formName].resetFields();
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
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