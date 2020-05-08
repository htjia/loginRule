import request from '@/utils/request'

// 查询
export function query(params) {
  return request({
    url: '/engineeBusinessSql/findByBusiness',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/engineeBusinessSql/save',
    method: 'post',
    params
  })
}

// 编辑
export function update(params) {
  return request({
    url: '/engineeBusinessSql/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/engineeBusinessSql/${params}`,
    method: 'delete'
  })
}
