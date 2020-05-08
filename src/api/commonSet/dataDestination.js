import request from '@/utils/request'

// 查询
export function dataDestList(params) {
  return request({
    url: '/data-direct/query',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/data-direct/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/data-direct/update',
    method: 'put',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/data-direct/${params.id}/delete`,
    method: 'delete'
  })
}
// 查询关联字段
export function getDirctFiled(params) {
  return request({
    url: '/dirct-filed/query',
    method: 'get',
    params
  })
}
// 关联字段ing
export function addParams(params) {
  return request({
    url: '/dirct-filed/add',
    method: 'post',
    data: params
  })
}

// 删除关联字段
export function removeRelation(params) {
  return request({
    url: `/dirct-filed/${params.id}/delete`,
    method: 'delete'
  })
}
