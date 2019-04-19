import dayjs from 'dayjs'
import './css/index.css'
import pyq from './image/pyq.png'
// const pyq  = require('./image/pyq.png')

console.log(dayjs().format('YYYY-mm-dd'))
console.log('watch 文件');

document.body.innerHTML = 'dd123'
const img = document.createElement('img')
img.src = pyq
document.body.appendChild(img)
console.warn('node server');
console.error('hot 1');
