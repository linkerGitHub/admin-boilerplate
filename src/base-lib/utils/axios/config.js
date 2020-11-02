import * as cfg from 'idxConfig'
import * as cfgOnline from 'idxConfigOnline'
import * as cfgMainland from 'idxConfigMainland'

let useCfg = cfg

switch (process.env.VUE_APP_MY_ENV) {
case 'aliyun':
  useCfg = cfgMainland
  break
case 'docker':
  useCfg = JSON.parse(process.env.IDX_APP_CONFIG)
  break
default:
  if(process.env.NODE_ENV === 'production') {
    useCfg = cfgOnline
  }
  break
}

export default {
  baseURL: useCfg.serverUrl,
  timeout: 10000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}
