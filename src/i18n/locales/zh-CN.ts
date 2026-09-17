export default {
  lottery: {
    enter: '进入抽奖',
    play: '开始抽奖',
    finish: '开奖',
    replay: '重新抽奖',
    continue: '继续抽奖',
    gotoAddMember: '去添加成员',
    useDefaultData: '使用默认数据',
  },
  operation: {
    add: '添加',
    edit: '编辑',
    save: '保存',
    confirm: '确认',
    cancel: '取消',
    init: '初始化',
    query: '查询',
    create: '创建',
    bulkCreate: '批量创建',
    update: '更新',
    delete: '删除',
    bulkDelete: '批量删除',
    clear: '清空',
    confirm_bulkDelete: '$t(operation.confirm)$t(operation.bulkDelete)？',
    confirm_clear: '$t(operation.confirm)$t(operation.clear)？',
  },
  setting: '设置',
  backToLottery: '返回抽奖',
  pleaseInput: '请输入',
  pleaseSelect: '请选择',
  success: '成功',
  fail: '失败',
  data: '数据',
  general: {
    title: '通用配置',
    lotteryTitle: '抽奖标题',
    clearAll: '清空数据并退出',
  },
  member: {
    title: '成员管理',
    excelImport: 'Excel 导入',
    downloadTemplate: '下载导入模版',
  },
  award: {
    title: '奖项配置',
    prize: '奖品',
    quota: '名额',
    status: {
      ready: '未开始',
      running: '进行中',
      finished: '已开奖',
    },
  },
  record: {
    title: '获奖记录',
    exportData: '导出数据',
  },
  music: {
    title: '音乐配置',
    play: '播放',
    pause: '暂停',
    next: '下一首',
    mute: '静音',
    openingMusic: '开场音效',
    lotteryMusic: '抽奖音效',
    winningMusic: '中奖音效',
  },
  instruction: {
    title: '操作说明',
    h1: '如何使用',
    paragraphs: [
      {
        title: '概述',
        content: '纯静态页面，无需部署后端服务。数据存储依赖 IndexedDB 和 Localstorage。支持 excel 文件导入成员数据（请使用提供的模板）。支持抽奖结果导出为 excel 文件。支持自上传抽奖音效。',
      },
      {
        title: '抽奖页面',
        content: '抽奖活动的主页面，配置好数据之后的活动均在这里进行。',
        children: [
          {
            title: '抽奖区域',
            content: '屏幕中央区域。上方是抽奖标题，中间是成员卡片展示区域，下方是控制抽奖流程的操作按钮',
          },
          {
            title: '奖项列表',
            content: '位置在屏幕左侧边缘，展示当前所有抽取奖项，可收缩并支持拖拽调整顺序。因为奖项是自上而下抽取的，所以调整奖项顺序就可以控制抽奖顺序。',
          },
          {
            title: '操作栏',
            content: '位置在顶部右侧，目前有【静音】、【语言切换】、【进入设置界面】三个操作。',
          },
        ],
      },
      {
        title: '配置页面',
        content: '管理成员、奖项、音乐、结果等相关的后台页面。',
        children: [
          {
            title: '通用配置',
            content: '目前支持配置【抽奖标题】、【清空所有数据】等操作。',
          },
          {
            title: '成员管理',
            content: '成员的导入、添加、编辑、删除、清空等操作。提供成员导入模版可供下载。',
          },
          {
            title: '奖项配置',
            content: '奖项的添加、编辑、删除、清空等操作。',
          },
          {
            title: '获奖记录',
            content: '记录抽奖结果，可导出为 excel 文件。',
          },
          {
            title: '音乐配置',
            content: '音乐文件的添加、删除等操作，并可配置开场音乐、抽奖音乐、开奖音乐等。',
          },
          {
            title: '操作说明',
            content: '就是本页面。',
          },
        ],
      },
    ],
  },
};
