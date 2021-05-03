import request from '@/utils/request'

export function reqUWBTagManage(data) {
  return request({
    url: '/label',
    method: 'get',
    params: data
  })
}

export function addUWBTagManage(data) {
  return request({
    url: '/label',
    method: 'post',
    data: data
  })
}

export function deleteUWBTagManage(params, data) {
  return request({
    url: `/label/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewUWBTagManage(params, data) {
  return request({
    url: `/label/${params}`,
    method: 'put',
    data: data
  })
}