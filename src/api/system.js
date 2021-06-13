import request from '@/utils/request'

export function getSettings(options) {
  return request.post('brand/get/rule/setting', options)
}

export function saveSettings(options) {
  return request.post('brand/save/rule/setting', options)
}
