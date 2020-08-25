import {createAxios} from '@/base-lib/utils/axios'

export function login(data) {
  return createAxios({
    method: 'post',
    url: '/admin/login'
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

export function createPlace(data) {
  return createAxios({
    method: 'post',
    url: '/place'
  }).request({
    data
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

export function logout() {
  return createAxios({
    method: 'post',
    url: '/admin/logout'
  }).request({})
}

export function getPic(params) {
  return createAxios({
    method: 'get',
    url: '/pic'
  }).request({
    params
  })
}

export function getPicById(id) {
  return createAxios({
    method: 'get',
    url: '/pic/'+id
  }).request({})
}

export function getCollectionById(id) {
  return createAxios({
    method: 'get',
    url: '/collection/'+id
  }).request({})
}

export function updatePic(data) {
  return createAxios({
    method: 'put',
    url: '/pic'
  }).request({
    data
  })
}

export function modifyPass(data) {
  return createAxios({
    method: 'put',
    url: '/admin/password'
  }).request({
    data
  })
}
