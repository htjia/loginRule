import request from '@/utils/request'

// 查询
export function logList(params) {
  return request({
    url: '/uploadLog/logList',
    method: 'get',
    params
  })
}
