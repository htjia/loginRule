import request from '@/utils/request'

// 查询
export function query(params) {
  return request({
    url: '/engineeBusiness/findAll',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/engineeBusiness/save',
    method: 'post',
    params
  })
}

// 编辑
export function update(params) {
  return request({
    url: '/engineeBusiness/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/engineeBusiness/${params}`,
    method: 'delete'
  })
}

// 详情
export function detail(params) {
  return request({
    url: `/engineeBusiness/${params}/detail/`,
    method: 'get'
  })
}
