import request from '@/utils/request'

// 查询
export function deptList(params) {
  return request({
    url: '/department/query',
    method: 'post',
    params
  })
}

// 添加
export function add(parentCode, deptName) {
  return request({
    url: '/department/save',
    method: 'post',
    params: {
      parentCode,
      deptName
    }
  })
}
// 修改
export function update(id, deptName) {
  return request({
    url: '/department/save',
    method: 'post',
    params: {
      id,
      deptName
    }
  })
}

// 删除
export function remove(code) {
  return request({
    url: `/department/${code}/delete`,
    method: 'delete',
    params: {
      code
    }
  })
}

// 详情
export function detail(code) {
  return request({
    url: '/department/query',
    method: 'post',
    params: {
      code
    }
  })
}
