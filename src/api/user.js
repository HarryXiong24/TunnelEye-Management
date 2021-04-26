import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/login',
//     method: 'post', 
//     data: data, 
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//       'captcha': sessionStorage.getItem('captcha'),
//     }
//   })
// }

export function getInfo(token) {
  return request({
    url: '/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/',
    method: 'post'
  })
}
