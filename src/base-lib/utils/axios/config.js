import * as cfg from 'idxConfig'
import * as cfgOnline from 'idxConfigOnline'
import * as cfgMainland from 'idxConfigMainland'

let useCfg = cfg

switch (process.env.NODE_ENV) {
case 'production':
  useCfg = cfgOnline
  break
case 'pro_dev_aliyun':
  useCfg = cfgMainland
  break
default:
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
