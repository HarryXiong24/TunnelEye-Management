import request from '@/utils/request'

export function reqGroup(data) {
  return request({
    url: '/group',
    method: 'get',
    params: data
  })
}

export function addGroup(data) {
  return request({
    url: '/group',
    method: 'post',
    data: data
  })
}

export function deleteGroup(params) {
  return request({
    url: `/group/${params}`,
    method: 'delete',
  })
}

export function reviewGroup(params, data) {
  return request({
    url: `/group/${params}`,
    method: 'put',
    data: data
  })
}

export function addWorker(data) {
  return request({
    url: '/group/user',
    method: 'post',
    data: data
  })
}

export function deleteWorker(data) {
  return request({
    url: `/group/user`,
    method: 'delete',
    data: data,
  })
}

export function bindLabel(data) {
  return request({
    url: `/group/user/label`,
    method: 'post',
    data: data,
  })
}