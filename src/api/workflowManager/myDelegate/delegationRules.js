import request from '@/utils/request'

// 查询
export function ruleList(params) {
  return request({
    url: '/entrustRule/list',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/entrustRule/insert',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/entrustRule/update',
    method: 'put',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/entrustRule/${params.id}/delete`,
    method: 'delete',
    params
  })
}

// 我的流程
export function findMyProcess(params) {
  return request({
    url: '/flow/findProcess',
    method: 'get',
    params
  })
}
