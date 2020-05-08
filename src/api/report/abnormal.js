import request from '@/utils/request'

// 班次信息总览
export function everyShiftReject(params) {
  return request({
    url: '/ShiftReject/everyShiftReject',
    method: 'get',
    params
  })
}
// 总览信息
export function summary(params) {
  return request({
    url: '/scrapReason/summary',
    method: 'get',
    params
  })
}
// 报废构成
export function reason(params) {
  return request({
    url: '/scrapReason/reason',
    method: 'get',
    params
  })
}
// 报废构成detail
export function reasonDetail(params) {
  return request({
    url: '/scrapReason/reasonDetail',
    method: 'get',
    params
  })
}
// 产品对比
export function productThan(params) {
  return request({
    url: '/scrapReason/productThan',
    method: 'get',
    params
  })
}
// 全部产品table
export function productList(params) {
  return request({
    url: '/scrapReason/productList',
    method: 'get',
    params
  })
}
// 全部产品select
export function productOptions(params) {
  return request({
    url: '/scrapReason/productBox',
    method: 'get',
    params
  })
}

