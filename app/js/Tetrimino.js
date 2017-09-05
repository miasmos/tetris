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