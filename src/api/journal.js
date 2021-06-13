import request from '@/utils/request'

export function getJournalListXm(options) {
  return request.post('/journal/list/xm', options)
}

export function getJournalListCus(options) {
  return request.post('/journal/list/cus', options)
}

export function getJournalBrandOption(options) {
  return request.post('/journal/brandId/options', options)
}
export function getJournalModelOption(options) {
  return request.post('/journal/model/options', options)
}
export function getJournalActionOption(options) {
  return request.post('/journal/action/options', options)
}
