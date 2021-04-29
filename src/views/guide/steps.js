const steps = [
  {
    element: '#nav-container',
    popover: {
      title: '导航栏',
      description: '这是系统导航栏',
      position: 'bottom'
    },
    padding: 0
  },
  {
    element: '#hamburger-container',
    popover: {
      title: '侧边栏控制键',
      description: '打开/关闭 侧边栏',
      position: 'bottom'
    }
  },
  {
    element: '#breadcrumb-container',
    popover: {
      title: '路径导航栏',
      description: '显示当前所处的页面路径',
      position: 'bottom'
    }
  },
  {
    element: '#screenfull',
    popover: {
      title: '全屏模式',
      description: '将页面全屏显示',
      position: 'left'
    }
  },
  {
    element: '#avatar-container',
    popover: {
      title: '更多操作',
      description: '显示更多的操作',
      position: 'left'
    }
  },
  {
    element: '#tags-view-container',
    popover: {
      title: '页面标签',
      description: '查看你访问过的页面历史',
      position: 'bottom'
    },
    padding: 0
  },
  {
    element: '#sidebar',
    popover: {
      title: '侧边栏',
      description: '选择进行一系列功能操作',
      position: 'right'
    },
    padding: 0
  },
  {
    element: '#rightPanel-container',
    popover: {
      title: '系统设置',
      description: '进行更换主题, 固定导航栏, 取消页面标签等操作',
      position: 'left'
    }
  },
]

export default steps
