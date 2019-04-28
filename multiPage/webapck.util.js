const path = require('path')
const fs = require('fs')
const PAGES_DIR = './src/pages/'
// 获取文件夹名称
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

module.exports = {
	getPages
}
