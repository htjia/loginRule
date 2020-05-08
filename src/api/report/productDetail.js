import request from '@/utils/request'

// 产品信息总览
export function oneOverview(params) {
  return request({
    url: '/productReject/oneOverview',
    method: 'get',
    params
  })
}
// 产品报废趋势
export function oneProductPlanTrend(params) {
  return request({
    url: '/productReject/oneProductPlanTrend',
    method: 'get',
    params
  })
}
// 报废原因123
export function productTrend(params) {
  return request({
    url: '/productReject/productTrend',
    method: 'get',
    params
  })
}
// 差异对比list
export function oneProductPlanList(params) {
  return request({
    url: '/productReject/oneProductPlanList',
    method: 'get',
    params
  })
}
// 查看原数据
export function everyOneReject(params) {
  return request({
    url: '/productReject/everyOneReject',
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

