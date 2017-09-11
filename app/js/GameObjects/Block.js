import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class Block extends Phaser.Sprite {
	constructor(texture) {
		super(PhaserGame)
		this.texture = texture
		this.exists = false //hide by default
		this.x = 0
		this.y = 0
		this.height = config.game.blockSize
		this.width = config.game.blockSize
	}

	SetPosition(x, y) {
		this.x = x
		this.y = y
	}

	get active() {
		return this.exists
	}

	set active(active) {
		this.exists = active
	}
}