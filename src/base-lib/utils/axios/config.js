import * as cfg from 'idxConfig'
import * as cfgOnline from 'IdxConfigOnline'

export default {
  baseURL: process.env.NODE_ENV === 'development' ? cfg.serverUrl : cfgOnline.serverUrl,
  timeout: 10000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}
