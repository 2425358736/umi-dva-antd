import { routerRedux } from 'dva/router'
import request from '../utils/request'

export const http: string = 'http://47.94.1.251:9200'

export function getRequest(url) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Authorization')
      }
    }).then(
      (response) => {
        const resultData = response
        resolve(resultData)
        // resolve(data)

      }
    ).catch((error) => {
      reject(error)
    })
  })
}

export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: params,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Authorization')
      }
    }).then(
      (response) => {
        const resultData = response
        resolve(resultData)
      }
    ).catch((error) => {
      reject(error)
    })
  })
}

export function deleteRequest(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'delete',
      body: {
        ...params,
      },
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Authorization')
      }
    }).then(
      (response) => {
        const resultData = response
        resolve(resultData)
      }
    ).catch((error) => {
      reject(error)
    })
  })
}

export function postFormDateRequest(url, params) {
  let paramstr = ''
  for ( let key in params ) {
    if (key) {
      paramstr = paramstr + key + '=' + params[key] + '&'
    }
  }
  if (paramstr !== '') {
    paramstr = paramstr.substr(0, paramstr.length - 1)
  }
  let headers = {}
  if (url !== '/api-auth/oauth/token') {
      headers = { Authorization: 'Bearer ' + localStorage.getItem('Authorization')}
    }
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: paramstr,
      headers: headers
    })
      .then(response => {
        const resultData = response
        if (typeof resultData !== 'undefined') {
          resolve(resultData)
        } else {
          resolve(resultData)
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}
