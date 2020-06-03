import Axios from 'axios'

export function login(data) {
  return Axios.create({
    method: 'post',
    url: '/user/login'
  }).request({
    data
  })
}
