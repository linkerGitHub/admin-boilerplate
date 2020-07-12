import * as cfg from 'idxConfig'
import * as cfgOnline from 'idxConfigOnline'
import * as cfgMainland from 'idxConfigMainland'

let useCfg = cfg

console.log(process.env)
switch (process.env.BASE_URL) {
case 'aliyun':
  useCfg = cfgMainland
  break
default:
  console.log(process.env.NODE_ENV)
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
