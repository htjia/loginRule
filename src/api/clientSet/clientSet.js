import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/collect-site/query',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/collect-site/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/collect-site/update',
    method: 'put',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/collect-site/${params.id}/delete`,
    method: 'delete'
  })
}
// 查询关联字段
export function getSiteDevice(params) {
  return request({
    url: '/site-device/query',
    method: 'get',
    params
  })
}
// 关联字段ing
export function addSiteDevice(params) {
  return request({
    url: '/site-device/add',
    method: 'post',
    data: params
  })
}

// 删除关联字段
export function removeSiteDevice(params) {
  return request({
    url: `/site-device/${params.id}/delete`,
    method: 'delete'
  })
}
