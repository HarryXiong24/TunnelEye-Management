import request from '@/utils/request'

export function reqSystemLog(data) {
  return request({
    url: '/log',
    method: 'get',
    params: data
  })
}

export function deleteSystemLog(params, data) {
  return request({
    url: `/log/${params}`,
    method: 'delete',
    data: data
  })
}
