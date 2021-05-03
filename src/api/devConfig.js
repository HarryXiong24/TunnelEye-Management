import request from '@/utils/request'

export function reqDevConfig(data) {
  return request({
    url: '/nodeconf',
    method: 'get',
    params: data
  })
}

export function addDevConfig(data) {
  return request({
    url: '/nodeconf',
    method: 'post',
    data: data
  })
}

export function deleteDevConfig(params, data) {
  return request({
    url: `/nodeconf/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewDevConfig(params, data) {
  return request({
    url: `/nodeconf/${params}`,
    method: 'put',
    data: data
  })
}