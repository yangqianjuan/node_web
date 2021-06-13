import request from '@/utils/request'

export function listTimesMatch(options) {
  return request.post('dev/times/match', options)
}

export function getCapList(options) {
  return request.post('dev/get/toCheck', options)
}

export function getCheckedList(options) {
  return request.post('dev/get/checked', options)
}

export function checkPic(options) {
  return request.post('dev/check/pic', options)
}

export function batchCheckPic(options) {
  return request.post('dev/check/pic/batch', options)
}
