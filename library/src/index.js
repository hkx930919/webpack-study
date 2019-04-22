/**
 * 解析类似url上的参数，a=1&b=2&c=3
 * @param {String} key      参数的key值   
 * @param {String} query    要解析的字符串，如果不传默认取url上的search参数
 */
export function getDataFromUrl(key,query){
    const queryData = query || window.location.search.slice(1)
    const regx = new RegExp(`(^|&)${key}=([^&]*)(&|$)`)
    const result =  queryData.match(regx)
    return result?result[2]:null
}


