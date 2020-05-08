import request from '@/utils/request'

// 查询
export function query(params) {
  return request({
    url: '/timerenginee/list',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/timerenginee/save',
    method: 'post',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/timerenginee/${params}/delete/`,
    method: 'delete'
  })
}

// 详情
export function detail(params) {
  return request({
    url: `/timerenginee/${params}/detail/`,
    method: 'get'
  })
}
