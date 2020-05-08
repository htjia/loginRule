import request from '@/utils/request'

// 班次信息总览
export function everyShiftReject(params) {
  return request({
    url: '/ShiftReject/everyShiftReject',
    method: 'get',
    params
  })
}
// 异常最多的班次
export function mostResonShift(params) {
  return request({
    url: '/ShiftReject/mostResonShift',
    method: 'get',
    params
  })
}
// 生产总数对比
export function everyUserDaNum(params) {
  return request({
    url: '/ShiftReject/everyUserDaNum',
    method: 'get',
    params
  })
}
// 报废总数对比
export function everyUserRejectNum(params) {
  return request({
    url: '/ShiftReject/everyUserRejectNum',
    method: 'get',
    params
  })
}
// 班次每天报废趋势分析
export function everydayShiftRject(params) {
  return request({
    url: '/ShiftReject/everydayShiftRject',
    method: 'get',
    params
  })
}
