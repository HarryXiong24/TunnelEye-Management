import axios from 'axios'

const BASE_URL = process.env.VUE_APP_BASE_API

// 获取验证码
export const reqCaptcha = () => {

  let promise = axios({
    method: 'GET', 
    url: BASE_URL + '/captcha',
    withCredentials: false,
    responseType: 'arraybuffer'
  })
  
  return new Promise(function (resolve, reject) {
    promise.then(function (response) {
      // 成功了调用resolve()
      resolve(response)
    }).catch(function (error) {
      //失败了调用reject()
      reject(error)
    })
  })
}