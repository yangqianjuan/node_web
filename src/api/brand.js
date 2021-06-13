import request from '@/utils/request'

export function getBrandList(options) {
  return request.post('/brand/list', options)
}

export function addBrand(options) {
  return request.post('/brand/add', options)
}

export function getBrandInfo(options) {
  return request.post('/brand/info', options)
}

export function saveUpdate(options) {
  return request.post('/brand/update', options)
}

export function saveDelete(options) {
  return request.post('/brand/delete', options)
}

export function getOptions(options) {
  return request.post('/brand/options', options)
}

export function getBrandOptions(options) {
  return request.post('/brand/get/options', options)
}

export function getSysAdminInfo(options) {
  return request.post('/brand/sysadmin/info', options)
}

export function updateSysAdmin(options) {
  return request.post('/brand/update/sysAdmin', options)
}
export function saveConfig(options) {
  return request.post('/brand/config/save', options)
}

export function toEditConfig(options) {
  return request.post('brand/config/toedit', options)
}

export function getCfgDefult(options) {
  return request.post('brand/config/tosave/default', options)
}

export function listConfig(options) {
  return request.post('brand/config/list', options)
}

export function deleteConfig(options) {
  return request.post('brand/config/delete', options)
}

export function checkConfig(options) {
  return request.post('brand/config/check', options)
}
export function listStoreOptions(options) {
  return request.post('brand/config/store/options', options)
}

export function listBrandOptions(options) {
  return request.post('brand/config/brand/options', options)
}
