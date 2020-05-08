import request from '@/utils/request'

export function getPoint() {
  return request({
    url: 'point/points',
    method: 'get'
  })
}
