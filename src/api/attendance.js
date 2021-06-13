import request from '@/utils/request'

export function sendLateEmail(options) {
  return request.post(
    'send/late/email',
    options
  )
}

export function getAttendanceDayReport(options) {
  return request.post(
    'get/attendance/day/report',
    options
  )
}

export function getAttendanceMonthReport(options) {
  return request.post(
    'get/attendance/month/report',
    options
  )
}

export function getAttendanceMonthReportPeople(options) {
  return request.post(
    'get/attendance/month/report/people',
    options
  )
}

export function getAttendanceNameOptions(options) {
  return request.post(
    'get/attendance/name/options',
    options
  )
}
