import request from '@/utils/request'

// 查询
export function queryList(params) {
  return request({
    url: '/entrustRecord/list',
    method: 'get',
    params
  })
}
