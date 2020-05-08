import request from '@/utils/request'

// 设备下拉列表
export function getEqptList(params) {
  return request({
    url: '/processPrediction/getEqptList',
    method: 'get',
    params
  })
}
// 预测统计
export function oneEqptPrediction(params) {
  return request({
    url: '/processPrediction/oneEqptPrediction',
    method: 'get',
    params
  })
}
// 预测趋势
export function predictedTrends(params) {
  return request({
    url: '/processPrediction/oneEqptEveryShiftPrediction',
    method: 'get',
    params
  })
}
// 预测趋势
export function predictedTrendLists(params) {
  return request({
    url: '/processPrediction/getOneAnyDayEqptPrediction',
    method: 'get',
    params
  })
}
