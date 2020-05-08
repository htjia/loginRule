import request from '@/utils/request'

// 查询
export function getList(code, name) {
  return request({
    url: '/factory/query',
    method: 'post',
    params: {
      code,
      name
    }
  })
}

// 添加
export function add(parentCode, name) {
  return request({
    url: '/factory/save',
    method: 'post',
    params: {
      parentCode,
      name
    }
  })
}
// 修改
export function update(id, name) {
  return request({
    url: '/factory/save',
    method: 'post',
    params: {
      id,
      name
    }
  })
}

// 删除
export function remove(code) {
  return request({
    url: '/factory/delete',
    method: 'post',
    params: {
      code
    }
  })
}

// 详情
export function detail(code) {
  return request({
    url: '/factory/query',
    method: 'post',
    params: {
      code
    }
  })
}
