import request from '@/utils/service'

export function reqPersonInfo(date) {
  return request({
    url: '/PersonInfo',
    method: 'get',
    params: date
  })
}