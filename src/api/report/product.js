import request from '@/utils/request'

// 产品信息总览
export function productReject(params) {
  return request({
    url: '/productReject/productReject',
    method: 'get',
    params
  })
}
// 产品报废趋势
export function productEverydayTrend(params) {
  return request({
    url: '/productReject/productEverydayTrend',
    method: 'get',
    params
  })
}
// 产品报废率排名
export function rejectRatioSort(params) {
  return request({
    url: '/productReject/rejectRatioSort',
    method: 'get',
    params
  })
}
// 产品稳定性排名
export function rejectStabilitySort(params) {
  return request({
    url: '/productReject/rejectStabilitySort',
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
