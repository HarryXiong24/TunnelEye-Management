import request from '@/utils/request'

export function reqSensorInfo(data) {
  return request({
    url: '/sensor',
    method: 'get',
    params: data
  })
}

export function addSensor(data) {
  return request({
    url: '/sensor',
    method: 'post',
    data: data
  })
}

export function deleteSensor(params, data) {
  return request({
    url: `/sensor/${params}`,
    method: 'delete',
    data: data
  })
}

export function reviewSensor(params, data) {
  return request({
    url: `/sensor/${params}`,
    method: 'put',
    data: data
  })
}