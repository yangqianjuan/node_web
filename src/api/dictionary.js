import request from '@/utils/request'

export function fetchDictionary(options) {
  return request.post('dic/store', options)
}

export function getOrgStructDic(options) {
  return request.post('dic/org/struct', options)
}

export function listOrgStructDic(options) {
  return request.post('dic/org/struct/list', options)
}

export function saveOrgStructDic(options) {
  return request.post('dic/org/struct/save', options)
}

export function updateOrgStructDic(options) {
  return request.post('dic/org/struct/update', options)
}

export function deleteOrgStructDic(options) {
  return request.post('dic/org/struct/delete', options)
}

export function fetchCamera() {
  return request.post('statistics/camera')
}

export function fetchStore(options) {
  return request.post('statistics/store', options)
}

export function fetchCustomerId() {
  return request.post('statistics/customerId')
}

export function fetchRegion(options) {
  return request.post('dic/region', options)
}
