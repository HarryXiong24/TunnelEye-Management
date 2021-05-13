import request from '@/utils/request'

export function reqNodeId() {
  return request({
    url: '/select/devnode',
    method: 'get',
  })
}

export function reqSysId() {
  return request({
    url: '/select/uwbsys',
    method: 'get',
  })
}

export function reqDepartmentId() {
  return request({
    url: '/select/department',
    method: 'get',
  })
}

export function reqGroupId() {
  return request({
    url: '/select/group',
    method: 'get',
  })
}

export function reqDepIdReview(params) {
  return request({
    url: '/select/department2',
    method: 'get',
    params: params,
  })
}

export function reqDepIdAdd() {
  return request({
    url: '/select/department2',
    method: 'get',
  })
}