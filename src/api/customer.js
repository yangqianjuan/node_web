import request from '@/utils/request'

export function getCustomerList(options) {
  return request.post('/customer/list', options)
}

export function getWhiteCustomerList(options) {
  return request.post('/customer/white/list', options)
}

export function removeWhiteCustomer(options) {
  return request.post('/customer/white/remove', options)
}

export function operationCustomer(options) {
  return request.post('/customer/operation', options)
}

export function getCustomerStatistics(options) {
  return request.post('customer/info/statistics', options)
}

export function getCustomerTimes(options) {
  return request.post('customer/info/detail', options)
}

export function getCustomerCount(options) {
  return request.post('customer/info/count', options)
}

export function listCustomerBreakdown(options) {
  return request.post('customer/breakdown', options)
}

export function fetchCustomerDetailByWeek(options) {
  return request.post('customer/detail/week', options)
}

export function fetchCustomerDetailByHour(options) {
  return request.post('customer/detail/hour', options)
}

export function partnershipList(options) {
  return request.post('partnership/list', options)
}

export function getIdentityOptions(options) {
  return request.post('options/list', options)
}

export function partnershipDeatailList(options) {
  return request.post('companions/detail', options)
}
export function getCustomerOption(options) {
  return request.post('options/list', options)
}
export function getCheckResultInfo(options) {
  return request.post('companions/detail/examine', options)
}
export function updateCheckResultInfo(options) {
  return request.post('submit/examine/result', options)
}
export function postPombineCutomerList(options) {
  return request.post('customer/identity/merge', options)
}
export function removeRecord(options) {
  return request.post('customer/face/remove', options)
}
export function postAllToBeAuditedList(options) {
  return request.post('customer/detail/audit', options)
}

export function addToWhiteList(options) {
  return request.post('options/list', options)
}

export function getStoreOption(options) {
  return request.post('get/store/inbrand', options)
}
export function getAgeGroupOption(options) {
  return request.post('options/list', options)
}
export function getWhiteCustomerInfo(options) {
  return request.post('get/white/customer/info', options)
}

export function getBlackList(options) {
  return request.post('customer/black/list', options)
}

export function addBlack(options) {
  return request.post('customer/add/black', options)
}

export function removeBlack(options) {
  return request.post('customer/black/remove', options)
}

export function addToBlack(options) {
  return request.post('customer/add/black', options)
}

export function saveBlack(options) {
  return request.post('customer/black/save', options)
}
export function postWithdrawMember(options) {
  return request.post('customer/member/cancel', options)
}
export function postRegisterMember(options) {
  return request.post('customer/register/member', options)
}
export function customerUpdateMember(options) {
  return request.post('customer/update/member', options)
}
export function postTagChecked(options) {
  return request.post('customer/customer/label', options)
}
export function getLabelList(options) {
  return request.post('customer/get/label/list', options)
}

export function getTagList(options) {
  return request.post('tag/list', options)
}

export function updateTag(options) {
  return request.post('tag/update', options)
}

export function deleteTag(options) {
  return request.post('tag/delete', options)
}

export function saveTag(options) {
  return request.post('tag/save', options)
}
export function customerLabelRemove(options) {
  return request.post('customer/label/remove', options)
}
