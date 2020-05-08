import request from '@/utils/request'

// 查询
export function flowList(params) {
  return request({
    url: '/flow/findCompletedProcessByUser',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/collect-device/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/collect-device/update',
    method: 'post',
    data: params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/collect-device/${params.id}/delete`,
    method: 'delete'
  })
}

