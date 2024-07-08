import request from '@/utils/request'

// 登录方法
// export function login(username, password, code, uuid) {
//   const data = {
//     username,
//     password,
//     code,
//     uuid
//   }
//   return request({
//     url: '/login',
//     headers: {
//       isToken: false,
//       repeatSubmit: false
//     },
//     method: 'post',
//     data: data
//   })
// }

// // 注册方法
// export function register(data) {
//   return request({
//     url: '/register',
//     headers: {
//       isToken: false
//     },
//     method: 'post',
//     data: data
//   })
// }

// 获取用户详细信息
// export function getInfo() {
//   return request({
//     url: '/getInfo',
//     method: 'get'
//   })
// }

// // 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
// export function getCodeImg() {
//   return request({
//     url: '/captchaImage',
//     headers: {
//       isToken: false
//     },
//     method: 'get',
//     timeout: 20000
//   })
// }

export function orderInfo(orderId,email,imei) {
  return request({
    url: '/business/line/checkOrder?' +'orderId='+ orderId+"&email="+email+"&imei="+imei,
    method: 'get'
  })
}
export function confirmClaim(orderId,email,imei) {
  return request({
    url: '/business/line/boundDevice?' +'orderId='+ orderId+"&email="+email+"&imei="+imei,
    method: 'get'
  })
}
export function userProfile(userId) {
  return request({
    url: '/business/line/isFollow?userId='+userId,
    method: 'get'
  })
}