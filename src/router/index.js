import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/index.vue'
import homepage from '@/image/icon-homepage.png'
import homepageWhite from '@/image/icon-homepage-white.png'
import passengerflow from '@/image/icon-passengerflow.png'
import passengerflowWhite from '@/image/icon-passengerflow-white.png'
import account from '@/image/icon-account.png'
import accountWhite from '@/image/icon-account-white.png'
import store from '@/image/icon-store.png'
import storeWhite from '@/image/icon-store-white.png'
import brandIcon from '@/image/icon-brand.png'
import brandIconWhite from '@/image/icon-brand-white.png'
import attendance from '@/image/icon-attendance.png'
import attendanceWhite from '@/image/icon-attendance-white.png'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

// resolve => {
//   require.ensure(['@/views/layout/Router.vue'], () => {
//     resolve(require('@/views/layout/Router.vue'))
//   })
// }
const visitData = resolve => {
  require.ensure(['@/views/statistics/visitData.vue'], () => {
    resolve(require('@/views/statistics/visitData.vue'))
  })
}
const visitCount = resolve => {
  require.ensure(['@/views/statistics/visitCount.vue'], () => {
    resolve(require('@/views/statistics/visitCount.vue'))
  })
}

const visitor = resolve => {
  require.ensure(['@/views/statistics/visitor.vue'], () => {
    resolve(require('@/views/statistics/visitor.vue'))
  })
}

const visitRecord = resolve => {
  require.ensure(['@/views/statistics/visitRecord.vue'], () => {
    resolve(require('@/views/statistics/visitRecord.vue'))
  })
}

// const chart = resolve => {
//   require.ensure(['@/views/statistics/chart.vue'], () => {
//     resolve(require('@/views/statistics/chart.vue'))
//   })
// }

const analyse = resolve => {
  require.ensure(['@/views/statistics/analyse'], () => {
    resolve(require('@/views/statistics/analyse'))
  })
}

const storeCompared = resolve => {
  require.ensure(['@/views/statistics/storeCompared'], () => {
    resolve(require('@/views/statistics/storeCompared'))
  })
}

// const statistcharticsByDay = resolve => {
//   require.ensure(['@/views/statistics/statisticsByDay.vue'], () => {
//     resolve(require('@/views/statistics/statisticsByDay.vue'))
//   })
// }

// const report = resolve => {
//   require.ensure(['@/views/statistics/report.vue'], () => {
//     resolve(require('@/views/statistics/report.vue'))
//   })
// }

// const monthReport = resolve => {
//   require.ensure(['@/views/statistics/monthReport.vue'], () => {
//     resolve(require('@/views/statistics/monthReport.vue'))
//   })
// }

// const weekReport = resolve => {
//   require.ensure(['@/views/statistics/weekReport.vue'], () => {
//     resolve(require('@/views/statistics/weekReport.vue'))
//   })
// }

const accountList = resolve => {
  require.ensure(['@/views/account/list.vue'], () => {
    resolve(require('@/views/account/list.vue'))
  })
}

const roleList = resolve => {
  require.ensure(['@/views/account/role.vue'], () => {
    resolve(require('@/views/account/role.vue'))
  })
}
const staffManager = resolve => {
  require.ensure(['@/views/account/staffManager.vue'], () => {
    resolve(require('@/views/account/staffManager.vue'))
  })
}
const addStaffManager = resolve => {
  require.ensure(['@/views/account/addNewAccount.vue'], () => {
    resolve(require('@/views/account/addNewAccount.vue'))
  })
}
const editStaffManager = resolve => {
  require.ensure(['@/views/account/addNewAccount.vue'], () => {
    resolve(require('@/views/account/addNewAccount.vue'))
  })
}

const brand = resolve => {
  require.ensure(['@/views/brand/brand.vue'], () => {
    resolve(require('@/views/brand/brand.vue'))
  })
}

const logxiaomeng = resolve => {
  require.ensure(['@/views/journal/journalxm.vue'], () => {
    resolve(require('@/views/journal/journalxm.vue'))
  })
}

const logxshanghu = resolve => {
  require.ensure(['@/views/journal/journalcus.vue'], () => {
    resolve(require('@/views/journal/journalcus.vue'))
  })
}

const storeSetup = resolve => {
  require.ensure(['@/views/store/StoreSetup.vue'], () => {
    resolve(require('@/views/store/StoreSetup.vue'))
  })
}

const deviceList = resolve => {
  require.ensure(['@/views/store/deviceList.vue'], () => {
    resolve(require('@/views/store/deviceList.vue'))
  })
}

const visitUnrecognized = resolve => {
  require.ensure(['@/views/statistics/visitUnrecognized.vue'], () => {
    resolve(require('@/views/statistics/visitUnrecognized.vue'))
  })
}

const customer = resolve => {
  require.ensure(['@/views/customer/list.vue'], () => {
    resolve(require('@/views/customer/list.vue'))
  })
}

const tagList = resolve => {
  require.ensure(['@/views/customer/tagList.vue'], () => {
    resolve(require('@/views/customer/tagList.vue'))
  })
}

const whiteList = resolve => {
  require.ensure(['@/views/customer/whiteList.vue'], () => {
    resolve(require('@/views/customer/whiteList.vue'))
  })
}

const cusRecordDetail = resolve => {
  require.ensure(['@/views/customer/cusRecordDetail.vue'], () => {
    resolve(require('@/views/customer/cusRecordDetail.vue'))
  })
}

const blackList = resolve => {
  require.ensure(['@/views/customer/blackList.vue'], () => {
    resolve(require('@/views/customer/blackList.vue'))
  })
}

const blackListDetail = resolve => {
  require.ensure(['@/views/customer/blackListDetail.vue'], () => {
    resolve(require('@/views/customer/blackListDetail.vue'))
  })
}
// const cusBreakdown = resolve => {
//   require.ensure(['@/views/customer/cusBreakdown.vue'], () => {
//     resolve(require('@/views/customer/cusBreakdown.vue'))
//   })
// }

const visitRepeat = resolve => {
  require.ensure(['@/views/statistics/visitRepeat.vue'], () => {
    resolve(require('@/views/statistics/visitRepeat.vue'))
  })
}

const patrol = resolve => {
  require.ensure(['@/views/patrol/demo.vue'], () => {
    resolve(require('@/views/patrol/demo.vue'))
  })
}

const cameraDataTransform = resolve => {
  require.ensure(['@/views/statistics/cameraDataTransform.vue'], () => {
    resolve(require('@/views/statistics/cameraDataTransform.vue'))
  })
}

const manyTimes = resolve => {
  require.ensure(['@/views/dev/timesMatch.vue'], () => {
    resolve(require('@/views/dev/timesMatch.vue'))
  })
}

const config = resolve => {
  require.ensure(['@/views/brand/config.vue'], () => {
    resolve(require('@/views/brand/config.vue'))
  })
}

const scanRecord = resolve => {
  require.ensure(['@/views/customer/ScanRecord.vue'], () => {
    resolve(require('@/views/customer/ScanRecord.vue'))
  })
}

const companionList = resolve => {
  require.ensure(['@/views/customer/companionList.vue'], () => {
    resolve(require('@/views/customer/companionList.vue'))
  })
}
const companionDetail = resolve => {
  require.ensure(['@/views/customer/companionDetail.vue'], () => {
    resolve(require('@/views/customer/companionDetail.vue'))
  })
}

const atdDayReport = resolve => {
  require.ensure(['@/views/attendance/dayReport.vue'], () => {
    resolve(require('@/views/attendance/dayReport.vue'))
  })
}

const atdMonthReport = resolve => {
  require.ensure(['@/views/attendance/monthReport.vue'], () => {
    resolve(require('@/views/attendance/monthReport.vue'))
  })
}

const atdMonthReportDetail = resolve => {
  require.ensure(['@/views/attendance/monthReportDetail.vue'], () => {
    resolve(require('@/views/attendance/monthReportDetail.vue'))
  })
}

const deviceMonitor = resolve => {
  require.ensure(['@/views/device/deviceMonitor.vue'], () => {
    resolve(require('@/views/device/deviceMonitor.vue'))
  })
}

const deviceStopTimes = resolve => {
  require.ensure(['@/views/device/deviceStopTimes.vue'], () => {
    resolve(require('@/views/device/deviceStopTimes.vue'))
  })
}

const deviceLiveDetail = resolve => {
  require.ensure(['@/views/device/deviceLiveDetail.vue'], () => {
    resolve(require('@/views/device/deviceLiveDetail.vue'))
  })
}

const ruleSetting = resolve => {
  require.ensure(['@/views/system/ruleSetting.vue'], () => {
    resolve(require('@/views/system/ruleSetting.vue'))
  })
}

const addNewStore = resolve => {
  require.ensure(['@/views/store/addNewStore.vue'], () => {
    resolve(require('@/views/store/addNewStore.vue'))
  })
}

const editStore = resolve => {
  require.ensure(['@/views/store/editStore.vue'], () => {
    resolve(require('@/views/store/editStore.vue'))
  })
}

const photosCompare = resolve => {
  require.ensure(['@/views/dev/photosCompare.vue'], () => {
    resolve(require('@/views/dev/photosCompare.vue'))
  })
}

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/', component: () => import('@/views/index') },

  {
    path: '/b',
    component: Layout,
    redirect: '/b/blank',
    children: [
      {
        path: '/b/blank',
        component: () => import('@/views/blank'),
        name: 'Blank',
        hidden: true
      }
    ]
  },
  {
    path: '/bigScreen',
    name: 'BigScreen',
    component: () => import('@/views/bigScreen/index'),
    hidden: true
  },
  {
    path: '/m',
    component: Layout,
    redirect: '/m/dashboard',
    children: [
      {
        path: '/m/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: '首页',
          icon: homepage,
          opend: 'close',
          actIcon: homepageWhite,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/st',
    component: Layout,
    redirect: '/st/statistics/analyse',
    name: 'PassengerFlow',
    meta: {
      title: '客流统计',
      icon: passengerflow,
      opend: 'close',
      actIcon: passengerflowWhite
    },
    children: [
      {
        path: '/st/statistics/analyse',
        component: analyse,
        name: 'StatisticsAnalyse',
        meta: { title: '客流分析', icon: 'list', keepAlive: true }
      },
      {
        path: '/st/statistics/storeCompared',
        component: storeCompared,
        name: 'StasticsCompare',
        meta: { title: '门店对比', icon: 'list', keepAlive: true }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys/store/setup',
    name: 'SystemManage',
    meta: {
      title: '系统管理',
      icon: account,
      opend: 'close',
      actIcon: accountWhite
    },
    children: [
      {
        path: '/sys/store/setup',
        name: 'StoreManage',
        component: storeSetup,
        meta: { title: '门店管理', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/sp/store/device/addNewStore',
            name: 'addStore',
            component: addNewStore,
            meta: { title: '新增门店', icon: 'list' }
          },
          {
            path: '/sp/store/device/editStore',
            name: 'editStore',
            component: editStore,
            meta: { title: '编辑门店', icon: 'list' }
          }
        ]
      },
      {
        path: '/sp/store/device/list',
        name: 'DeviceList',
        component: deviceList,
        meta: { title: '添加设备', icon: 'list', keepAlive: true }
      },
      {
        path: '/sys/account/list',
        name: 'AccountManage',
        component: accountList,
        meta: { title: '账号管理', icon: 'list', keepAlive: true }
      },
      {
        path: '/sys/account/role',
        name: 'RoleManage',
        component: roleList,
        meta: { title: '角色管理', icon: 'list', keepAlive: true }
      },
      {
        path: '/sys/account/staffManager',
        name: 'staffManager',
        component: staffManager,
        meta: { title: '员工管理', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/sys/account/addStaffManager',
            name: 'addStaffManager',
            component: addStaffManager,
            meta: { title: '新增子账号', icon: 'list' }
          },
          {
            path: '/sys/account/editStaffManager',
            name: 'editStaffManager',
            component: editStaffManager,
            meta: { title: '编辑子账号', icon: 'list' }
          }
        ]
      },
      {
        path: '/sys/ruleSetting',
        component: ruleSetting,
        name: 'RuleSetting',
        meta: {
          title: '规则设置'
        }
      },
      {
        path: '/sys/log',
        component: logxshanghu,
        name: 'CustomerLog',
        meta: {
          title: '操作日志',
          icon: brandIcon,
          opend: 'close',
          actIcon: brandIconWhite,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/op',
    component: Layout,
    redirect: '/op/manage/brand',
    name: 'MengManage',
    meta: {
      title: '小萌运营',
      icon: store,
      opend: 'close',
      actIcon: storeWhite
    },
    children: [
      {
        path: '/op/manage/brand',
        component: brand,
        name: 'BrandManage',
        meta: {
          title: '品牌管理',
          icon: brandIcon,
          opend: 'close',
          actIcon: brandIconWhite,
          keepAlive: true
        }
      },
      {
        path: '/op/manage/config',
        name: 'ConfigManage',
        component: config,
        meta: { title: '参数设置', icon: 'list', keepAlive: true }
      },
      {
        path: '/op/manage/log',
        component: logxiaomeng,
        name: 'LogXiaomeng',
        meta: {
          title: '操作日志',
          icon: brandIcon,
          opend: 'close',
          actIcon: brandIconWhite,
          keepAlive: true
        }
      },
      {
        path: '/op/device/deviceMonitor',
        component: deviceMonitor,
        name: 'DeviceMonitor',
        meta: { title: '设备监控', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/op/device/deviceStopTimes',
            component: deviceStopTimes,
            name: 'DeviceStopTimes',
            meta: { title: '报停记录', icon: 'list' }
          },
          {
            path: '/op/device/deviceLiveDetail',
            component: deviceLiveDetail,
            name: 'DeviceLiveDetail',
            meta: { title: '报活记录', icon: 'list' }
          }
        ]
      }
    ]
  },
  {
    path: '/pt',
    component: Layout,
    redirect: '/pt',
    // meta: { title: '视频巡店' },
    children: [
      {
        path: '/pt',
        component: patrol,
        name: 'VideoStore',
        meta: {
          title: '视频巡店',
          icon: brandIcon,
          opend: 'close',
          actIcon: brandIconWhite,
          keepAlive: true
        }
      }
    ]
  },
  {
    path: '/cr',
    component: Layout,
    redirect: '/cr/customer/list',
    name: 'CustomerManage',
    meta: {
      title: '顾客管理',
      icon: store,
      opend: 'close',
      actIcon: storeWhite
    },
    children: [
      {
        path: '/cr/customer/list',
        name: 'CustomerList',
        component: customer,
        meta: { title: '顾客列表', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/cr/customer/list/detail',
            name: 'CustomerDetail',
            component: cusRecordDetail,
            meta: { title: '顾客详情', icon: 'list' }
          }
        ]
      },
      {
        path: '/cr/customer/tagList',
        name: 'TagList',
        component: tagList,
        meta: { title: '顾客标签', icon: 'list', keepAlive: true }
      }
    ]
  },
  {
    path: '/lm',
    component: Layout,
    redirect: '/cr/customer/whiteList',
    name: 'ListManage',
    meta: {
      title: '名单管理',
      icon: store,
      opend: 'close',
      actIcon: storeWhite
    },
    children: [
      {
        path: '/cr/customer/whiteList',
        name: 'WhiteList',
        component: whiteList,
        meta: { title: '白名单', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/cr/customer/whiteList/detail',
            name: 'CustomerDetail',
            component: cusRecordDetail,
            meta: { title: '白名单详情', icon: 'list' }
          }
        ]
      },
      {
        path: '/cr/customer/blackList',
        name: 'blackList',
        component: blackList,
        meta: { title: '黑名单', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/cr/customer/blackList/detail',
            name: 'blackListDetail',
            component: blackListDetail,
            meta: { title: '黑名单详情', icon: 'list' }
          }
        ]
      }
    ]
  },
  {
    path: '/dev',
    component: Layout,
    redirect: '/dev/statistics/visitorData',
    name: 'DeveloperTest',
    meta: {
      title: '开发测试',
      icon: passengerflow,
      opend: 'close',
      actIcon: passengerflowWhite
    },
    children: [
      {
        path: '/dev/statistics/visitorData',
        name: 'VisitData',
        component: visitData,
        meta: { title: '到店数据', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/photosCompare',
        name: 'PhotosCompare',
        component: photosCompare,
        meta: { title: '照片核对', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/cr/customer/photosCompare/detail',
            name: 'CustomerDetail',
            component: cusRecordDetail,
            meta: { title: '顾客详情', icon: 'list' }
          }
        ]
      },
      {
        path: '/dev/statistics/visitCount',
        name: 'VisitCount',
        component: visitCount,
        meta: { title: '顾客统计', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/visitor',
        name: 'VisitorNum',
        component: visitor,
        meta: { title: '顾客人数', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/visitRecord',
        name: 'VisitRecord',
        component: visitRecord,
        meta: { title: '顾客人次', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/visitUnrecognized',
        name: 'VisitUnrecognized',
        component: visitUnrecognized,
        meta: { title: '不可识别', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/visitRepeat',
        name: 'VisitRepeat',
        component: visitRepeat,
        meta: { title: '去重人次', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/statistics/cameraDataTransform',
        name: 'CameraDataTransform',
        component: cameraDataTransform,
        meta: { title: '数据转发', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/customer/manyTimes',
        name: 'MatchTimes',
        component: manyTimes,
        meta: { title: '匹配人次', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/scan/record',
        name: 'ScanRecord',
        component: scanRecord,
        meta: { title: '扫码记录', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/customer/companionList',
        name: 'CompanionList',
        component: companionList,
        meta: { title: '结伴人群', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/customer/companionDetail',
        name: 'CompanionDetail',
        component: companionDetail,
        meta: { title: '结伴明细', icon: 'list', keepAlive: true }
      }
    ]
  },
  {
    path: '/dev',
    component: Layout,
    redirect: '/dev/attendance/dayReport',
    name: 'MengAttendance',
    meta: {
      title: '小萌考勤',
      icon: attendance,
      opend: 'close',
      actIcon: attendanceWhite
    },
    children: [
      {
        path: '/dev/attendance/dayReport',
        name: 'DailyStatistics',
        component: atdDayReport,
        meta: { title: '每日统计', icon: 'list', keepAlive: true }
      },
      {
        path: '/dev/attendance/monthReport',
        name: 'MonthlySummary',
        component: atdMonthReport,
        meta: { title: '月度汇总', icon: 'list', keepAlive: true },
        children: [
          {
            path: '/dev/attendance/monthReport/detail',
            name: 'MonthlyDetail',
            component: atdMonthReportDetail,
            meta: { title: '打卡详情', icon: 'list' }
          }
        ]
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
