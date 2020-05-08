import request from '@/utils/request'

// 查询
export function findTree(params) {
  return request({
    url: '/Menu/findTree',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/Menu/insert',
    method: 'post',
    data: params
  })
}
// 编辑
export function update(params) {
  return request({
    url: '/Menu/update',
    method: 'put',
    data: params
  })
}

// 删除用户
export function remove(params) {
  return request({
    url: `/Menu/${params}/delete`,
    method: 'delete'
  })
}

// 获取路由权限
export function getRouters(params) {
  return request({
    url: '/Menu/leftMenuTree',
    method: 'get',
    params
  })
}

