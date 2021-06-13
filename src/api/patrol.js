import request from '@/utils/request'

export function uploadScreenShot(options) {
  return request.post('patrol/upload', options)
}

export function listScreenShot(options) {
  return request.post('patrol/screenshot/list', options)
}

export function getLiveAddress(options) {
  return request.post('patrol/live', options)
}

export function getMonitorConfig(options) {
  return request.post('patrol/monitor/config', options)
}

export function listMonitorPeriodOptions(options) {
  return request.post('patrol/monitor/period', options)
}

export function deleteScreenShot(options) {
  return request.post('patrol/screenshot/delete', options)
}

export function listPermissionTreeForPatrol(options) {
  return request.post('patrol/permission/tree', options)
}

export function listPatrolCameraByStructId(options) {
  return request.post('patrol/camera/list', options)
}
