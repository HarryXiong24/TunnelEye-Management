import request from '@/utils/request'

export function reqManageWork(data) {
  return request({
    url: '/duty',
    method: 'get',
    params: data
  })
}

export function addManageWork(data) {
  return request({
    url: '/duty',
    method: 'post',
    data: data
  })
}

export function deleteManageWork(params, data) {
  return request({
    url: `/duty/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewManageWork(params, data) {
  return request({
    url: `/duty/${params}`,
    method: 'put',
    data: data
  })
}