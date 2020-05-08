import request from '@/utils/request'

// 设备信息总览
export function overview(params) {
  return request({
    url: '/eqptReject/overview',
    method: 'get',
    params
  })
}
// 设备停机分析
export function downReson(params) {
  return request({
    url: '/eqptReject/downReson',
    method: 'get',
    params
  })
}
// 设备报废率分析
export function rejectTrend(params) {
  return request({
    url: '/eqptReject/rejectTrend',
    method: 'get',
    params
  })
}
