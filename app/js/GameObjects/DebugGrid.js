import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class DebugGrid extends Phaser.Graphics {
	constructor(x = 0, y = 0) {
		super(PhaserGame, x, y)
		this.lineStyle(2, 0x00FF00, 1)

		let temp = 0
		while(temp < config.game.width) {
			this.moveTo(temp, 0)
			this.lineTo(temp, config.game.height)
			temp += config.game.blockSize
		}

		temp = 0
		while(temp < config.game.height) {
			this.moveTo(0, temp)
			this.lineTo(config.game.width, temp)
			temp += config.game.blockSize
		}
		this.endFill()
	}
}