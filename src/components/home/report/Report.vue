<template>
  <div class="report">
    <Breadcrumb name1="数据统计" name2="数据报表"/>
    <!--  卡片-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="getoneday">查询一天之内的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getoneweek">查询一周之内的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getoneyear">查询一年之内的信息</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table class="lines" :data="reportData.reportList" border tooltip-effect="dark" style="width: 100%">
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
      </el-table>
    </el-card>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  name: 'Report',
  data() {
    moment().format('YYYY-MM-DD')
    return {
      // 日期选择器
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 日期选择器
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      reportData: {
        reportList: [],
        total: 0
      },
      queryInfo: {
        startDate: moment().subtract(3, 'years').format('YYYY-MM-DD'),
        endDate: moment().subtract(-1, 'years').format('YYYY-MM-DD'),
        // 当前的页数
        pagenum: 1,
        // 当前每次显示多少条数据
        pagesize: 5
      }

    }
  },
  methods: {
    async getoneday() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      console.log(res.data)
      debugger
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getoneweek() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          startDate: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      console.log(res.data)
      debugger
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getoneyear() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          startDate: moment().subtract(1, 'years').format('YYYY-MM-DD'),
          endDate: moment().format('YYYY-MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      console.log(res.data)
      debugger
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    }

  }
}
</script>

<style scoped></style>
