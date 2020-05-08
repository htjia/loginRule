import request from '@/utils/request'

// 生产过程预测统计信息
export function getWholeFore(params) {
  return request({
    url: '/processPrediction/getWholeFore',
    method: 'get',
    params
  })
}
// 按指定范围请求各设备预测情况
export function everyEqptPrediction(params) {
  return request({
    url: '/processPrediction/everyEqptPrediction',
    method: 'get',
    params
  })
}
