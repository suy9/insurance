<template>
  <div class="order">
    <Breadcrumb name1="保单管理" name2="保单列表" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!--搜索搜索与添加区域-->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加保单区域 -->
          <el-button type="primary" @click="addDialogVisible= true">添加保单</el-button>
        </el-col>
      </el-row>
      <!--      用户列表-->
      <el-table class="lines" :data="userData.userList" border tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="保单编号" prop="order_number" width="180"></el-table-column>
        <el-table-column label="投保人信息" align="center">
          <el-table-column sortable :sort-orders="['ascending','descending']" label="姓名" prop="user_name" width="80"></el-table-column>
          <el-table-column sortable :sort-orders="['ascending','descending']" label="身份证" prop="user_num" width="180"></el-table-column>
          <el-table-column sortable :sort-orders="['ascending','descending']" label="生日" prop="user_birthday" width="150"></el-table-column>
          <el-table-column sortable :sort-orders="['ascending','descending']" label="电话" prop="user_phone" width="150"></el-table-column>
          <el-table-column sortable :sort-orders="['ascending','descending']" label="地址" prop="user_address" width="200"></el-table-column>
        </el-table-column>
        <el-table-column label="被投保人信息" align="center">
        <el-table-column sortable :sort-orders="['ascending','descending']" label="姓名" prop="seller_name" width="80"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="身份证" prop="seller_num" width="180"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="生日" prop="seller_birthday" width="150"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="电话" prop="seller_phone" width="150"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="地址" prop="seller_address" width="200"></el-table-column>
        </el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="下次缴费时间" prop="next_pay_time" width="120"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="保单类型" prop="order_kind" width="100"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="保单价格" prop="order_price" width="100"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="订单状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status == 0">正常</span>
            <span v-else>已过期</span>
          </template>
        </el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="支付方式" prop="order_pay" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.order_pay == 1">支付宝</span>
            <span v-else-if="scope.row.order_pay == 2">微信</span>
            <span v-else>银行卡</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrderById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区-->
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
    <!-- 添加保单对话框 -->
    <el-dialog title="添加保单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form label-width="140px" ref="addFormRef" :model="addForm" :rules="OrderaddFormRules">
        <el-form-item label="投保人身份证号" prop="user_num" >
          <el-input v-model="addForm.user_num"></el-input>
        </el-form-item>
        <el-form-item label="被投保人身份证号" prop="seller_num">
          <el-input v-model="addForm.seller_num"></el-input>
        </el-form-item>
        <el-select v-model="selectId" placeholder="选择险种">
          <el-option v-for="item in List" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
        </el-select>
<!--         级联选择器 -->
<!--        <el-form-item label="保险种类" prop="goods_cat">-->
<!--          <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover', ...cateProps }" @change="handleChange"></el-cascader>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="保险种类" prop="order_kind">-->
<!--          <el-input v-model="addForm.order_kind"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="保险编号" prop="order_number">
          <el-input v-model="addForm.order_number"></el-input>
        </el-form-item>
        <el-form-item label="保险价格" prop="order_price">
          <el-input v-model="addForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="order_pay">
          <el-select v-model="addForm.order_pay" placeholder="请选择"  style="width: 15%;">
            <el-option value="1" label="支付宝"></el-option>
            <el-option value="2" label="微信"></el-option>
            <el-option value="3" label="银行卡"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop="pay_status">
          <el-select v-model="addForm.pay_status" placeholder="请选择"  style="width: 15%;">
            <el-option value="0" label=正常></el-option>
            <el-option value="1" label="已过期"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAddFormRulesMixin } from '../../../common/mixin.js'
import cityData from './citydata'
import Breadcrumb from '../../../components/content/breadcrumb/Breadcrumb'
export default {
  name: 'Orders',
  mixins: [userAddFormRulesMixin],
  components: {
    Breadcrumb
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 订单列表的数据
      userData: {
        userList: [],
        total: 0
      },
      addDialogVisible: false,
      addForm: {
        user_num: '',
        seller_num: '',
        order_kind: '',
        order_number: '',
        order_price: '',
        order_pay: '',
        pay_status: '',
        goods_cat: ''
      },
      // 分配险种列表
      List: [],
      // 保存已经选中的险种id值
      selectId: '',
      editDialogVisble: false
    }
  },
  comments: {
    Breadcrumb
  },
  created() {
    this.getOrderList()
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取保险列表失败!')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择项变化触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    // 离开当前 Tabs 页
    beforeTabLevae(activeName, oldActiveName) {
      // console.log('即将离开标签页的名字: ', oldActiveName)
      // console.log('即将进入标签页的名字: ', activeName)
      if ((oldActiveName === '0' && this.addForm.goods_cat.length !== 3) || this.addForm.goods_name === '') {
        this.$message.error('请先选择保险分类! 或 填写保险名称')
        return false
      }
    },
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.$message.success('获取订单列表成功!')
      this.userData.userList = res.data.orders
      this.userData.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newCurrent) {
      console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getOrderList()
    },
    // 监听添加保单的对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加保单
    addOrder() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加保单请求
        const { data: res } = await this.$http.post('orders', this.addForm)
        console.log(res)
        debugger
        if (res.meta.status !== 201) {
          return this.$message.error('添加保单失败!')
        }
        // 隐藏添加保单对话框
        this.addDialogVisible = false
        // 添加成后重新获取用户数据,不需要用户手动刷新页面
        await this.getOrderList()
        this.$message.success('添加订单成功!')
      })
    },
    // 展示编辑用于的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('orders/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询保单失败!')
      }
      this.editForm = res.data
      this.editDialogVisble = true
      return this.$message.success('查询保单成功!')
    },
    // 监听修改保单对话框的关闭
    editClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editOrderInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (valid) return
        // 发起修改保单请求的操作
        const { data: res } = await this.$http.put('orders/' + this.editForm.order_id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改保单失败!')
        }
        this.editDialogVisble = false
        await this.getOrderList()
        this.$message.success('修改保单成功!')
      })
    },
    // 根据id删除对应的保单信息
    async removeOrderById(id) {
      // 询问用户是否删除用户
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '永久删除该保单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      // 用户点击了删除,则返回字符串 confirm
      // 用户取消了删除,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      this.$http.delete('orders/' + id).then(res => {
        const { data: response } = res
        console.log(response)
        if (response.meta.status !== 200) {
          return this.$message.error('该保单删除失败')
        }
        this.$message.success('该保单已经删除')
        this.getOrderList()
      })
    },
    // 展示分配险种的对话框
    async setRoles(userInfo) {
      this.userInfo = userInfo
      // 再展示对话框之前获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    // 点击按钮,分配险种
    async saveRolesInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色!')
      }
      const { data: res } = await this.$http.put(`manager/${this.userInfo.id}/role`, {
        rid: this.selectRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败!')
      }
      this.$message.success('更新角色成功!')
      this.getUserList()
      this.setRolesDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  align: center;
}
</style>
