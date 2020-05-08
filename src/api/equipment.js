import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/devices/list',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/devices/add',
    method: 'post',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: '/devices/delete',
    method: 'delete',
    params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/devices/update',
    method: 'post',
    params
  })
}
