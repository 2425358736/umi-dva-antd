import { routerRedux } from 'dva/router'
import request from '../utils/request'

export const http: string = 'http://47.94.1.251:9200'

const data = {
  'success': true,
  'code': 0,
  'message': '数据获取成功',
  'msg': null,
  'data': {
    'total': 14,
    'list': [
      {
        'id': 204,
        'userName': 'rina',
        'phone': '13854233396',
        'loginDate': '2018-09-29',
        'loginFlag': 1,
        'remark': '备注数据',
        'delFlag': 0,
        'departmentName': '测试部',
        'roleName': '测试',
        'loginFlag': 0,
      },
      {
        'id': 205,
        'userName': '测试2',
        'phone': '123464343',
        'loginDate': '2018-09-30',
        'loginFlag': 1,
        'remark': '备注数据',
        'delFlag': 0,
        'departmentName': '测试部',
        'roleName': '测试',
        'loginFlag': 1,
      }
    ]
  },
  'total': null
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: {
        ...params,
      },
      headers: {
        Authorization: localStorage.getItem('Authorization')
      }
    }).then(
      (response) => {
        const resultData = response
        // resolve(resultData)
        resolve(data)

      }
    ).catch((error) => {
      reject(data)
    })
  })
}

export function postFormDate(url, params) {
  let paramstr = ''
  for ( let key in params ) {
    if (key) {
      paramstr = paramstr + key + '=' + params[key] + '&'
    }
  }
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: paramstr,
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
