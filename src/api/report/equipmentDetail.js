import request from '@/utils/request'

// 设备信息
export function oneEqptReject(params) {
  return request({
    url: '/eqptReject/oneEqptReject',
    method: 'get',
    params
  })
}
// 设备停机分析
export function onedownReson(params) {
  return request({
    url: '/eqptReject/onedownReson',
    method: 'get',
    params
  })
}
// oee
export function eqptOee(params) {
  return request({
    url: '/eqptReject/eqptOee',
    method: 'get',
    params
  })
}
// 每日停机
export function everydayDown(params) {
  return request({
    url: '/eqptReject/everydayDown',
    method: 'get',
    params
  })
}
// 每日报废率
export function everydayReject(params) {
  return request({
    url: '/eqptReject/everydayReject',
    method: 'get',
    params
  })
}
