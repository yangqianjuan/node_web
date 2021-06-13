import request from '@/utils/request'

export function saveSaleData(options) {
  return request.post('sale/data/save', options)
}

export function querySaleData(options) {
  return request.post('query/sale/data', options)
}
