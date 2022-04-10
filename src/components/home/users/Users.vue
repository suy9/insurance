<template>
  <div class="users">
    <Breadcrumb name1="用户管理" name2="投保人列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户区域 -->
          <el-button type="primary" @click="addDialogVisible = true">添加投保人</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userData.userList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="user_name" sortable :sort-orders="['ascending','descending']" label="投保人姓名"></el-table-column>
        <el-table-column prop="user_sex" sortable :sort-orders="['ascending','descending']" label="性别"></el-table-column>
        <el-table-column prop="user_num" sortable :sort-orders="['ascending','descending']" label="身份证号" width="180px"></el-table-column>
        <el-table-column prop="user_email" sortable :sort-orders="['ascending','descending']" label="邮箱"></el-table-column>
        <el-table-column prop="user_phone" sortable :sort-orders="['ascending','descending']" label="电话"></el-table-column>
        <el-table-column prop="user_birthday" sortable :sort-orders="['ascending','descending']" label="生日"></el-table-column>
        <el-table-column prop="user_address" sortable :sort-orders="['ascending','descending']"  label="地址"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        @size-change="handleSizeChange"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userData.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加投保人" :visible.sync="addDialogVisible" width="50%" @close="addDislogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="100px" ref="addFormRef" :model="addForm" :rules="UseraddFormRules">
        <el-form-item label="投保人姓名" prop="user_name">
          <el-input v-model="addForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-select v-model="addForm.user_sex" placeholder="请选择"  style="width: 15%;">
            <el-option value="男" label="男"></el-option>
            <el-option value="女" label="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="user_num">
          <el-input v-model="addForm.user_num" @blur="getMES(addForm.user_num)"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="addForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="user_phone">
          <el-input v-model="addForm.user_phone"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="user_birthday">
          <el-input v-model="addForm.user_birthday"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="user_address">
          <el-input v-model="addForm.user_address"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户" @close="aditClosed" :visible.sync="editDialogVisble" width="50%">
      <el-form :model="editForm" :rules="UseraddFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="投保人姓名" prop="user_name">
          <el-input v-model="editForm.user_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-select v-model="editForm.user_sex" disabled placeholder="请选择"  style="width: 15%;">
            <el-option value="男" label="男" ></el-option>
            <el-option value="女" label="女" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="user_num">
          <el-input v-model="editForm.user_num" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="editForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="user_phone">
          <el-input v-model="editForm.user_phone"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="user_birthday">
          <el-input v-model="editForm.user_birthday" disabled></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="user_address">
          <el-input v-model="editForm.user_address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAddFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: 'Users',
  mixins: [userAddFormRulesMixin],
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索值
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 5
      },
      // 存放用户的数据和数量
      userData: {
        userList: [],
        total: 0
      },
      // 控制用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户数据的对象
      addForm: {
        user_name: '',
        user_sex: '',
        user_num: '',
        user_email: '',
        user_phone: '',
        user_birthday: '',
        user_address: ''
      },
      // 修改用户消息对话框显示和隐藏
      editDialogVisble: false,
      // 控制分配角色对话框的显示和隐藏
      setRolesDialogVisible: false,
      // 保存已经选中的角色id值
      selectRoleId: '',
      // 查询用户的对象
      editForm: {}
    }
  },
  components: {
    Breadcrumb
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('user', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取投保人列表失败!')
      }
      this.$message.success('获取投保人列表成功!')
      this.userData.userList = res.data.users
      this.userData.total = res.data.total
    },
    // 监听 pagesize 改变事件 每页显示的个数
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件 当前页面值
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听添加用户的对话框关闭事件
    addDislogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 可以发起添加用户请求
        const { data: res } = await this.$http.post('user', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败了~')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getUserList()
        return this.$message.success('用户添加成功了~')
      })
    },
    // 根据身份证号码获取性别生日
    getMES(num) {
      let sex = null
      let birth = null
      sex = num.substring(16, 17)
      birth = num.substring(6, 10) + '-' + num.substring(10, 12) + '-' + num.substring(12, 14)
      if (sex % 2 === 0) {
        this.addForm.user_sex = '男'
      }
      this.addForm.user_sex = '女'
      this.addForm.user_birthday = birth
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('user/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户数据失败~')
      }
      this.editForm = res.data
      console.log(res)
      this.editDialogVisble = true
      return this.$message.success('查询用户数据成功~')
    },
    // 监听修改用户对话框的关闭事件
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，编辑用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('user/' + this.editForm.id, {
          user_email: this.editForm.user_email,
          user_phone: this.editForm.user_phone,
          user_address: this.editForm.user_address
        })
        debugger
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败!')
        }
        this.editDialogVisble = false
        await this.getUserList()
        this.$message.success('更新用户信息成功!')
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById(id) {
      // 询问用户是否删除用户
      const confirmRusult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '永久删除该用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRusult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmRusult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      this.$http.delete('user/' + id).then(res => {
        const { data: response } = res
        console.log(response)
        if (response.meta.status !== 200) {
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getUserList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
