import 'phaser-shim'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class Block extends Phaser.Graphics {
	constructor(color, x = 0, y = 0) {
		super(PhaserGame, x, y)
		this.color = color
		this.beginFill(color, 1)
		this.drawRect(0, 0, config.game.blockSize, config.game.blockSize)
		this.endFill()
	}
}