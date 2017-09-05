import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class Block extends Phaser.Sprite {
	constructor(texture) {
		super(texture)
		this.exists = false //hide by default
		this.x = 0
		this.y = 0
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