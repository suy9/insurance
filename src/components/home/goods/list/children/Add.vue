<template>
  <div class="add">
    <Breadcrumb name1="保险管理" name2="添加保险" />
    <!--    卡片视图-->
    <el-card>
      <!--      提示区-->
      <el-alert title="添加保险信息" type="info" center :closable="false" show-icon> </el-alert>
      <!--      步骤条区-->
      <el-steps align-center :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="保险属性"></el-step>
        <el-step title="保险内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--      table --- > tab栏区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLevae" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="保险名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="保险价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="保险数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="保险分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="{ expandTrigger: 'hover', ...cateProps }" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="保险属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="保险内容" name="4">
            <!-- 富文本编辑器组件 Two-way Data-Binding -->
            <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" />
            <!--            添加按钮-->
            <el-button type="primary" class="AddBtn" @click="addShop">添加保险</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { goodsAddFormRulesMixin } from '@/common/mixin.js'
import Breadcrumb from 'components/content/breadcrumb/Breadcrumb'
export default {
  name: 'Add',
  components: {
    Breadcrumb
  },
  mixins: [goodsAddFormRulesMixin],
  data() {
    return {
      activeIndex: '0',
      // 添加保险的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        // 保险的详情描述
        goods_introduce: '',
        attrs: []
      },
      // 存放保险列表数据
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 图片预览的对话框
      previewDialogVisible: false
    }
  },
  created() {
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
    async tabClicked() {
      // 证明访问的是动态列表
      if (this.activeIndex === '1') {
        console.log('动态参数')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态列表失败!')
        }
        res.data.forEach(item => (item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')))
        // console.log(res)
        this.manyTableData = res.data
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态列表失败!')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    addShop() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form)
        // 发起请求添加保险数据
        // 保险的名称必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加保险失败!')
        }
        this.$message.success('添加保险成功!')
        this.$router.push('/goods')
        // 不能直接做转换因为在 级联选择器 中双向绑定了 goods_cat 作为key
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.AddBtn {
  margin-top: 15px;
}
</style>
