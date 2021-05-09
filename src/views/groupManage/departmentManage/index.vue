<template>
  <div class="department">

    <div class="nav">
      
      <div class="item">
        <el-button plain type="primary" @click="addNew" icon="el-icon-plus">新增部门信息</el-button>
      </div>

      <div class="item">
        <el-button plain type="primary" @click="refresh" icon="el-icon-refresh-right">刷新信息</el-button>
      </div>

    </div>

    <div class="title">部门层级信息</div>
  <el-card shadow="hover">
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}(ID:{{ data.depId }})</span>
        <span>
          <el-button
            type="text"
            size="medium"
            @click="() => showData(data)">
            查看详情
          </el-button>
          <el-button
            type="text"
            size="medium"
            @click="() => handleEdit(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="medium"
            @click="() => handleDelete(data)">
            删除
          </el-button>
        </span>
      </div>
    </el-tree>
  </el-card>

    <el-dialog
      title="部门详情"
      :visible.sync="visible"
      width="50%"
      class="dialog"
      center>
        <span :style="{'color':theme, 'font-size': '16px'}">信息内容: </span>
        <el-card class="box-card" shadow="never">
          <div class="text item">
            <span :style="{'color':theme}">部门号:</span>
            <span>{{nowData.depId}}</span>
          </div>
          <div class="text item">
            <span :style="{'color':theme}">部门名称:</span>
            <span>{{nowData.depName}}</span>
          </div>
          <div class="text item">
            <span :style="{'color':theme}">部门编号:</span>
            <span>{{nowData.depNo}}</span>
          </div>
          <div class="text item">
            <span :style="{'color':theme}">部门级别标识码:</span>
            <span>{{nowData.depSortNumber}}</span>
          </div>
          <div class="text item">
            <span :style="{'color':theme}">直属上机部门标识码:</span>
            <span>{{nowData.parentDepId}}</span>
          </div>
          <div class="text item">
            <span :style="{'color':theme}">备注:</span>
            <span>{{nowData.remark}}</span>
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">关闭</el-button>
      </span>
    </el-dialog>

    <div class="workEditor">

      <el-dialog title="信息修改" :visible.sync="dialogFormVisible" center>

        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="部门ID" prop="depId">
            <el-input v-model.number="ruleForm.depId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="部门名称" prop="depName">
            <el-input v-model="ruleForm.depName"></el-input>
          </el-form-item>

          <el-form-item label="部门编号" prop="depNo">
            <el-input v-model="ruleForm.depNo"></el-input>
          </el-form-item>

          <el-form-item label="所属上级部门ID(该项为父级部门的部门ID)" prop="parentDepId">
            <el-input v-model.number="ruleForm.parentDepId"></el-input>
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

      <el-dialog title="新增部门信息" :visible.sync="addFormVisible" center>

        <el-form label-position="top" :model="addForm" :rules="addRules" ref="addForm" label-width="100px" class="demo-ruleForm">
          
          <el-form-item label="部门ID" prop="depId">
            <el-input v-model.number="addForm.depId" :disabled="true" placeholder="系统指定, 禁止修改"></el-input>
          </el-form-item> 

          <el-form-item label="部门名称" prop="depName">
            <el-input v-model="addForm.depName"></el-input>
          </el-form-item>

          <el-form-item label="部门编号" prop="depNo">
            <el-input v-model="addForm.depNo"></el-input>
          </el-form-item>

          <el-form-item label="所属上级部门ID(该项为父级部门的部门ID)" prop="parentDepId">
            <el-input v-model.number="addForm.parentDepId"></el-input>
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

  </div>
</template>

<script>
import { reqDepartment, addDepartment, reviewDepartment, deleteDepartment } from '@/api/department'

export default {
  data() {
    let data = []
    return {
      data: JSON.parse(JSON.stringify(data)),
      defaultProps: {
        children: 'departments',
        label: 'depName'
      },

      // 当前点击的数据
      nowData: {},

      visible: false,

      // 编辑表单
      dialogFormVisible: false,
      ruleForm: {
        depId: null,
        depName: '',
        depNo: '',
        depSortNumber: null,
        parentDepId: null,
        remark: '',
      },
      rules: {
        depName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },  
        ],
        depNo: [
          { required: true, message: '请输入部门编号', trigger: 'blur' },  
        ],
        depSortNumber: [
          { required: true, message: '请输入部门级别标识码', trigger: 'blur' },
          { type: 'number', message: '部门级别标识码必须为数字', trigger: 'blur'}
        ],
        parentDepId: [
          { required: true, message: '所属上级部门ID', trigger: 'blur' },
          { type: 'number', message: '所属上级部门ID必须为数字', trigger: 'blur'}
        ],
      },

      // 新增信息的属性
      addFormVisible: false,
      addForm: {
        depId: null,
        depName: '',
        depNo: '',
        depSortNumber: null,
        parentDepId: null,
        remark: '',
      },
      addRules: {
        depName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },  
        ],
        depNo: [
          { required: true, message: '请输入部门编号', trigger: 'blur' },  
        ],
        depSortNumber: [
          { required: true, message: '请输入部门级别标识码', trigger: 'blur' },
          { type: 'number', message: '部门级别标识码必须为数字', trigger: 'blur'}
        ],
        parentDepId: [
          { required: true, message: '所属上级部门ID', trigger: 'blur' },
          { type: 'number', message: '所属上级部门ID必须为数字', trigger: 'blur'}
        ],
      }
    };
  },
  methods: {
    async getInfo() {
      let response = await reqDepartment()
      let result = response.data
      
      // this.data = this.deepClone(result)
      this.data = result
      // 当前点击值置空
      this.nowData = {}
    },
    handleNodeClick(data) {
      this.nowData = data
    },
    showData(data) {
      this.nowData = data
      this.visible = true
    },
    handleEdit(data) {
      this.nowData = data

      this.ruleForm.depId = this.nowData.depId
      this.ruleForm.depName = this.nowData.depName  
      this.ruleForm.depNo = this.nowData.depNo    
      this.ruleForm.depSortNumber = this.nowData.depSortNumber
      this.ruleForm.parentDepId = this.nowData.parentDepId
      this.ruleForm.remark = this.nowData.remark
      
      this.dialogFormVisible = true;
    },
    handleDelete(data) {
      this.nowData = data
      this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let response = await deleteDepartment(data.depId)
        let msg = response.data.msg
       
        this.$message({
          type: 'success',
          message: msg
        });
        // 每次修改完之后需要刷新一次，确保数据最新
        this.getInfo()
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
            depName: this.ruleForm.depName,
            depNo: this.ruleForm.depNo,
            parentDepId: this.ruleForm.parentDepId,
            remark: this.ruleForm.remark,
          }
          let response = await reviewDepartment(this.nowData.depId, data)
          let msg = response.data.msg
          this.$message({
            type: 'success',
            message: msg
          });
          this.dialogFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.getInfo()
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
            depName: this.addForm.depName,
            depNo: this.addForm.depNo,
            parentDepId: this.addForm.parentDepId,
            remark: this.addForm.remark,
          }
          let response = await addDepartment(data)
          let msg = response.data.msg
          this.$message({
            type: 'success',
            message: msg
          });
          this.addFormVisible = false
          // 每次修改完之后需要刷新一次，确保数据最新
          this.getInfo()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetAddForm(formName) {
      this.$refs[formName].resetFields();
    },
    async refresh() {
      await this.getInfo()
    },
    // 其实不用写，组件库允许修改变量名，不用自己写深拷贝函数
    // deepClone(arr) {
    //   let arrClone = []
    //   arr.forEach(obj => {
    //     let objClone = {}
    //     // 进行深拷贝的obj不能为空，并且是对象或者数组
    //     if (obj && typeof obj === "object") {
    //       // 遍历obj里所有的子元素
    //       for (let key in obj) {
    //         // 判断obj里面的子元素是否为对象，如果是，递归复制
    //         if (obj.hasOwnProperty(key)) {
    //           // 进行深拷贝的obj不能为空，并且是对象
    //           if (obj[key] && typeof obj[key] === "object") {
    //             // 对该元素里面的子元素进行深拷贝
    //             objClone.children = this.deepClone(obj[key]);
    //           } else {
    //             if (key === 'depName') {
    //               objClone.label = obj.depName
    //             } else {
    //               objClone[key] = obj[key];
    //             }
    //           }
    //         }
    //       }

    //       arrClone.push(objClone)
    //     }
    //   });

    //   // 返回深拷贝后的结果
    //   return arrClone;
    // }
  },
  async mounted () {
    await this.getInfo()
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
}
</script>

<style lang="scss">
.department {
  width: 90%;
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
  .font {
    font-size: 18px;
    color: #5f6464;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
    color: #5f6464;
    margin: 20px 5px;
  }
  .dialog {
    .box-card {
      margin: 20px 0;
      .text {
        font-size: 14px;
        color: #5f6464; 
      }
      .item {
        padding: 2px 0;
      }
    }
  }
}
</style>