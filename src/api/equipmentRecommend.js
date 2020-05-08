import request from '@/utils/request'

// 产品list
export function productList(params) {
  return request({
    url: '/eqptRecommend/ProductList',
    method: 'get',
    params
  })
}
// 推荐
export function eqptMouldRecommend(params) {
  return request({
    url: '/eqptRecommend/EqptMouldRecommend',
    method: 'get',
    params
  })
}
// 工单报废趋势
export function compScrapRateTrend(params) {
  return request({
    url: '/eqptRecommend/CompScrapRateTrend',
    method: 'get',
    params
  })
}
