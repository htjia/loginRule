import request from '@/utils/request'

// 修改密码
export function updatePwd(params) {
  return request({
    url: '/user/updatePwd',
    method: 'put',
    params
  })
}

// 详细信息
export function configInfo(id) {
  return request({
    url: `/user/${id}/detail`,
    method: 'get'
  })
}

// 配置ing
export function saveUserDetail(params) {
  return request({
    url: '/user/SaveUserDetail',
    method: 'post',
    data: params
  })
}
// 重置密码
export function restPassWord(params) {
  return request({
    url: '/user/restPassWord',
    method: 'post',
    params
  })
}

// 流程图管理查询
export function findModel(params) {
  return request({
    url: '/flow/findModel',
    method: 'get',
    params
  })
}

// 删除流程图
export function deleteModel(params) {
  return request({
    url: `/flow/deleteModel`,
    method: 'delete',
    params
  })
}

// 发布流程图
export function releaseModel(params) {
  return request({
    url: `/flow/releaseModel`,
    method: 'post',
    params
  })
}

// 创建流程图
export function createModule(params) {
  return request({
    url: `/flow/createModule`,
    method: 'post',
    params
  })
}

// 查询流程监控
export function findAllTask(params) {
  return request({
    url: `/flow/findAllTask`,
    method: 'get',
    params
  })
}

// 激活流程监控
export function activateTask(params) {
  return request({
    url: `/flow/activateTask`,
    method: 'post',
    params
  })
}

// 删除流程监控
export function endTask(params) {
  return request({
    url: `/flow/endTask`,
    method: 'delete',
    params
  })
}

// 查询流程监控详情
export function findTaskForm(params) {
  return request({
    url: `/flow/findTaskForm`,
    method: 'get',
    params
  })
}

// 挂起流程监控
export function hangTask(params) {
  return request({
    url: `/flow/hangTask`,
    method: 'post',
    params
  })
}

// 跳过流程监控
export function skipTask(params) {
  return request({
    url: `/flow/skipTask`,
    method: 'post',
    params
  })
}

// 查询流程列表
export function findProcess(params) {
  return request({
    url: `/flow/findProcess`,
    method: 'get',
    params
  })
}

// 查询通过用户流程列表
export function findCompletedProcessByUser(params) {
  return request({
    url: `/flow/findCompletedProcessByUser`,
    method: 'get',
    params
  })
}

// 激活流程列表
export function activateProcess(params) {
  return request({
    url: `/flow/activateProcess`,
    method: 'post',
    params
  })
}

// 删除流程列表
export function deleteProcess(params) {
  return request({
    url: `/flow/deleteProcess`,
    method: 'delete',
    params
  })
}

// 流程图展示
export function flowImage(params) {
  return request({
    url: `/flow/flowImage`,
    method: 'get',
    params
  })
}

// 流程图展示
export function interfaceDetail(params) {
  return request({
    url: `/common-interface/detail`,
    method: 'get',
    params
  })
}

// 流程图挂起
export function hangProcess(params) {
  return request({
    url: `/flow/hangProcess`,
    method: 'post',
    params
  })
}
// 流程图修改
export function editModel(params) {
  return request({
    url: `/flow/editModel`,
    method: 'post',
    params
  })
}

// 表单管理
export function flowFormList(params) {
  return request({
    url: `/flowForm/list`,
    method: 'get',
    params
  })
}

// 表单管理增加
export function flowFormSaveForm(params) {
  return request({
    url: `/flowForm/saveForm`,
    method: 'post',
    data: params
  })
}

// 表单管理删除
export function flowFormRemoveForm(params) {
  return request({
    url: `/flowForm/` + params.id + `/removeForm`,
    method: 'delete',
    params
  })
}

// 流程分类管理查询
export function pcmQuery(params) {
  return request({
    url: `/pcm/query`,
    method: 'get',
    params
  })
}

// 流程分类管理删除
export function pcmDelete(params) {
  return request({
    url: `/pcm/` + params.id + `/delete`,
    method: 'get',
    params
  })
}

// 流程管理修改
export function pcmUpdate(params) {
  return request({
    url: `/pcm/update`,
    method: 'post',
    data: params
  })
}

// 流程分类添加
export function pcmAdd(params) {
  return request({
    url: `/pcm/add`,
    method: 'post',
    data: params
  })
}

// 发起流程列表
export function findMyProcess(params) {
  return request({
    url: `/flow/findMyProcess`,
    method: 'get',
    params
  })
}

// 发起流程查看
export function findStartForm(params) {
  return request({
    url: `/flow/findStartForm`,
    method: 'get',
    params
  })
}

// 确定发起流程有taskid
export function completeTask(params) {
  return request({
    url: `/flow/completeTask`,
    method: 'post',
    params
  })
}

// 确定发起流程无taskid
export function completestart(params) {
  return request({
    url: `/flow/start`,
    method: 'post',
    params
  })
}
