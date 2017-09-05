import 'phaser-shim'
import math from 'mathjs'
import { PhaserGame } from './Game'
const config = require('../config.json')

export default class Grid extends Phaser.Group {
	constructor() {
		super(PhaserGame)

		const gridWidth = config.game.blockSize * config.game.grid.width,
			gridHeight = config.game.blockSize * config.game.grid.height,
			gridX = config.game.width / 2 - gridWidth / 2,
			gridY = config.game.height / 2 - gridHeight / 2,
			borderSize = 2

		this.borderGraphic = new Phaser.Graphics(PhaserGame)
		this.borderGraphic.beginFill(0xFFFFFF, 1)
		this.borderGraphic.drawRect(-borderSize, -borderSize, gridWidth + borderSize * 2, gridHeight + borderSize * 2)
		this.borderGraphic.endFill()
		this.add(this.borderGraphic)

		this.fillGraphic = new Phaser.Graphics(PhaserGame)
		this.fillGraphic.beginFill(0x000000, 1)
		this.fillGraphic.drawRect(0, 0, gridWidth, gridHeight)
		this.fillGraphic.endFill()
		this.add(this.fillGraphic)

		this.x = gridX
		this.y = gridY
		this.width = gridWidth
		this.height = gridHeight

		this.matrix = math.zeros(config.game.grid.height, config.game.grid.width, 'sparse')
		// console.log(this.matrix.toString())
	}
}