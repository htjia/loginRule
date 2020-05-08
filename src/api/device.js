import request from '@/utils/request'

export function getList() {
  return request({
    url: '/user/findDev',
    method: 'get'
  })
}
