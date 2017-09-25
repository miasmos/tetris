import Util from './Util'
const uuid = require('uuid/v4'),
	_ = require('lodash')

//2-dimensional
export default class Matrix {
	constructor(data) {
		this.width = 0
		this.height = 0
		this.id = uuid()
		this._data = [[], []]
		this.nonEmptyRows = undefined
		this.dirty = true
		if (typeof data !== 'undefined') {
			this.data = data
		}
	}

	generate(width, height, fill=0) {
		this.data = Util.Matrix.generate(width - 1, height - 1, fill)
	}

	set(x, y, value) {
		if (y > -1 && y < this.data.length && x > -1 && x < this.data[y].length) {
			this.data[y][x] = value
			return true
		}
		return false
	}

	get(x, y) {
		if (y > -1 && y < this.data.length && x > -1 && x < this.data[y].length) {
			return this.data[y][x]
		}
		return false
	}

	overwrite(data) {
		this.data = data
	}

	log() {
		Util.Matrix.log(this.data)
	}

	getNonEmptyRows() {
		if (this.dirty) {
			let arr = []
			for (let index = 0; index < this.data.length; index++) {
				if (this.data[index].indexOf(0) === -1) arr.push(index)
			}
			this.nonEmptyRows = arr
			this.dirty = false
			return arr
		} else {
			return this.nonEmptyRows
		}
	}

	isEmpty() {
		for (let index in this.data) {
			if (this.data[index].filter(value => {return value === 1}).length) {
				return false
			}
		}
		return true
	}

	get data() {
		return this._data
	}

	set data(data) {
		this._data = _.clone(data)
		this.width = data[0].length
		this.height = data.length
		this.dirty = true
	}
}