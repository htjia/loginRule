import request from '@/utils/request'

// 设备查询
export function queryEquipment(params) {
  return request({
    url: '/sparkHandle/loadEqpt',
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
    url: '/sparkHandle/loadMould',
    method: 'get',
    params
  })
}
// 综合查询
export function integratedQuery(params) {
  return request({
    url: '/sparkHandle/submitJob',
    method: 'get',
    params
  })
}
// 设置阈值
export function saveThreshold(params) {
  return request({
    url: '/sparkHandle/saveThreshold',
    method: 'post',
    params
  })
}
// 查看详情
export function findDetail(params) {
  return request({
    url: '/sparkHandle/findDetail',
    method: 'get',
    params
  })
}
