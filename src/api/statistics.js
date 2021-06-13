import request from '@/utils/request'

export function getVisitRecord(options) {
  return request.post('/statistics/visit/record', options)
}

export function getSearchCondition(options) {
  return request.post('/dic/store', options)
}

export function getCameraOption(options) {
  return request.post('/statistics/cameras/option', options)
}

export function getPeopleList(options) {
  return request.post('/statistics/people/list', options)
}

export function listVisitCount(options) {
  return request.post('statistics/visitcount', options)
}

export function getShopOption(options) {
  return request.post('statistics/shop/option', options)
}

export function getDataTabTableData(options) {
  return request.post('statistics/data/statistics', options)
}

export function getPeriodEchartsData(options) {
  return request.post('statistics/echarts/period', options)
}

// 客流统计——客流概况——客流时段分布 (15日交付版本接口)
export function getPersonPeriod(options) {
  return request.post('statistics/person/period', options)
}

export function getDataTabLineData(options) {
  return request.post('statistics/data/statistics/lineargraph', options)
}

export function getDataTabBarData(options) {
  return request.post('statistics/data/statistics/histogram', options)
}

export function getTimesEchartsData(options) {
  return request.post('statistics/echarts/times', options)
}

export function getSexsEchartsData(options) {
  return request.post('statistics/echarts/sexattribute', options)
}

export function getAgeStageEchartsData(options) {
  return request.post('statistics/echarts/agestage', options)
}

export function getSexStatisticsClient(options) {
  return request.post('statistics/echarts/client/gender', options)
}

export function getSexStatisticsClientTrend(options) {
  return request.post('statistics/echarts/client/gendertrend', options)
}

export function getAgeStatisticsClient(options) {
  return request.post('statistics/echarts/client/agestage', options)
}

export function getAgeStatisticsClientTrend(options) {
  return request.post('statistics/echarts/client/agestagetrend', options)
}
// 客流统计——客流概况——进店客流统计 (15日交付版本接口)
export function personStatisticsDemo(options) {
  return request.post('statistics/person/statistics', options)
}

// 客流统计——客流概况——客流趋势 (15日交付版本接口)
export function personTrendDemo(options) {
  return request.post('statistics/person/trend', options)
}

// 不可识别顾客进店次数dev
export function getVisitUnrecognized(options) {
  return request.post('/statistics/visit/unrecognized', options)
}

// 去重人次列表dev
export function getVisitRepeat(options) {
  return request.post('/statistics/visit/repeat', options)
}

export function listTransformCamera() {
  return request.post('/statistics/camera/transform')
}

export function listUnTransFormCameraOptions(options) {
  return request.post('statistics/camera/untransform/options', options)
}

export function addTransformCamera(options) {
  return request.post('statistics/camera/transform/add', options)
}

export function deleteTransformCamera(options) {
  return request.post('statistics/camera/transform/delete', options)
}

export function fetchStatisticsAnalyseData(options) {
  return request.post('statistics/analyse', options)
}

export function fetchStatisticsGenderData(options) {
  return request.post('statistics/gender', options)
}

export function fetchStatisticsAgeData(options) {
  return request.post('statistics/age', options)
}

export function fetchStatisticsCustomerData(options) {
  return request.post('statistics/customer', options)
}

export function fetchStatisticsTimesData(options) {
  return request.post('statistics/times', options)
}

export function saveStatisticsTimesRange(options) {
  return request.post('statistics/times/range/save', options)
}

export function getStatisticsTimesRange() {
  return request.post('statistics/times/range/get')
}

export function getStatisticsDayData(options) {
  return request.post('statistics/day/data', options)
}

export function fetchMonthReportData(options) {
  return request.post('report/month/charts', options)
}

export function reportMonthList(options) {
  return request.post('report/month/list', options)
}

export function fetchWeekReportData(options) {
  return request.post('report/week/charts', options)
}

export function reportWeekList(options) {
  return request.post('report/week/list', options)
}

export function listScanRecord(options) {
  return request.post('customer/scan/list', options)
}

export function getDevVisitData(options) {
  return request.post('dev/visit/data', options)
}
export function getPermissionCameraOption(options) {
  return request.post('permission/camera/options', options)
}

// 客流分析-客流趋势
export function analyseTrend(options) {
  return request.post('analyse/chart/trend', options)
}

// 门店对比-客流趋势
export function comparedTrend(options) {
  return request.post('statistics/compare/trend', options)
}

// 门店对比-到店时段
export function comparedPeriod(options) {
  return request.post('statistics/compare/period', options)
}

// 门店对比-性别分布
export function comparedGender(options) {
  return request.post('statistics/compare/gender', options)
}

// 门店对比-年龄分布
export function comparedAge(options) {
  return request.post('statistics/compare/age', options)
}
