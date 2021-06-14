import request from '@/utils/request'
import crypto from 'crypto'

export function login(username, password) {
  const hash = crypto.createHash('md5')
  hash.update(password)
  password = hash.digest('hex')
  return request.post('/user/login', { username, password })
}

// export function login(username, password) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data: { username, password }
//   })
// }

export function getInfo(token) {
  return request.get('/user/info', {
    token
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    params: { token }
  })
}
