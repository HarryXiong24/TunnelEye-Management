import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/main/index'),
      meta: { title: '主页', icon: 'example' }
    }]
  },

  {
    path: '/systemManage',
    component: Layout,
    redirect: '/systemManage/devManage',
    name: 'SystemManage',
    meta: { title: '系统配置管理', icon: 'chart' },
    children: [
      {
        path: 'devManage',
        name: 'DevManage',
        component: () => import('@/views/systemManage/devManage/index'),
        meta: { title: '下位机管理', icon: 'component' }
      },
      {
        path: 'devConfig',
        name: 'DevConfig',
        component: () => import('@/views/systemManage/devConfig/index'),
        meta: { title: '下位机配置管理', icon: 'dashboard' }
      },
      {
        path: 'UWBManage',
        name: 'UWBManage',
        component: () => import('@/views/systemManage/UWBManage/index'),
        meta: { title: 'UWB系统管理', icon: 'list' }
      },
      {
        path: 'UWBTagManage',
        name: 'UWBTagManage',
        component: () => import('@/views/systemManage/UWBTagManage/index'),
        meta: { title: 'UWB标签管理', icon: 'star' }
      },      
      {
        path: 'sensorManage',
        name: 'SensorManage',
        component: () => import('@/views/systemManage/sensorManage/index'),
        meta: { title: '传感器管理', icon: 'tab' }
      },
    ]
  },

  {
    path: '/groupManage',
    component: Layout,
    redirect: '/groupManage/departmentManage',
    name: 'GroupManage',
    meta: { title: '组织机构管理', icon: 'tree-table' },
    children: [
      {
        path: 'departmentManage',
        name: 'DepartmentManage',
        component: () => import('@/views/groupManage/departmentManage/index'),
        meta: { title: '部门管理', icon: 'tree' }
      },
      {
        path: 'userManage',
        name: 'UserManage',
        component: () => import('@/views/groupManage/userManage/index'),
        meta: { title: '用户信息管理', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/workManage',
    component: Layout,
    redirect: '/workManage/watch',
    name: 'WorkManage',
    meta: { title: '施工人员管理', icon: 'nested' },
    children: [
      {
        path: 'manageGroup',
        name: 'ManageGroup',
        component: () => import('@/views/workSchedule/manageGroup/index'),
        meta: { title: '班组成员管理', icon: 'table' }
      },
      {
        path: 'manageWork',
        name: 'ManageWork',
        component: () => import('@/views/workSchedule/manageWork/index'),
        meta: { title: '值班排班管理', icon: 'skill' }
      },
      {
        path: 'workTime',
        name: 'WorkTime',
        component: () => import('@/views/workSchedule/workTime/index'),
        meta: { title: '出勤信息查看', icon: 'eye' }
      }
    ]
  },

  {
    path: '/newsManage',
    component: Layout,
    redirect: '/newsManage/showNews',
    name: 'NewsManage',
    meta: { title: '预警消息管理', icon: 'icon' },
    children: [
      {
        path: 'showNews',
        name: 'ShowNews',
        component: () => import('@/views/newsManage/showNews/index'),
        meta: { title: '消息展示', icon: 'message' }
      },
      {
        path: 'submitNews',
        name: 'SubmitNews',
        component: () => import('@/views/newsManage/submitNews/index'),
        meta: { title: '发布新消息', icon: 'form' }
      },
    ]
  },

  {
    path: '/systemLog',
    component: Layout,
    children: [
      {
        path: 'systemLog',
        name: 'SystemLog',
        component: () => import('@/views/systemLog/index'),
        meta: { title: '系统日志管理', icon: 'documentation' }
      }
    ]
  },

  {
    path: '/frontendShow',
    component: Layout,
    children: [
      {
        path: 'frontendShow',
        name: 'FrontendShow',
        component: () => import('@/views/frontendShow/index'),
        meta: { title: '手机端数据展示', icon: 'guide' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '用户信息', icon: 'user', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

  
  // {
  //   path: '/guide',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'guide',
  //       name: 'Guide',
  //       component: () => import('@/views/guide/index'),
  //       meta: { title: '系统使用说明', icon: 'eye-open' }
  //     }
  //   ]
  // },
  
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: '人员及组织机构管理', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: '未知',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Temp2' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'Temp1' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
