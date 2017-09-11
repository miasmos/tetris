import Util from './Util'
const uuid = require('uuid/v4')

//2-dimensional
export default class Matrix {
	constructor(data) {
		this.width = 0
		this.height = 0
		this.id = uuid()
		this._data = [[], []]
		if (typeof data !== 'undefined') {
			this.data = data
		}
	}

	generate(width, height, fill=0) {
		this.data = Util.Matrix.generate(width - 1, height - 1, fill)
	}

	set(x, y, value) {
		if (y > -1 && y < this.data.length - 1 && x > -1 && x < this.data[y].length - 1) {
			this.data[y][x] = value
		}
	}

	get(x, y) {
		if (y > -1 && y < this.data.length - 1 && x > -1 && x < this.data[y].length - 1) {
			return this.data[y][x]
		}
		return false
	}

	overwrite(data) {
		this.data = data
	}

	log() {
		Util.Matrix.log(this._data)
	}

	get data() {
		return this._data
	}

	set data(data) {
		this._data = data
		this.width = data[0].length
		this.height = data.length
	}
}