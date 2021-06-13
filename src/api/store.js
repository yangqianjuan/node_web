import request from '@/utils/request'

export function listStore(options) {
  return request.post('/store/list', options)
}

export function addStore(options) {
  return request.post('/store/add', options)
}

export function getStore(options) {
  return request.post('/store/info', options)
}

export function addDevice(options) {
  return request.post('/store/addDevice', options)
}

export function updateStore(options) {
  return request.post('/store/update', options)
}

export function deleteStore(options) {
  return request.post('/store/delete', options)
}

export function deleteStoreBatch(options) {
  return request.post('/store/delete/batch', options)
}

export function getStoreIdOptions(options) {
  return request.post('/get/storeId/options', options)
}

// 获取设备列表
export function getStoreDevice(options) {
  return request.post('/get/store/device', options)
}

// 设备列表添加设备
export function addDeviceFromStore(options) {
  return request.post('/store/list/addDevice', options)
}

// 设备列表编辑设备
export function editDeviceFromStore(options) {
  return request.post('/store/list/editDevice', options)
}
// 设备列表删除设备
export function delDeviceFromStore(options) {
  return request.post('/store/list/delDevice', options)
}
