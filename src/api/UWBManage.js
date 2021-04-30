import request from '@/utils/request'

export function reqUWBInfo(data) {
  return request({
    url: '/uwbsys',
    method: 'get',
    params: data
  })
}

export function addUWBInfo(data) {
  return request({
    url: '/uwbsys',
    method: 'post',
    data: data
  })
}

export function deleteUWBInfo(params, data) {
  return request({
    url: `/uwbsys/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewUWBInfo(params, data) {
  return request({
    url: `uwbsys/${params}`,
    method: 'put',
    data: data
  })
}