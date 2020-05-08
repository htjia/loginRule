import request from '@/utils/request'

// 查询
export function query(params) {
  return request({
    url: '/tasklog/list',
    method: 'get',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/tasklog/${params}/delete/`,
    method: 'delete'
  })
}

// 详情
export function detail(params) {
  return request({
    url: `/tasklog/${params}/detail/`,
    method: 'get'
  })
}

// 删除所有
export function removeAll() {
  return request({
    url: `/tasklog/all/delete/`,
    method: 'delete'
  })
}
