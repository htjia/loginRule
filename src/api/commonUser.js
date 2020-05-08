import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/common-interface/sys-user',
    method: 'get',
    params
  })
}
