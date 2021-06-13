import request from '@/utils/request'

export function getDeviceMonitorList(options) {
  return request.post('/device/monitor', options)
}

export function getDeviceStopList(options) {
  return request.post('/device/monitor/record/stop', options)
}

export function getDeviceLiveList(options) {
  return request.post('/device/monitor/record', options)
}
