import dayjs from 'dayjs'
import './css/index.css'
import pyq from './image/pyq.png'
import './other/d'
import {getDataFromUrl} from 'hkx-util'

// const pyq  = require('./image/pyq.png')

// import a from './a.js'
// import b from './b.js'
import(/* webpackChunkName: 'a' */'./a.js')
import(/* webpackChunkName: 'b' */'./b.js')
const res = getDataFromUrl('a','a=a&b=b')
console.log('=======',res);

// console.log('index import a',a);
// console.log('index import b',b);

console.log(dayjs().format('YYYY-mm-dd'))
console.log('watch 文件');

document.body.innerHTML = 'dd123'
const img = document.createElement('img')
img.src = pyq
document.body.appendChild(img)
console.warn('node server');
console.error('hot 1');
