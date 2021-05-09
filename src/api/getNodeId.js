import request from '@/utils/request'

export function reqNodeId() {
  return request({
    url: '/select/devnode',
    method: 'get',
  })
}
