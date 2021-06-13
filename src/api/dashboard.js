import request from '@/utils/request'

export function listPermissionAreaTree(options) {
  return request.post('account/permission/area/tree', options)
}

export function listPermissionTree(options) {
  return request.post('account/permission/tree', options)
}

// 首页客流汇总
export function getHomeData(options) {
  return request.post('statistics/homepage/data', options)
}

// 首页客流量以及门店排名
export function getHomePersonTrend(options) {
  return request.post('statistics/homepage/persontrend', options)
}

// 性别分布
export function getGenderChart(options) {
  return request.post('dashboard/chart/gender', options)
}

// 年龄分布
export function getAgeChart(options) {
  return request.post('dashboard/chart/age', options)
}

// 到店时段
export function getTimeSlotChart(options) {
  return request.post('dashboard/chart/timeslot', options)
}
