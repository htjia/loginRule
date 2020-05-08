import request from '@/utils/request'

// 七天报废趋势
export function sevenDayReject(params) {
  return request({
    url: '/leadCockpit/sevenDayReject',
    method: 'get',
    params
  })
}
// 班次报废率
export function shiftList(params) {
  return request({
    url: '/leadCockpit/shiftList',
    method: 'get',
    params
  })
}
// 报废原因分析
export function reasonConstitute(params) {
  return request({
    url: '/scrapReason/reasonConstitute',
    method: 'get',
    params
  })
}
// 产品报废率
export function productList(params) {
  return request({
    url: '/leadCockpit/productList',
    method: 'get',
    params
  })
}
// 设备报废率前10
export function eqptList(params) {
  return request({
    url: '/leadCockpit/eqptList',
    method: 'get',
    params
  })
}
// 压铸工质检报废分析
export function workerList(params) {
  return request({
    url: '/leadCockpit/userList',
    method: 'get',
    params
  })
}
