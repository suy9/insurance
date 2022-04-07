<script src="../../../../../insurance_api/services/OrderService.js"></script>
<script src="../../../../../insurance_api/dao/OrderDAO.js"></script>
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
      <el-table :data="userData.userList" border tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="保单编号" prop="order_number" width="180"></el-table-column>
        <el-table-column label="投保人" prop="user_id" width="180"></el-table-column>
        <el-table-column label="被投保人" prop="seller_id" width="180"></el-table-column>
        <el-table-column label="保单类型" prop="order_kind" width="180"></el-table-column>
        <el-table-column label="保单价格" prop="order_price" width="180"></el-table-column>
        <el-table-column label="支付状态" prop="pay_status" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_status === 0">未支付</span>
            <span v-if="scope.row.pay_status === 1">已支付</span>
          </template>
        </el-table-column>
        <el-table-column label="支付方式" prop="order_pay" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.order_pay === 1">支付宝</span>
            <span v-if="scope.row.order_pay === 2">微信</span>
            <span v-if="scope.row.order_pay === 3">银行卡</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 修改按钮 -->
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
      <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-form-item label="投保人id" prop="user_id">
          <el-input v-model="addForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="被投保人id" prop="seller_id">
          <el-input v-model="addForm.seller_id"></el-input>
        </el-form-item>
        <el-form-item label="保险种类" prop="order_kind">
          <el-input v-model="addForm.order_kind"></el-input>
        </el-form-item>
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
        <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="addForm.pay_status" placeholder="请选择"  style="width: 15%;">
            <el-option value="0" label="未支付"></el-option>
            <el-option value="1" label="已支付"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改保单信息对话框 -->
    <el-dialog title="修改保单" @close="editClosed" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form label-width="70px" ref="editFormRef" :model="editForm" :rules="editFormRules">
        <el-form-item label="投保人id" prop="user_id">
          <el-input v-model="editForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="被投保人id" prop="seller_id">
          <el-input v-model="editForm.seller_id"></el-input>
        </el-form-item>
        <el-form-item label="保险种类" prop="order_kind">
          <el-input v-model="editForm.order_kind"></el-input>
        </el-form-item>
        <el-form-item label="保险编号" prop="order_number">
          <el-input v-model="editForm.order_number"></el-input>
        </el-form-item>
        <el-form-item label="保险价格" prop="order_price">
          <el-input v-model="editForm.order_price"></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="order_pay">
          <el-select v-model="editForm.order_pay" placeholder="请选择"  style="width: 15%;">
            <el-option value="1" label="支付宝"></el-option>
            <el-option value="2" label="微信"></el-option>
            <el-option value="3" label="银行卡" @close="editClosed" :visible.sync="editDialogVisble" width="50%"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态" prop="pay_status">
          <el-select v-model="editForm.pay_status" placeholder="请选择"  style="width: 15%;">
            <el-option value="0" label="未支付"></el-option>
            <el-option value="1" label="已支付"></el-option>
          </el-select>" prop="order_pay">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editOrderInfo">确 定</el-button>
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
        user_id: '',
        seller_id: '',
        order_kind: '',
        order_number: '',
        order_price: '',
        order_pay: '',
        pay_status: ''
      },
      editDialogVisble: false,
      editForm: {
        user_id: '',
        seller_id: '',
        order_kind: '',
        order_number: '',
        order_price: '',
        order_pay: '',
        pay_status: ''
      }
    }
  },
  comments: {
    Breadcrumb
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
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
    // 展示修改对话框
    showBox() {
      this.addressDialogVisible = true
    },
    // 点击按钮,添加保单
    addOrder() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (valid) return
        // 可以发起添加保单请求
        const { data: res } = await this.$http.post('orders', this.addForm)
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
      debugger
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
        const { data: res } = await this.$http.put('orders/' + this.editForm.id, this.editForm)
        debugger
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
