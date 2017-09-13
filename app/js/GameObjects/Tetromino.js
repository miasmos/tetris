import 'phaser-shim'
import BlockFactory from '../BlockFactory'
import { PhaserGame } from '../Game'
import Util from '../Util'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class Tetromino {
	constructor(type) {
		const data = config.tetromino[type]
		this.color = data.color
		this.index = data.index
		this.name = data.name

		this.group = new Phaser.Group(PhaserGame)
		this._matrix = undefined
		this.size = undefined
		this.width = 0
		this.height = 0

		this.rotations = {}
		this.direction = Enum.GAME.DIRECTION.UP
	}

	set gridX(value) {
		this.x = value / config.game.blockSize
	}

	get gridX() {
		return this.group.x
	}

	set gridY(value) {
		this.y = value / config.game.blockSize
	}

	get gridY() {
		return this.group.y
	}

	set matrix(matrix) {
		this._matrix = matrix
		this.width = matrix.width
		this.height = matrix.height
		this._render()
	}

	get matrix() {
		return this._matrix
	}

	set x(value) {
		this._x = value
		this.group.x = value * config.game.blockSize
	}

	get x() {
		return this._x
	}

	set y(value) {
		this._y = value
		this.group.y = value * config.game.blockSize
	}

	get y() {
		return this._y
	}

	_render() {
		this._clear()
		let curX = 0, curY = 0
		for (let index in this.matrix.data) {
			for (let index1 in this.matrix.data[index]) {
				if (!!this.matrix.data[index][index1]) {
					const block = BlockFactory.Get(this.color)
					block.active = true
					block.x = curX
					block.y = curY
					this.group.add(block.sprite)
				}
				curX++
			}
			curY++
			curX = 0
		}
	}

	_clear() {
		this.group.removeAll(true)
	}

	RotateCW() {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		if (this.direction === keys.length - 1) {
			this.direction = Enum.GAME.DIRECTION.UP
		} else {
			this.direction = Enum.GAME.DIRECTION[keys[this.direction + 1]]
		}

		this.matrix = this.rotations[this.direction]
		return this.matrix
	}

	RotateCCW() {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		if (this.direction === 0) {
			this.direction = keys.length - 1
		} else {
			this.direction = Enum.GAME.DIRECTION[keys[this.direction - 1]]
		}

		this.matrix = this.rotations[this.direction]
		return this.matrix
	}
}