import {createAxios} from '@/base-lib/utils/axios'

export function login(data) {
  return createAxios({
    method: 'post',
    url: '/user/login'
  }).request({
    data
  })
}

export function getStreet(params) {
  return createAxios({
    method: 'get',
    url: '/street'
  }).request({
    params
  })
}

export function getPlace(params) {
  return createAxios({
    method: 'get',
    url: '/place'
  }).request({
    params
  })
}

export function getTimeStage(params) {
  return createAxios({
    method: 'get',
    url: '/time-stage'
  }).request({
    params
  })
}
