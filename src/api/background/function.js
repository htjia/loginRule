import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/function/findList',
    method: 'get',
    params
  })
}

// 添加
export function save(params) {
  return request({
    url: '/function/save',
    method: 'post',
    params
  })
}

// 删除用户
export function remove(params) {
  return request({
    url: '/function/delete',
    method: 'delete',
    params
  })
}
