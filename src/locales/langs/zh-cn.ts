const local: App.I18n.Schema = {
  system: {
    title: '汽车维修管理系统',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说',
    store: {
      name: '门店名称',
      nameSearch: '请输入门店名称',
      code: '门店编号',
      codeSearch: '请输入门店编号',
      statusText: '状态',
      statusSearch: '请选择门店状态',
      province: '省份',
      provinceSearch: '请输入省份',
      city: '城市',
      citySearch: '请输入城市',
      address: '详细地址',
      contact: '联系方式',
      batchDeactivate: '批量停用',
      batchActivate: '批量启用',
      statusOptions: {
        active: '启用',
        inactive: '停用'
      },
      status: {
        _value: '状态',
        active: '已启用',
        inactive: '已停用',
        activate: '启用',
        deactivate: '停用'
      },
      linkUser: {
        title: '关联用户',
        action: '关联用户'
      }
    },
    permission: {
      title: '权限管理',
      name: '权限名称',
      code: '权限编码',
      type: '权限类型',
      menu: '菜单',
      operation: '操作',
      path: '路由路径',
      component: '组件路径',
      sort: '排序',
      icon: '图标',
      nameRequired: '请输入权限名称',
      codeRequired: '请输入权限编码',
      typeRequired: '请选择权限类型',
      nameSearch: '请输入权限名称',
      codeSearch: '请输入权限编码',
      typeSearch: '请选择权限类型'
    },
    user: {
      title: '用户管理',
      username: '用户名',
      password: '密码',
      name: '姓名',
      phone: '手机号',
      email: '邮箱',
      type: '用户类型',
      roles: '关联角色',
      typeAdmin: '管理员',
      typeTechnician: '维修技师',
      typeUser: '普通用户',
      usernamePlaceholder: '请输入用户名',
      passwordPlaceholder: '请输入密码',
      namePlaceholder: '请输入姓名',
      phonePlaceholder: '请输入手机号',
      emailPlaceholder: '请输入邮箱',
      typePlaceholder: '请选择用户类型',
      usernameRequired: '请输入用户名',
      passwordRequired: '请输入密码',
      nameRequired: '请输入姓名',
      phoneRequired: '请输入手机号',
      emailRequired: '请输入邮箱',
      typeRequired: '请选择用户类型',
      linkRole: {
        title: '关联角色',
        action: '关联角色'
      }
    },
    role: {
      title: '角色管理',
      name: '角色名称',
      code: '角色编码',
      description: '角色描述',
      status: '状态',
      namePlaceholder: '请输入角色名称',
      codePlaceholder: '请输入角色编码',
      descriptionPlaceholder: '请输入角色描述',
      statusPlaceholder: '请选择状态',
      nameRequired: '请输入角色名称',
      codeRequired: '请输入角色编码',
      statusRequired: '请选择状态',
      linkPermission: '关联权限'
    },
    technician: {
      title: '技师管理',
      employeeId: '工号',
      name: '姓名',
      avatar: '头像',
      phone: '手机号',
      email: '邮箱',
      level: '技师等级',
      specialties: '专长领域',
      workYears: '工作年限',
      status: '状态',
      selectUser: '请选择用户',
      namePlaceholder: '请输入姓名',
      phonePlaceholder: '请输入手机号',
      emailPlaceholder: '请输入邮箱',
      levelPlaceholder: '请选择技师等级',
      statusPlaceholder: '请选择状态',
      specialtiesPlaceholder: '请选择专长领域',
      workYearsPlaceholder: '请输入工作年限',
      nameRequired: '请输入姓名',
      phoneRequired: '请输入手机号',
      emailRequired: '请输入邮箱',
      levelRequired: '请选择技师等级',
      specialtiesRequired: '请选择专长领域',
      workYearsRequired: '请输入工作年限',
      statusActive: '在岗',
      statusOnLeave: '请假',
      statusDeleted: '已删除'
    }
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    createSuccess: '创建成功',
    view: '查看',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    ok: '确定',
    close: '关闭',
    check: '勾选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除 {name} ?',
    edit: '编辑',
    download: '下载',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    select: '请选择',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    operate: '操作',
    operation: '操作',
    createTime: '创建时间',
    confirmPay: '确认支付',
    pleaseCheckValue: '请选择要操作的数据',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    remarks: '请输入备注',
    yesOrNo: {
      yes: '是',
      no: '否'
    },
    gender: {
      male: '男',
      female: '女'
    },
    status: {
      enable: '启用',
      disable: '禁用'
    },
    export: '导出',
    exportSuccess: '导出成功',
    batchDeleteConfirm: '确认删除选中的 {count} 条记录?',
    unit: {
      kilometer: '公里'
    },
    remark: '备注',
    remarkPlaceholder: '请输入备注信息',
    isNew: '新客户',
    searchSuccess: '查询成功',
    searchError: '查询失败',
    upload: '上传图片',
    preview: '预览',
    success: '成功',
    failed: '失败',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    invalidForm: '表单验证失败',
    loadError: '加载失败',
    loadSuccess: '加载成功',
    confirmDeleteTitle: '确认删除',
    confirmDeleteContent: '删除后数据将无法恢复，是否确认删除？',
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeSchema: {
      title: '主题模式',
      light: '亮色模式',
      dark: '暗黑模式',
      auto: '跟随系统'
    },
    grayscale: '灰色模式',
    colourWeakness: '色弱模式',
    layoutMode: {
      title: '布局模式',
      vertical: '左侧菜单模式',
      'vertical-mix': '侧菜单混合模式',
      horizontal: '顶部菜单模式',
      'horizontal-mix': '顶部菜单混合模式',
      reverseHorizontalMix: '一级菜单与子级菜单位置反转'
    },
    recommendColor: '应推荐算法的颜色',
    recommendColorDesc: '推荐颜色的算法参照',
    themeColor: {
      title: '主题颜色',
      primary: '主色',
      info: '信息色',
      success: '成功色',
      warning: '警告色',
      error: '错误色',
      followPrimary: '跟随主色'
    },
    scrollMode: {
      title: '滚动模式',
      wrapper: '外层滚动',
      content: '主体滚动'
    },
    page: {
      animate: '页面切换动画',
      mode: {
        title: '页面切换动画类型',
        'fade-slide': '滑动',
        fade: '淡入淡出',
        'fade-bottom': '底部消退',
        'fade-scale': '缩放消退',
        'zoom-fade': '渐变',
        'zoom-out': '闪现',
        none: '无'
      }
    },
    fixedHeaderAndTab: '固定头部和标签栏',
    header: {
      height: '头部高度',
      breadcrumb: {
        visible: '显示面包屑',
        showIcon: '显示面包屑图标'
      }
    },
    tab: {
      visible: '显示标签栏',
      cache: '缓存标签页',
      height: '标签栏高度',
      mode: {
        title: '标签风格',
        chrome: '谷歌风格',
        button: '按钮风格'
      }
    },
    sider: {
      inverted: '深色侧边栏',
      width: '侧边栏宽度',
      collapsedWidth: '侧边栏折叠宽度',
      mixWidth: '混合布局侧边栏宽度',
      mixCollapsedWidth: '混合布局侧边栏折叠宽度',
      mixChildMenuWidth: '混合布局子菜单宽度'
    },
    footer: {
      visible: '显示底部',
      fixed: '固定底部',
      height: '底部高度',
      right: '底部局右'
    },
    watermark: {
      visible: '显示全屏水印',
      text: '水印文本'
    },
    themeDrawerTitle: '主题配置',
    pageFunTitle: '页面功能',
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    'iframe-page': '外链页面',
    home: '首页',
    customer: '客户管理',
    customer_list: '客户列表',
    vehicle: '车辆管理',
    vehicle_list: '车辆列表',
    repair: '维修管理',
    repair_list: '维修登记',
    repair_record: '维修记录',
    repair_settlement: '维修结算',
    repair_material: '维修材料',
    repair_item: '维修项目',
    system: '系统管理',
    system_store: '门店管理',
    system_permission: '权限管理',
    system_user: '用户管理',
    system_role: '角色管理',
    system_technician: '技师管理',
    inventory: '库存管理',
    inventory_list: '库存列表',
    'inventory_stock-in': '入库管理',
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        emailPlaceholder: '请输入邮箱',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！',
        registerSuccess: '注册成功',
        registerError: '注册失败，请稍后重试'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    home: {
      branchDesc:
        '为了方便大家开发和更新合并，我们对main分支的代码进行了精简，只保留了首页菜单，其余内容已移至example分支进行维护。预览地址显示的内容即为example分支的内容。',
      greeting: '欢迎，{userName}, 今天又是充满活力的一天!',
      weatherDesc: '今日多云转晴，20℃ - 25℃!',
      projectCount: '项目数',
      todo: '待办',
      message: '消息',
      downloadCount: '下载量',
      registerCount: '注册量',
      schedule: '作息安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      turnover: '成交额',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: 'Soybean 在2021年5月28日创建了开源项目 soybean-admin!',
        desc2: 'Yanbowe 向 soybean-admin 提交了个bug，多标签栏不会自适应。',
        desc3: 'Soybean 准为 soybean-admin 的发布做充分的准备工作!',
        desc4: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        desc5: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！'
      },
      creativity: '创意'
    }
  },
  form: {
    required: '不能为空',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    },
    contact: {
      required: '请输入联系人'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条'
  },
  menu: {
    customer: {
      _value: '客户管理',
      list: '客户列表',
      name: '客户姓名',
      phone: '联系方式',
      email: '电子邮箱',
      address: '联系地址',
      contact: '联系人',
      bankAccount: '银行账号',
      bankName: '开户行',
      createdAt: '创建时间',
      nameSearch: '请输入客户名称搜索',
      phoneSearch: '请输入联系方式',
      emailSearch: '请输入邮箱',
      addressSearch: '请输入地址',
      contactSearch: '请输入联系人',
      bankAccountSearch: '请输入银行账号',
      bankNameSearch: '请输入开户行',
      userStatus: '用户状态',
      statusSearch: '请选择状态',
      export: '导出',
      nameRequired: '请输入客户姓名',
      phoneRequired: '请输入联系方式',
      contactRequired: '请输入联系人'
    },
    vehicle: {
      _value: '车辆管理',
      list: '车辆列表',
      brand: '品牌',
      model: '型号',
      year: '年份',
      licensePlate: '车牌号',
      vin: '车架号',
      engineNo: '发动机编号',
      color: '颜色',
      mileage: '里程',
      displacement: '排量',
      brandPlaceholder: '请选择品牌',
      modelPlaceholder: '请输入型号',
      yearPlaceholder: '请选择年份',
      licensePlatePlaceholder: '请输入车牌号',
      vinPlaceholder: '请输入车架号',
      engineNoPlaceholder: '请输入发动机编号',
      colorPlaceholder: '请输入颜色',
      mileagePlaceholder: '请输入里程',
      displacementPlaceholder: '请输入排量',
      export: '导出',
      brandSearch: '请选择品牌',
      modelSearch: '请选择型号',
      required: '请选择车辆',
      licensePlateRequired: '请输入车牌号'
    },
    repairOrder: {
      _value: '维修管理',
      list: '维修登记',
      orderNo: '工单编号',
      orderNoSearch: '请输入工单编号',
      customerNameSearch: '请输入客户名称',
      status: '工单状态',
      faultDesc: '故障描述',
      customer: '客户信息',
      vehicle: '车辆信息',
      mechanic: '维修技师',
      createTime: '创建时间',
      inDate: '进厂日期',
      inDatePlaceholder: '请选择进厂日期',
      estimatedTime: '预计完工日期',
      estimatedTimePlaceholder: '请选择预计完工日期',
      actualTime: '实际完工时间',
      deliveryTime: '交车时间',
      statusSearch: '请选择工单状态',
      faultDescPlaceholder: '请输入故障描述',
      orderNoPlaceholder: '请输入工单编号',
      customerNamePlaceholder: '请输入客户名称',
      licensePlatePlaceholder: '请输入车牌号',
      statusPlaceholder: '请选择工单状态',
      faultDescRequired: '请输入故障描述'
    },
    system: {
      _value: '系统管理',
      store: '门店管理',
      permission: '权限管理',
      user: '用户管理',
      role: '角色管理'
    },
    inventory: {
      list: '库存列表',
      management: '库存管理'
    }
  },
  material: {
    list: '材料列表',
    name: '材料名称',
    code: '材料编码',
    categoryLabel: '材料类别',
    specification: '规格型号',
    unitLabel: '单位',
    price: '价格信息',
    purchasePrice: '采购价格',
    sellingPrice: '销售价格',
    managementFeeRate: '管理费率',
    stock: '库存',
    stockQuantity: '库存数量',
    stockThreshold: '库存预警值',
    category: '材料类别',
    unit: '单位',
    status: '状态',
    supplier: {
      name: '供应商名称',
      contact: '联系人',
      phone: '联系电话'
    },
    categoryTypes: {
      parts: '配件',
      oil: '油品',
      consumables: '耗材'
    },
    unitTypes: {
      piece: '个',
      set: '套',
      liter: '升'
    }
  },
  repairOrder: {
    status: {
      pending: '待处理',
      checked: '已检查',
      repairing: '维修中',
      completed: '已完工',
      delivered: '已交车',
      repaired: '已修复',
      inspecting: '检查中'
    },
    complete: '完工',
    completeSuccess: '工单完工成功',
    completeFailed: '工单完工失败',
    check: '检查',
    repair: {
      action: '维修',
      title: '维修登记',
      items: '维修项目',
      itemName: '项目名称',
      price: '维修费用',
      parts: '维修材料',
      partName: '配件名称',
      quantity: '数量',
      partPrice: '配件单价',
      estimatedTime: '预计完工时间',
      mechanic: '维修技师',
      atLeastOneItem: '请至少添加一个维修项目',
      nameRequired: '项目名称不能为空',
      priceInvalid: '费用必须大于等于0',
      estimatedTimeRequired: '请选择预计完工时间',
      mechanicRequired: '请输入维修技师',
      laborHours: '工时定额',
      laborPrice: '工时单价',
      complexityFactor: '复杂系数',
      laborDiscount: '工时费优惠率',
      purchasePrice: '购买进价',
      managementFee: '管理费率',
      managementDiscount: '管理费优惠率',
      laborAmount: '工时费',
      partsAmount: '配件费用',
      totalAmount: '总金额',
      addItem: '添加维修项目',
      laborHoursInvalid: '工时定额必须大于0',
      laborPriceInvalid: '工时单价必须大于0',
      item: {
        title: '维修项目管理',
        name: '项目名称',
        laborHours: '工时定额',
        laborPrice: '工时单价',
        complexityFactor: '复杂系数',
        laborDiscountRate: '工时费优惠率',
        materials: '材料清单',
        materialId: '材料名称',
        quantity: '数量',
        managementFeeRate: '管理费率',
        materialDiscountRate: '材料优惠率',
        description: '描述',
        status: '状态',
        createTime: '创建时间',
        updateTime: '更新时间',
        operation: '操作'
      }
    },
    checkSuccess: '检查成功',
    repairSuccess: '维修成功',
    checkFailed: '检查失败',
    repairFailed: '维修失败',
    inspection: {
      title: '检查登记',
      items: '车辆检查项目',
      customerItems: {
        title: '客户物品登记',
        name: '物品名称',
        quantity: '数量',
        remark: '备注',
        images: '图片'
      },
      itemName: '项目名称',
      result: '检查结果',
      normal: '正常',
      abnormal: '异常',
      remark: '备注',
      images: '图片',
      atLeastOneItem: '请至少添加一个检查项目',
      nameRequired: '检查项目名称不能为空',
      resultRequired: '请选择检查结果',
      completeAllRequired: '请完整填写所有必填项',
      customerItemNameRequired: '客户物品名称不能为空',
      quantityInvalid: '数量必须大于等于0',
      validation: {
        nameRequired: '检查项目名称不能为空',
        resultRequired: '请选择检查结果',
        atLeastOneItem: '请至少添加一个检查项目',
        completeAllRequired: '请完整填写所有必填项',
        customerItemNameRequired: '客户物品名称不能为空',
        quantityInvalid: '数量必须大于等于0',
        quantityRequired: '请输入数量'
      }
    },
    list: '维修工单',
    add: '新增工单',
    edit: '编辑工单',
    view: '查看工单',
    createTime: '创建时间',
    inDate: '进厂日期'
  },
  repairItem: {
    list: '维修项目',
    title: '维修项目管理',
    name: '项目名称',
    laborHours: '工时定额',
    laborPrice: '工时单价',
    complexityFactor: '复杂系数',
    laborDiscountRate: '工时费优惠率',
    category: '项目类别',
    description: '项目描述',
    isActive: '是否启用',
    createTime: '创建时间',
    updateTime: '更新时间',
    operation: '操作',
    categoryTypes: {
      engine: '发动机维修',
      transmission: '变速箱维修',
      brake: '制动系统',
      electrical: '电器系统',
      suspension: '悬挂系统',
      maintenance: '日常保养',
      other: '其他'
    },
    form: {
      title: {
        add: '新增维修项目',
        edit: '编辑维修项目'
      },
      namePlaceholder: '请输入项目名称',
      laborHoursPlaceholder: '请输入工时定额',
      laborPricePlaceholder: '请输入工时单价',
      complexityFactorPlaceholder: '请输入复杂系数',
      laborDiscountRatePlaceholder: '请输入工时费优惠率',
      categoryPlaceholder: '请选择项目类别',
      descriptionPlaceholder: '请输入项目描述',
      isActivePlaceholder: '请选择是否启用'
    },
    table: {
      columns: {
        name: '项目名称',
        category: '项目类别',
        laborHours: '工时定额',
        laborPrice: '工时单价',
        complexityFactor: '复杂系数',
        laborDiscountRate: '工时费优惠率',
        isActive: '是否启用',
        description: '描述',
        createTime: '创建时间',
        updateTime: '更新时间'
      },
      search: {
        name: '项目名称',
        category: '项目类别',
        isActive: '是否启用',
        namePlaceholder: '请输入项目名称搜索',
        categoryPlaceholder: '请选择项目类别',
        isActivePlaceholder: '请选择状态'
      },
      operations: {
        add: '新增项目',
        edit: '编辑',
        delete: '删除',
        view: '查看详情',
        confirmDelete: '确认删除该维修项目？'
      }
    },
    item: {
      title: '维修项目管理',
      name: '项目名称',
      laborHours: '工时定额',
      laborPrice: '工时单价',
      complexityFactor: '复杂系数',
      laborDiscountRate: '工时费优惠率',
      description: '描述',
      status: '状态',
      createTime: '创建时间',
      updateTime: '更新时间',
      operation: '操作'
    }
  },
  settlement: {
    title: '维修结算单',
    detail: '结算单详情',
    edit: '编辑结算单',
    createTime: '填表日期',
    settlementNo: '结算单号',
    repairOrderNo: '维修工单号',
    customer: '客户姓名',
    customerPhone: '联系电话',
    vehicle: '车辆信息',
    licensePlate: '车牌号',
    vehicleBrand: '品牌/型号',
    contact: '联系人信息',
    repairItem: '维修项目',
    laborAmount: '工时费',
    partsAmount: '配件费',
    totalAmount: '总金额',
    totalLabel: '合计',
    paymentMethod: '支付方式',
    paymentStatus: '支付状态',
    createTimeRequired: '请选择填表日期',
    statusLabel: '状态',
    status: {
      unpaid: '未支付',
      paid: '已支付'
    }
  },
  inventory: {
    title: '库存管理',
    code: '材料编号',
    name: '材料名称',
    category: '类别',
    quantity: '库存数量',
    unit: '单位',
    price: '单价',
    supplier: '供应商',
    material: '材料',
    alertThreshold: '预警阈值',
    maxQuantity: '最大库存',
    codePlaceholder: '请输入材料编号',
    namePlaceholder: '请输入材料名称',
    categoryPlaceholder: '请输入类别',
    supplierPlaceholder: '请输入供应商',
    materialPlaceholder: '请选择材料',
    quantityPlaceholder: '请输入库存数量',
    alertThresholdPlaceholder: '请输入预警阈值',
    maxQuantityPlaceholder: '请输入最大库存',
    list: {
      title: '库存列表'
    },
    stockIn: {
      title: '入库管理',
      stockInNo: '入库单号',
      material: '材料',
      quantity: '数量',
      unitPrice: '单价',
      totalAmount: '总金额',
      supplier: '供应商',
      stockInDate: '入库日期',
      operator: '操作人',
      status: '状态',
      remarks: '备注',

      // 表单相关
      selectMaterial: '请选择物料',
      inputQuantity: '请输入数量',
      inputUnitPrice: '请输入单价',
      inputSupplier: '请输入供应商',
      selectDate: '请选择入库日期',

      // 状态
      statusActive: '已入库',
      statusInactive: '已取消',

      // 按钮
      create: '新建入库单',
      cancel: '取消入库'
    }
  }
};

export default local;
