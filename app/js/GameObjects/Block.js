import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class Block {
	constructor(texture) {
		this.sprite = new Phaser.Sprite(PhaserGame)
		this.sprite.texture = texture
		this.sprite.exists = false //hide by default
		this.sprite.x = 0
		this.sprite.y = 0
		this.sprite.height = config.game.blockSize
		this.sprite.width = config.game.blockSize
	}

	set gridX(value) {
		this.x = value / config.game.blockSize
	}

	get gridX() {
		return this.sprite.x
	}

	set gridY(value) {
		this.y = value / config.game.blockSize
	}

	get gridY() {
		return this.sprite.y
	}

	set x(value) {
		this._x = value
		this.sprite.x = value * config.game.blockSize
	}

	get x() {
		return this._x
	}

	set y(value) {
		this._y = value
		this.sprite.y = value * config.game.blockSize
	}

	get y() {
		return this._y
	}

	get active() {
		return this.sprite.exists
	}

	set active(active) {
		this.sprite.exists = active
	}

	get exists() {
		return this.sprite.exists
	}

	set exists(value) {
		this.sprite.exists = value
	}
}