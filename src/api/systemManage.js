import request from '@/utils/request'

export function reqDev(data) {
  return request({
    url: '/node/all',
    method: 'get',
    params: data
  })
}

export function addDev(data) {
  return request({
    url: '/node',
    method: 'post',
    data: data
  })
}

export function deleteDev(params, data) {
  return request({
    url: `/node/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewDev(params, data) {
  return request({
    url: `node/${params}`,
    method: 'put',
    data: data
  })
}