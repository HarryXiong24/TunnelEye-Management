import request from '@/utils/request'

export function reqDepartment() {
  return request({
    url: '/department',
    method: 'get',
  })
}

export function addDepartment(data) {
  return request({
    url: '/department',
    method: 'post',
    data: data
  })
}

export function deleteDepartment(params) {
  return request({
    url: `/department/${params}`,
    method: 'delete',
  })
}

export function reviewDepartment(params, data) {
  return request({
    url: `/department/${params}`,
    method: 'put',
    data: data
  })
}