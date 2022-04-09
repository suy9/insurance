<template>
  <div class="list">
    <Breadcrumb name1="险种管理" name2="险种列表" />
    <el-card>
      <!-- 按钮搜索/添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" @clear="getGoofsList" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoofsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加险种</el-button>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-row>
        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="名称"></el-table-column>
          <el-table-column prop="goods_price" label="价格(元)" width="110px"></el-table-column>
          <el-table-column prop="goods_introduce" label="介绍"></el-table-column>
          <el-table-column width="200px" label="创建时间">
            <template v-slot="scope">
              {{ scope.row.add_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column width="200px" label="修改时间">
            <template v-slot="scope">
              {{ scope.row.upd_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
<!--    修改保险信息对话框-->
    <el-dialog title="修改保险信息" @close="aditClosed" :visible.sync="editDialogVisble" width="50%">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="editForm.goods_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="email">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="mobile">
          <el-input v-model="editForm.goods_introduce"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userAddFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: 'List',
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 保险列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 修改商品信息对话框显示和隐藏
      editDialogVisble: false,
      // 查询用户的对象
      editForm: {
        goods_id: '',
        goods_price: '',
        goods_introduce: ''
      }
    }
  },
  created() {
    this.getGoofsList()
  },
  methods: {
    // 根据分页获取列表数据
    async getGoofsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取保险列表失败!')
      }
      this.$message.success('获取保险列表成功!')
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 显示的页数改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoofsList()
    },
    // 页码的改变
    handleCurrentChange(newValue) {
      this.queryInfo.pagenum = newValue
      this.getGoofsList()
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户数据失败~')
      }
      this.editForm = res.data
      this.editDialogVisble = true
      return this.$message.success('查询用户数据成功~')
    },
    // 监听修改险种信息对话框的关闭事件
    aditClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑
    editGoodsInfo() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 发起修改保险信息的数据请求
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, {
          goods_price: this.editForm.goods_price,
          goods_introduce: this.editForm.goods_introduce
        })
        debugger
        if (res.meta.status !== 200) {
          this.$message.error('更新保险信息失败!')
        }
        this.editDialogVisble = false
        this.getGoofsList()
        this.$message.success('更新保险信息成功!')
      })
    },
    // 删除
    async removeById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除操作已取消!')
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message.success('删除成功!')
      this.getGoofsList()
    },
    goAddpage() {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0 0;
}
</style>
