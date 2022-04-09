export const userAddFormRulesMixin = {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/ // 验证邮箱的正则表达式
      if (regEmail.test(value)) {
        return callback() // 合法邮箱
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机的规则
    var checkMobeli = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    // 验证身份证号
    var checkNum = (rule, value, callback) => {
      const regNum = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (regNum.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的身份证号'))
    }
    return {
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ]
      },
      // 添加投保人数据验证
      UseraddFormRules: {
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        user_email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ],
        user_num: [
          { required: true, message: '请输入用户身份证号', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ]
      },
      // 添加被投保人数据验证规则
      SelleraddFormRules: {
        seller_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        // seller_sex: [
        //   { required: true, message: '请输入性别', trigger: 'blur' },
        //   { min: 3, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        // ],
        seller_email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        seller_phone: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ],
        seller_num: [
          { required: true, message: '请输入用户身份证号', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ]
      },
      // 添加保单数据验证规则
      OrderaddFormRules: {
        order_number: [
          { required: true, message: '请输入订单号', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        user_num: [
          { required: true, message: '请输入投保人身份证号码', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        seller_num: [
          { required: true, message: '请输入被投保人身份证号码', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        order_kind: [
          { required: true, message: '请输入保险类型', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 修改用户数据验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobeli, trigger: 'blur' }
        ]
      }
    }
  }
}
export const rolesFormRulesMixin = {
  data() {
    return {
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '输入的范围是 3 ~ 10 为字符',
            triggetr: 'nlur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '输入的范围是 5 ~ 20 为字符',
            triggetr: 'nlur'
          }
        ]
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名字', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '输入的范围是 3 ~ 10 为字符',
            triggetr: 'nlur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '输入的范围是 5 ~ 20 为字符',
            triggetr: 'nlur'
          }
        ]
      }
    }
  }
}
export const paramsFormRulesMixin = {
  data() {
    return {
      // 添加表单的验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入添加的分类', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 修改表单的验证
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入修改的信息', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  }
}
export const goodsAddFormRulesMixin = {
  data() {
    return {
      // 添加商品验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品的名称', trigger: 'blur' },
          {
            min: 2,
            max: 30,
            message: '请输入 2 ~ 30 范围的字符',
            trigger: 'blur'
          }
        ],
        goods_price: [{ required: true, message: '请输入商品的价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品的重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品的数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      }
    }
  }
}
