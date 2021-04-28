import request from '@/utils/request'

export function reqWorkEditor(date) {
  return request({
    url: '/workEditor',
    method: 'get',
    params: date
  })
}