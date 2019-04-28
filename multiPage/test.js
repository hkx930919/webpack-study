const fs = require('fs')
const path = require('path')

const PAGES_DIR = './src/pages/'

// const files = fs.readdirSync(PAGES_DIR)
// console.log(files)

// files.filter(dir => {
// 	let filePath = path.join(PAGES_DIR, dir, 'index.js')
// 	if (!file.existsSync(filePath)) {
// 		filePath = `${filePath}x`
// 	}
// 	if (!file.existsSync(filePath)) {
// 		return false
// 	}
// 	return true
// })

function getPages() {
	return fs.readdirSync(PAGES_DIR).filter(dir => {
		let filePath = path.join(PAGES_DIR, dir, 'index.js')
		if (!fs.existsSync(filePath)) {
			filePath = `${filePath}x`
		}
		if (!fs.existsSync(filePath)) {
			return false
		}
		return true
	})
}
getPages().forEach(dir => {
	console.log(path.basename(dir))
})

fs.readFile('./src/pages/second/index.html', (err, res) => {
	let con = res.toString()
	console.log(con)
})
