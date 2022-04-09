<template>
  <div class="renewal">
    <Breadcrumb name1="保单管理" name2="续期拜访" />
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <!--搜索搜索与添加区域-->
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getRenewalList">
            <el-button slot="append" icon="el-icon-search" @click="getRenewalList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--      用户列表-->
      <el-table class="lines" :data="userData.userList" border tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column sortable :sort-orders="['ascending','descending']" label="保单编号" prop="order_number" width="180"></el-table-column>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateUserById(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRenewalById(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
import { userAddFormRulesMixin } from '../../../common/mixin.js'
import cityData from './citydata'
import Breadcrumb from '../../../components/content/breadcrumb/Breadcrumb'
export default {
  name: 'Renewals',
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
      }
    }
  },
  comments: {
    Breadcrumb
  },
  created() {
    this.getRenewalList()
  },
  methods: {
    // 获取订单列表数据
    async getRenewalList() {
      const { data: res } = await this.$http.get('renewal', {
        params: this.queryInfo
      })
      console.log(res.data)
      debugger
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败!')
      }
      this.$message.success('获取订单列表成功!')
      this.userData.userList = res.data.orders
      this.userData.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getRenewalList()
    },
    handleCurrentChange(newCurrent) {
      console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getRenewalList()
    },
    // 根据id删除对应的保单信息
    async removeRenewalById(id) {
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
      this.$http.delete('renewal/' + id).then(res => {
        const { data: response } = res
        console.log(response)
        if (response.meta.status !== 200) {
          return this.$message.error('该保单删除失败')
        }
        this.$message.success('该保单已经删除')
        this.getRenewalList()
      })
    },
    // 是否续期
    async updateUserById(id) {
      // 询问用户是否删除用户
      const confirmRusult = await this.$confirm('是否续期保单（续期时长为一年）?', '续期保单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRusult)
      if (confirmRusult !== 'confirm') {
        return this.$message.info('取消续期')
      }
      this.$http.put('renewal/' + id).then(res => {
        const { data: response } = res
        console.log(response)
        debugger
        if (response.meta.status !== 200) {
          return this.$message.error('续期失败')
        }
        this.$message.success('续期成功')
        this.getRenewalList()
      })
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
