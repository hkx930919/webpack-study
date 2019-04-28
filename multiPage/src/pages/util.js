console.log('this is util.js')

export function log(params) {
	console.log(params)
}
export function warn(params) {
	console.warn(params)
}
export function error(params) {
	console.error(params)
}
export function add(a, b) {
	console.log(a + b)
}
export function reduce(c, d) {
	console.log(c - d)
}
export default {
	log,
	warn,
	error,
	add,
	reduce
}
