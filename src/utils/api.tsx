import request from '../utils/request'
import router from 'umi/router'
import moment from 'moment'

export const http: string = 'http://123.206.19.217:8081'

export function getRequest(url) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'GET',
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

export function postRequest(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'POST',
      body: {
        ...params,
      }
    }).then(
      (response) => {
        const resultData = response
        if (typeof resultData !== 'undefined') {
          if (resultData.code === 120) {
            router.push('/login')
          } else {
            resolve(resultData)
          }
        } else {
          resolve(resultData)
        }
      }
    ).catch((error) => {
      reject(error)
    })
  })
}

export function putRequest(url, params) {
  return new Promise((resolve, reject) => {
    request(http + url, {
      method: 'PUT',
      body: {
        ...params,
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
/**
 * 导出export
 */
export async function exportExcel(url, params, list) {
  const filters = JSON.parse(JSON.stringify(params.filters))
  const pagination = JSON.parse(JSON.stringify(params.pagination))
  const params1 = { filters, pagination }
  const paramsOne = JSON.parse(JSON.stringify(params1))
  jsonString(paramsOne.filters)
  if (
    paramsOne.pagination.field === null ||
    typeof paramsOne.pagination.field === 'undefined' ||
    paramsOne.pagination.field === ''
  ) {
    paramsOne.pagination.field = 'a.id'
    paramsOne.pagination.order = 'desc'
  }
  paramsOne.pagination.current = 0
  paramsOne.pagination.pageSize = 999999999
  paramsOne.export = 'export'
  const arr = []
  list.forEach(json => {
    const json2 = {}
    json2.title = json.title
    json2.column = json.column
    json2.columnStr = json.columnStr
    arr.push(json2)
  })
  paramsOne.export = arr
  await postRequest(url, paramsOne)
  window.location.href = `${http}/upload/excel`
}
/* eslint-disable */
/**
 * 参数处理方法
 * @param json
 */
export function jsonString(json) {
  for (const key in json) {
    if (Array.isArray(json[key])) {
      if (key.indexOf('Date') >= 0) {
        let arr = []
        json[key].forEach(str => {
          arr.push(moment(str).format('YYYY-MM-DD'))
        })
        json[key] = arr
      } else {
        let kg = false
        json[key].forEach((json2, i) => {
          if (typeof json2 === 'object') {
            jsonString(json2)
          } else if (typeof json2 !== 'undefined') {
            json2 = json2.toString()
            kg = true
          }
        })
        if (kg) {
          json[key] = json[key].toString()
        }
      }
      if (json[key].length <= 0) {
        json[key] = null
      }
    } else {
      if (
        json[key] !== null &&
        typeof json[key] !== 'undefined' &&
        typeof json[key] !== '' &&
        key.indexOf('Date') >= 0
      ) {
        json[key] = moment(json[key]).format('YYYY-MM-DD')
      }
    }
  }
}
function exportExcelGet(url, params) {
  window.open(`${http}/upload/excel?list=${params}`)
}
