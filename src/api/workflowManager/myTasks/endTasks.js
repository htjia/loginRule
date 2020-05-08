import request from '@/utils/request'

// 查询
export function historyTasks(params) {
  return request({
    url: '/flow/historyTasks',
    method: 'get',
    params
  })
}

// 撤销
export function withdraw(params) {
  return request({
    url: '/flow/withdraw',
    method: 'post',
    params
  })
}
