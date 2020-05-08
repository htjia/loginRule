import request from '@/utils/request'

// 查询
export function flowList(params) {
  return request({
    url: '/flow/findRunningProcessByUser',
    method: 'get',
    params
  })
}

// 终止
export function endTask(params) {
  return request({
    url: `/flow/endTask`,
    method: 'delete',
    params
  })
}

