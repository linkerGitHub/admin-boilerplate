import * as cfg from 'idxConfig'

export default {
  baseURL: cfg.serverUrl,
  timeout: 10000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Authorization': '123456789'
  }
}
