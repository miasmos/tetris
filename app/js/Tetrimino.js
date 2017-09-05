import math from 'mathjs'
import { Matrix } from './Util'
const config = require('../config.json'),
	Enum = require('../enum.json')

export default class Tetrimino {
	constructor(type) {
		const data = config.tetrimino[type]
		this.color = data.color
		this.index = data.index
		this.name = data.name

		this._matrix = undefined
		this.size = undefined
		this.width = undefined
		this.height = undefined

		this.matrices = {}
		this.direction = Enum.GAME.DIRECTION.NORTH

		// let maxX = 0, maxY = 0
		// for (let index in type.matrix) {
		// 	const value = type.matrix[index],
		// 		row = Math.floor(index / 4),
		// 		x = (index - (4 * row)) * config.game.blockSize,
		// 		y = row * config.game.blockSize

		// 	if (!!value) {
		// 		const block = new Block(this.color, x, y)
		// 		if (x > maxX) {
		// 			maxX = x
		// 		}
		// 		if (y > maxY) {
		// 			maxY = y
		// 		}
		// 		this.add(block)
		// 	}
		// }

		// this.width = maxX + config.game.blockSize
		// this.height = maxY + config.game.blockSize
		// this.x = _x
		// this.y = _y
	}

	set matrix(matrix) {
		this._matrix = matrix
		this.size = matrix.size()
		this.width = this.size[1]
		this.height = this.size[0]
	}

	get matrix() {
		return this._matrix
	}

	Orient(direction) {
		if (direction in this.matrices) {
			this.matrix = this.matrices[direction]
			this.direction = direction
		}

		return this.matrix
	}

	RotateCW() {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		if (this.direction === keys.length - 1) {
			this.direction = Enum.GAME.DIRECTION.NORTH
		} else {
			this.direction = Enum.GAME.DIRECTION[keys[this.direction + 1]]
		}

		this.matrix = this.matrices[this.direction]
		return this.matrix
	}

	RotateCCW() {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		if (this.direction === 0) {
			this.direction = keys.length - 1
		} else {
			this.direction = Enum.GAME.DIRECTION[keys[this.direction - 1]]
		}

		this.matrix = this.matrices[this.direction]
		return this.matrix
	}
}