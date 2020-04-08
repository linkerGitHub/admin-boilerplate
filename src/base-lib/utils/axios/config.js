import externalConfig from 'externalConfig'

export default {
    baseURL: externalConfig.server.api_base,
    timeout: 10000,
    responseType: 'json',
    withCredentials: true, // 是否允许带cookie这些
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
}
