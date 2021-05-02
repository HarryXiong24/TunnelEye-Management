import request from '@/utils/request'

export function reqUserInfo(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function addUserInfo(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

export function deleteUserInfo(params, data) {
  return request({
    url: `/user/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewUserInfo(params, data) {
  return request({
    url: `/user/${params}`,
    method: 'put',
    data: data
  })
}
