<template>
  <div class="report">
    <Breadcrumb name1="数据统计" name2="数据报表"/>
    <!--  卡片-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="getusertodaybir">查询今天生日的的投保人信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getusertombir">查询明天生日的投保人的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getusermonthbir">查询本月生日的投保人的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getusernexmonthbir">查询下月生日的投保人的信息</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="getsellertodaybir">查询今天生日的的被投保人信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getsellertombir">查询明天生日的被投保人的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getsellermonthbir">查询本月生日的被投保人的信息</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getsellernexmonthbir">查询下月生日的被投保人的信息</el-button>
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
    async getusertodaybir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().subtract(1, 'days').format('MM-DD'),
          endDate: moment().format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getusertombir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().format('MM-DD'),
          endDate: moment().subtract(-1, 'days').format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getusermonthbir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().subtract(1, 'months').format('MM-DD'),
          endDate: moment().format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getusernexmonthbir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().format('MM-DD'),
          endDate: moment().subtract(-3, 'months').format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getsellertodaybir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().subtract(1, 'days').format('MM-DD'),
          endDate: moment().format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getsellertombir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().format('MM-DD'),
          endDate: moment().subtract(-1, 'days').format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getsellermonthbir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().subtract(1, 'months').format('MM-DD'),
          endDate: moment().format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    },
    async getsellernexmonthbir() {
      const { data: res } = await this.$http.get('reports', {
        params: {
          query: 'user_birthday',
          startDate: moment().format('MM-DD'),
          endDate: moment().subtract(-3, 'months').format('MM-DD'),
          pagenum: 1,
          pagesize: 5
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取信息列表失败!')
      this.$message.success('获取信息列表成功!')
      this.reportData.reportList = res.data.reports
      this.reportData.total = res.data.total
    }
  }
}
</script>

<style scoped></style>
