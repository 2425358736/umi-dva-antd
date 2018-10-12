import { routerRedux } from 'dva/router'
import request from '../utils/request'

export const http: string = 'http://127.0.01:9000'

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
