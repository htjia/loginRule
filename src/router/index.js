import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由

/**
* hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面
* alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
                                 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                                 //若你想不管路由下面的 children 声明的个数都显示你的根路由
                                 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
* redirect: noredirect           当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
    roles: ['admin', 'editor']   设置该路由进入的权限，支持多个权限叠加
}
  }
**/
const spark = sessionStorage.getItem('spark')
const hadoop = sessionStorage.getItem('hadoop')
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/forecastDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'ForecastDetail',
        component: () => import('@/views/forecastDetail/index'),
        meta: { title: '生产过程预测' }
      }
    ]
  }
]
export const asyncRouterMap = [
  // {
  //   path: '/equipmentRecommend',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'EquipmentRecommend',
  //       component: () => import('@/views/equipmentRecommend/index'),
  //       meta: { title: '设备派工推荐', icon: 'shebei' }
  //     }
  //   ]
  // },
  // {
  //   path: '/parameterRecommend',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'ParameterRecommend',
  //       component: () => import('@/views/parameterRecommend/index'),
  //       meta: { title: '工艺参数推荐', icon: 'gongyi' }
  //     }
  //   ]
  // },
  // {
  //   path: '/forecast',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Forecast',
  //       component: () => import('@/views/forecast/index'),
  //       meta: { title: '生产过程预测', icon: 'yuce' }
  //     }
  //   ]
  // },
  // {
  //   path: '/report',
  //   name: 'Report',
  //   component: Layout,
  //   alwaysShow: true,
  //   meta: { title: '大数据分析报表', icon: 'baobiao' },
  //   children: [
  //     {
  //       path: '/routine',
  //       name: 'Routine',
  //       alwaysShow: true,
  //       component: () => import('@/views/report/generalReport/index'),
  //       meta: { title: '报废主题分析报表', icon: 'cgfenxi' },
  //       children: [
  //         {
  //           path: 'cockpit',
  //           name: 'Cockpit',
  //           component: () => import('@/views/report/generalReport/cockpit/index'),
  //           meta: { title: '领导驾驶舱' }
  //         },
  //         {
  //           path: 'classes',
  //           name: 'Classes',
  //           component: () => import('@/views/report/generalReport/classes/index'),
  //           meta: { title: '班次报废率分析' }
  //         },
  //         {
  //           path: 'equipment',
  //           name: 'Equipment',
  //           component: () => import('@/views/report/generalReport/equipment/index'),
  //           meta: { title: '设备报废率分析' }
  //         },
  //         {
  //           path: 'equipmentDetail',
  //           name: 'EquipmentDetail',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/equipmentDetail/index'),
  //           meta: { title: '设备报废率分析' }
  //         },
  //         {
  //           path: 'product',
  //           name: 'Product',
  //           component: () => import('@/views/report/generalReport/product/index'),
  //           meta: { title: '产品报废率分析' }
  //         },
  //         {
  //           path: 'productTrend',
  //           name: 'ProductTrend',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/productTrend/index'),
  //           meta: { title: '产品报废率分析' }
  //         },
  //         {
  //           path: 'productList',
  //           name: 'ProductList',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/productList/index'),
  //           meta: { title: '产品报废率分析' }
  //         },
  //         {
  //           path: 'productDetail',
  //           name: 'ProductDetail',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/productDetail/index'),
  //           meta: { title: '产品报废率分析' }
  //         },
  //         {
  //           path: 'contrast',
  //           name: 'Contrast',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/contrast/index'),
  //           meta: { title: '产品报废率分析' }
  //         },
  //         {
  //           path: 'abnormal',
  //           name: 'Abnormal',
  //           component: () => import('@/views/report/generalReport/abnormal/index'),
  //           meta: { title: '报废原因分析' }
  //         },
  //         {
  //           path: 'abnormalProduct',
  //           name: 'AbnormalProduct',
  //           hidden: true,
  //           component: () => import('@/views/report/generalReport/abnormalProduct/index'),
  //           meta: { title: '报废原因分析' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'olap',
  //       name: 'Olap',
  //       // hidden: true,
  //       component: () => import('@/views/olap/index'),
  //       meta: { title: '多维分析报表', icon: 'dwdfenxi' }
  //     }
  //   ]
  // },
  {
    path: '/backgroundManagement',
    name: 'BackgroundManagement',
    component: Layout,
    redirect: '/backgroundManagement/roles',
    alwaysShow: true,
    meta: { title: '后台管理', icon: 'houtaim' },
    children: [
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/roles/index'),
        meta: { title: '角色管理', icon: 'jiaose' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'userm' }
      },
      {
        path: 'function',
        name: 'Function',
        component: () => import('@/views/function/index'),
        meta: { title: '功能管理', icon: 'btn' }
      },
      {
        path: 'menuManager',
        name: 'MenuManager',
        component: () => import('@/views/menuManager/index'),
        meta: { title: '菜单管理', icon: 'menu' }
      }
    ]
  },
  {
    path: '/timeTaskManager',
    name: 'TimeTaskManager',
    component: Layout,
    redirect: '/timeTaskManager/taskList',
    alwaysShow: true,
    meta: { title: '定时任务管理', icon: 'dsrwgl' },
    children: [
      {
        path: 'taskList',
        name: 'TaskList',
        component: () => import('@/views/timeTaskManager/taskList/index'),
        meta: { title: '定时任务列表', icon: 'dsrwlb' }
      },
      {
        path: 'taskLog',
        name: 'TaskLog',
        component: () => import('@/views/timeTaskManager/taskLog/index'),
        meta: { title: '任务日志', icon: 'rwrz' }
      }
    ]
  },
  {
    path: '/businessDef',
    name: 'BusinessDef',
    component: Layout,
    redirect: '/businessDef/businessDefin',
    alwaysShow: true,
    meta: { title: '业务规则', icon: 'ywgzdy' },
    children: [
      {
        path: 'businessDefin',
        name: 'BusinessDefin',
        component: () => import('@/views/businessDef/businessDef/index'),
        meta: { title: '业务定义', icon: 'ywdy' }
      },
      {
        path: 'sqlDef',
        name: 'SqlDef',
        hidden: true,
        component: () => import('@/views/businessDef/sqlDef/index'),
        meta: { title: 'SQL定义', icon: 'fieldType' }
      }
    ]
  },
  {
    path: '/deviceDataSet',
    name: 'DeviceDataSet',
    component: Layout,
    alwaysShow: true,
    redirect: '/commonSet/collectParam',
    meta: { title: '设备数据采集配置', icon: 'shebei' },
    children: [
      {
        path: '/commonSet',
        name: 'CommonSet',
        alwaysShow: true,
        redirect: '/commonSet/collectParam',
        component: () => import('@/views/report/generalReport/index'),
        meta: { title: '通用配置', icon: 'config-ty' },
        children: [
          {
            path: 'collectParam',
            name: 'CollectParam',
            component: () => import('@/views/deviceCollectSet/commonSet/collectParam/index'),
            meta: { title: '采集参数配置', icon: 'config-cs' }
          },
          {
            path: 'deviceSet',
            name: 'DeviceSet',
            component: () => import('@/views/deviceCollectSet/commonSet/deviceSet/index'),
            meta: { title: '设备驱动配置', icon: 'config-sb' }
          },
          {
            path: 'dataDestination',
            name: 'DataDestination',
            component: () => import('@/views/deviceCollectSet/commonSet/dataDestination/index'),
            meta: { title: '数据去向配置', icon: 'config-fx' }
          }
        ]
      },
      {
        path: 'clientSet',
        name: 'ClientSet',
        // hidden: true,
        component: () => import('@/views/deviceCollectSet/clientSet/clientSet/index'),
        meta: { title: '客户端配置', icon: 'config-khd' }
      }
    ]
  },
  {
    path: '/workflowSetting',
    name: 'WorkflowSetting',
    redirect: '/workflowSetting/classifyManage',
    component: Layout,
    meta: { title: '工作流程设置', icon: 'work-flow-set' },
    children: [
      {
        path: 'classifyManage',
        name: 'ClassifyManage',
        component: () => import('@/views/workflowManager/workflowSetting/classifyManage/index'),
        meta: { title: '流程分类管理', icon: 'config-cs' }
      },
      {
        path: 'formManage',
        name: 'FormManage',
        component: () => import('@/views/workflowManager/workflowSetting/formManage/index'),
        meta: { title: '表单管理', icon: 'form-manager' }
      },
      {
        path: 'flowChartManage',
        name: 'FlowChartManage',
        component: () => import('@/views/workflowManager/workflowSetting/flowChartManage/index'),
        meta: { title: '流程图管理', icon: 'flow-chart' }
      },
      {
        path: 'flowList',
        name: 'FlowList',
        component: () => import('@/views/workflowManager/workflowSetting/flowList/index'),
        meta: { title: '流程列表', icon: 'flow-list' }
      },
      {
        path: 'folwMonitor',
        name: 'FolwMonitor',
        component: () => import('@/views/workflowManager/workflowSetting/folwMonitor/index'),
        meta: { title: '流程执行监控', icon: 'flow-jk' }
      }
    ]
  },
  {
    path: '/workflowManager',
    name: 'WorkflowManager',
    component: Layout,
    redirect: '/workflowManager/myWorkflow/startWorkflow',
    meta: { title: '工作流程管理', icon: 'work-flow' },
    children: [
      {
        path: 'myWorkflow',
        name: 'MyWorkflow',
        component: () => import('@/views/workflowManager/index'),
        meta: { title: '我的流程', icon: 'my-work-flow' },
        redirect: '/workflowManager/myWorkflow/startWorkflow',
        children: [
          {
            path: 'startWorkflow',
            name: 'StartWorkflow',
            component: () => import('@/views/workflowManager/myWorkflow/startWorkflow/index'),
            meta: { title: '发起流程', icon: 'fqlc' }
          },
          {
            path: 'unFinished',
            name: 'UnFinished',
            component: () => import('@/views/workflowManager/myWorkflow/unFinished/index'),
            meta: { title: '未结流程', icon: 'wei-jie' }
          },
          {
            path: 'finished',
            name: 'Finished',
            component: () => import('@/views/workflowManager/myWorkflow/finished/index'),
            meta: { title: '办结流程', icon: 'yi-jie' }
          }
        ]
      },
      {
        path: 'myTasks',
        name: 'MyTasks',
        component: () => import('@/views/workflowManager/index'),
        meta: { title: '我的任务', icon: 'my-task' },
        redirect: '/workflowManager/myTasks/toDoList',
        children: [
          {
            path: 'toDoList',
            name: 'ToDoList',
            component: () => import('@/views/workflowManager/myTasks/toDoList/index'),
            meta: { title: '待办任务', icon: 'to-do-task' }
          },
          {
            path: 'endTasks',
            name: 'EndTasks',
            component: () => import('@/views/workflowManager/myTasks/endTasks/index'),
            meta: { title: '已办任务', icon: 'finished-task' }
          }
        ]
      },
      {
        path: 'myDelegate',
        name: 'MyDelegate',
        component: () => import('@/views/workflowManager/index'),
        meta: { title: '我的委托', icon: 'my-delegate' },
        redirect: '/workflowManager/myDelegate/delegationRules',
        children: [
          {
            path: 'delegationRules',
            name: 'DelegationRules',
            component: () => import('@/views/workflowManager/myDelegate/delegationRules/index'),
            meta: { title: '委托规则', icon: 'delegate-rule' }
          },
          {
            path: 'delegateRecord',
            name: 'DelegateRecord',
            component: () => import('@/views/workflowManager/myDelegate/delegateRecord/index'),
            meta: { title: '委托记录', icon: 'delegate-record' }
          }
        ]
      }
    ]
  },
  {
    path: '/metaDataManager',
    name: 'MetaDataManager',
    component: Layout,
    redirect: '/metaDataManager/labelManager',
    alwaysShow: true,
    meta: { title: '平台数据管理', icon: 'metaData' },
    children: [
      {
        path: 'labelManager',
        name: 'LabelManager',
        component: () => import('@/views/metadataManager/labelManager/index'),
        meta: { title: '元数据字段管理', icon: 'field' }
      },
      {
        path: 'filedType',
        name: 'FiledType',
        component: () => import('@/views/metadataManager/filedType/index'),
        meta: { title: '元数据字段类型管理', icon: 'fieldType' }
      },
      {
        path: 'tableManager',
        name: 'TableManager',
        component: () => import('@/views/metadataManager/tableManager2/index'),
        meta: { title: '主数据表管理', icon: 'dataTable' }
      },
      {
        path: hadoop,
        meta: { title: 'Hadoop中心', icon: 'hadoop' }
      },
      {
        path: spark,
        meta: { title: 'Spark中心', icon: 'spark' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
