import request from '@/utils/request'

// 获取工单对比数据
export function getPlanConstuct(params) {
  return request({
    url: '/productReject/getPlanConstuct',
    method: 'get',
    params
  })
}

// 参数对比
export function eqptParamsConstuct(params) {
  return request({
    url: '/productReject/eqptParamsConstuct',
    method: 'get',
    params
  })
}

// 参数对比
export function scrapReasonscrapThan(params) {
  return request({
    url: 'scrapReason/scrapThan',
    method: 'get',
    params
  })
}

