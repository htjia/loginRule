import request from '@/utils/request'

// 查询
export function deviceList(params) {
  return request({
    url: '/collect-device/query',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/collect-device/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/collect-device/update',
    method: 'post',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/collect-device/${params.id}/delete`,
    method: 'delete'
  })
}
// 配置
export function config(params) {
  return request({
    url: '/collect-type/add',
    method: 'post',
    data: params
  })
}
// 查询配置
export function getConfig(params) {
  return request({
    url: '/collect-type/query-Single',
    method: 'get',
    params
  })
}

export function fileUpload(params) {
  return request({
    url: '/collect-type/upload',
    method: 'post',
    data: params
  })
}
