import request from '@/utils/request'

export function reqNews(data) {
  return request({
    url: '/infos',
    method: 'get',
    params: data
  })
}

export function reqNewsDetail(data) {
  return request({
    url: '/info',
    method: 'get',
    params: data
  })
}


