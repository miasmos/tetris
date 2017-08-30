import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class DebugGrid extends Phaser.Graphics {
	constructor(parent = PhaserGame, x = 0, y = 0) {
		super(parent, x, y)
		this.lineStyle(2, 0x00FF00, 1)

		let temp = 0
		while(temp < parent.width) {
			this.moveTo(temp, 0)
			this.lineTo(temp, parent.height)
			temp += config.game.blockSize
		}

		temp = 0
		while(temp < parent.height) {
			this.moveTo(0, temp)
			this.lineTo(parent.width, temp)
			temp += config.game.blockSize
		}
		this.endFill()
	}
}