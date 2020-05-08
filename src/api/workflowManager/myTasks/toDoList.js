import request from '@/utils/request'

// 查询
export function taskList(params) {
  return request({
    url: '/flow/findTask',
    method: 'get',
    params
  })
}

// 办理
export function completeTask(params) {
  return request({
    url: '/flow/completeTask',
    method: 'post',
    params
  })
}

// 回退
export function fallBackTask(params) {
  return request({
    url: '/flow/fallBackTask',
    method: 'post',
    params
  })
}

// 转办
export function turnSendTask(params) {
  return request({
    url: '/flow/turnSendTask',
    method: 'post',
    params
  })
}

// 详情
export function detail(params) {
  return request({
    url: '/common-interface/detail',
    method: 'get',
    params
  })
}
// 获取办理form
// 查询用户
export function findTaskForm(params) {
  return request({
    url: '/flow/findTaskForm',
    method: 'get',
    params
  })
}
