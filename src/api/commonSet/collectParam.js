import request from '@/utils/request'

// 查询
export function paramList(params) {
  return request({
    url: '/collect-param/query',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/collect-param/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/collect-param/update',
    method: 'put',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/collect-param/${params.id}/delete`,
    method: 'delete'
  })
}
