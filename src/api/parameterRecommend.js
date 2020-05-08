import request from '@/utils/request'

// 设备查询
export function queryEquipment(params) {
  return request({
    url: '/sparkHandle/loadEqpt',
    method: 'get',
    params
  })
}
// 产品list
export function productList(params) {
  return request({
    url: '/eqptRecommend/ProductList',
    method: 'get',
    params
  })
}
// 查询产品
export function queryProduct(params) {
  return request({
    url: '/sparkHandle/loadProduct',
    method: 'get',
    params
  })
}
// 查询模具
export function queryMould(params) {
  return request({
    url: '/paramRecommend/MouldList',
    method: 'get',
    params
  })
}
// 查询材料
export function rawList(params) {
  return request({
    url: '/paramRecommend/RawList',
    method: 'get',
    params
  })
}
// 参数推荐
export function eqptParam(params) {
  return request({
    url: '/paramRecommend/EqptParam',
    method: 'get',
    params
  })
}
