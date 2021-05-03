import request from '@/utils/request'

export function submitNews(data) {
  return request({
    url: '/submitNews',
    method: 'post',
    data: data
  })
}
