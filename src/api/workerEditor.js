import request from '@/utils/request'

export function reqWorkerEditor(date) {
  return request({
    url: '/workEditor',
    method: 'get',
    params: date
  })
}

export function reqDeleteWorker(date) {
  return request({
    url: '/deleteWorker',
    method: 'get',
    params: date
  })
}

export function addWorker(date) {
  return request({
    url: '/addWorker',
    method: 'get',
    params: date
  })
}