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
		this.blocks = []
		this._matrix = undefined
		this.size = undefined
		this.rendered = false
		this.width = 0
		this.opacity = 1
		this.height = 0
		this.origin = {
			x: 0,
			y: 0
		}

		this.rotations = {}
		this.direction = Enum.GAME.DIRECTION.UP
	}

	set opacity(value) {
		if (!(typeof value === 'number' && value >= 0 && value <= 1)) {
			return
		}

		this._opacity = value
		for (let index in this.group.children) {
			const block = this.group.children[index]
			block.alpha = value
		}
	}

	get opacity() {
		return this._opacity
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
		let curX = 0, curY = 0, blockCount = 0
		for (let index in this.matrix.data) {
			for (let index1 in this.matrix.data[index]) {
				if (!!this.matrix.data[index][index1]) {
					let block
					if (!this.rendered) {
						block = BlockFactory.Get(this.color)	 
						block.active = true
						block.sprite.alpha = this.opacity
						this.group.add(block.sprite)
						this.blocks.push(block)
					} else {
						block = this.blocks[blockCount++]
					}
	
					block.x = curX
					block.y = curY
				}
				curX++
			}
			curY++
			curX = 0
		}

		if (!this.rendered) {
			this.rendered = true
		}
	}

	_clear() {
		this.group.removeAll(true)
	}

	RotateCW(commit = true) {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		let matrix,
			direction

		if (this.direction === keys.length - 1) {
			direction = Enum.GAME.DIRECTION.UP
		} else {
			direction = Enum.GAME.DIRECTION[keys[this.direction + 1]]
		}

		matrix = this.rotations[direction].matrix

		if (!!commit) {
			this.matrix = matrix
			this.direction = direction
		}

		return matrix
	}

	RotateCCW(commit = true) {
		const keys = Object.keys(Enum.GAME.DIRECTION)
		let matrix,
			direction
	
		if (this.direction === 0) {
			direction = keys.length - 1
		} else {
			direction = Enum.GAME.DIRECTION[keys[this.direction - 1]]
		}

		matrix = this.rotations[direction].matrix

		if (!!commit) {
			this.matrix = matrix
			this.direction = direction
		}

		return matrix
	}
}