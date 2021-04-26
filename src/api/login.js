import axios from 'axios'

const BASE_URL = process.env.VUE_APP_BASE_API

// 获取登录信息
export const reqLoginInfo = (loginMsg) => {
 
  console.log(sessionStorage.getItem('captcha'))

  let promise = axios({
    url: BASE_URL + '/login',
    method: 'post', 
    data: loginMsg, 
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'captcha': sessionStorage.getItem('captcha'),
    }
  })

  return new Promise(function (resolve, reject) {
    promise.then(function (response) {
      // 成功了调用resolve()
      console.log(response)
      resolve(response)
    }).catch(function (error) {
      //失败了调用reject()
      reject(error)
    })
  })
}