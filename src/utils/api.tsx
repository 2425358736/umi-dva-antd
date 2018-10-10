import { routerRedux } from 'dva/router'
import request from '../utils/request'

export const http: string = 'http://127.0.01:8282'

export function post(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: {
        ...params,
      },
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
