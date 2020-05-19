import { Axios } from '../../utils/axios'

class RestfulReq {
  constructor (reqUrl, config = {}) {
    this.reqUrl = reqUrl
    this.config = config
  }

  setReqUrl (url) {
    this.reqUrl = url
  }

  getReqUrl () {
    return this.reqUrl
  }

  setConfig (config) {
    this.config = config
  }

  getConfig () {
    return this.config
  }

  /**
     * 请求数据
     * @param suffixUrl
     * @param url
     * @param query
     */
  reqGet (query, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      Axios.get(url, {
        params: query,
        ...theObj.config
      })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  /**
     * post 请求
     * @param formData
     * @param suffixUrl
     * @param url
     * @returns {Promise<any>}
     */
  reqPost (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      Axios.post(url, formData, theObj.config)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  fileUpload (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      Axios.post(url, formData,
        {
          headers: {
            'Content-type': 'multipart/form-data;charset=UTF-8'
          },
          ...theObj.config
        })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  /**
     * put 请求
     * @param formData
     * @param suffixUrl
     * @param url
     * @returns {Promise<any>}
     */
  reqPut (formData, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      Axios.put(url, formData, theObj.config)
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }

  /**
     * delete 请求
     * @param query
     * @param suffixUrl
     * @param url
     * @returns {Promise<any>}
     */
  reqDelete (query, suffixUrl = '', url = this.reqUrl + suffixUrl) {
    const theObj = this
    return new Promise((resolve, reject) => {
      Axios.delete(url,
        {
          params: query,
          ...theObj.config
        })
        .then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

export default RestfulReq
