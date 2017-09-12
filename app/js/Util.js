const _ = require('lodash'),
	Enum = require('../enum.json')

class Matrix {
	static rotate(matrix) {	//[[1, 1, 1], [0, 1, 0]]
		let source = matrix.data,
			rows = source.length,
			destination = []

		for (const index in source[0]) {
			destination.push([])
		}

		for (let index = source.length - 1; index >= 0; index--) {
			const row = source[index]

			for (const index1 in row) {
				const value = row[index1]
				destination[index1].push(value)
			}
		}

		return destination
	}

	static highestNonEmptyRow(matrix) {
		matrix = matrix.data
		for (let index = 0; index < matrix.length - 1; index++) {
			const empty = matrix[index].filter(value => {return value !== 0})
			if (empty.length) {
				return index
			}
		}
	}

	static generate(width, height, fill=0) {
		let arr = []
		for (let index = 0; index < height; index++) {
			arr.push(_.fill(Array(width), fill))
		}
		return arr
	}

	static removeRow(matrix, index) {
		let width = matrix.width
		matrix = _.clone(matrix.data)

		for (let index1 = index; index1 > 0; index1--) {
			matrix[index1] = matrix[index1 - 1]
		}
		matrix[0] = _.fill(Array(width), 0)
		return matrix
	}

	static intersect(source, destination, x = 0, y = 0) {
		source = source.data
		destination = destination.data

		if (y >= destination.length) {
			return false
		}
		let sX = -1, sY = -1
		for (let dY = y; dY < y + source.length; dY++) {
			sY++
			if (x >= destination[dY].length) {
				return false
			}
			for (let dX = x; dX < x + source[sY].length; dX++) {
				sX++
				// console.log(x, y, dX, dY, sX, sY, source[sY][sX], destination[dY][dX])
				if (!!source[sY][sX] && !!destination[dY][dX]) {
					return true
				}
			}
			sX = -1
		}
		return false
	}

	static edge(matrix, edge = Enum.GAME.DIRECTION.DOWN) {
		if (typeof edge === 'undefined') {
			return matrix
		}
		let { width, height } = matrix
		let x, y, width2, height2

		switch(edge) {
			case Enum.GAME.DIRECTION.RIGHT:
				x = width - 1
				y = 0
				width2 = 1
				height2 = height
				break
			case Enum.GAME.DIRECTION.DOWN:
				x = 0
				y = height - 1
				width2 = width
				height2 = 1
				break
			case Enum.GAME.DIRECTION.LEFT:
				x = 0
				y = 0
				width2 = 1
				height2 = height - 1
				break
			case Enum.GAME.DIRECTION.UP:
				x = 0
				y = 0
				width2 = width - 1
				height2 = 1
				break
		}

		return Matrix.subset(matrix, x, y, width2, height2)
	}

	static subset(matrix, x, y, width, height) {
		let arr = [], arr1

		for (let index = y; index < matrix._data.length; index++) {
			arr1 = []
			for (let index1 = x; index1 < matrix._data[index].length; index1++) {
				arr1.push(matrix._data[index][index1])
			}
			arr.push(arr1)
		}

		return arr
	}

	static join(source, destination, x = 0, y = 0) {
		source = source.data
		destination = destination.data

		let curX = -1, curY = -1, clone = _.clone(destination)
		for (let index = y; index < destination.length; index++) {
			curX = -1

			if (++curY > source.length - 1) {
				break
			}

			for (let index1 = x; index1 < destination[index].length; index1++) {
				if (++curX > source[curY].length - 1) {
					break
				}

				clone[index][index1] = source[curY][curX]
			}
		}
		return clone
	}

	static log(matrix) {
		let str = ''
		for (let index in matrix) {
			for (let index1 in matrix[index]) {
				str += matrix[index][index1] + ' '
			}
			str += '\n'
		}
		console.log(str + '\n')
	}
}

class _Math {
	static range(lo, hi) {
		let arr = []
		for (let index = lo; index < hi; index++) {
			arr.push(index)
		}
		return arr
	}

	static randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}
}

class Color {
	static Hex(value) {
		return `0x${value}`
	}

	static CSSHex(value) {
		return `#${value}`
	}
}

class _Benchmark {
	constructor() {
		this.cache = {}
	}

	run(fn) {
		if (typeof fn === 'function') {
			let start = Date.now()

			fn.call()
			this.log(fn.name, Date.now() - start)
		}
	}

	start(name) {
		if (!(name in this.cache)) {
			this.cache[name] = Date.now()
		}
	}

	end(name) {
		if (name in this.cache) {
			this.log(name, Date.now() - this.cache[name])
			delete this.cache[name]
		}
	}

	log(name, ms) {
		console.log(`${name} completed execution in ${ms}ms.`)
	}
}
const Benchmark = new _Benchmark()

const Util = { Color, Matrix, Math: _Math, Benchmark }
export default Util
