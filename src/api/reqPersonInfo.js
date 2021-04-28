import request from '@/utils/request'

export function reqPersonInfo(date) {
  return request({
    url: '/PersonInfo',
    method: 'get',
    params: date
  })
}