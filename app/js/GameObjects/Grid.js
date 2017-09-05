import 'phaser-shim'
import math from 'mathjs'
import { PhaserGame } from '../Game'
import BlockFactory from '../BlockFactory'
const config = require('../../config.json')

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
		this.coordinateLookup = []
		this.blockContainer = new Phaser.Group(PhaserGame)
		this.blockMatrix = math.zeros(config.game.grid.height, config.game.grid.width)

		let arr = [], x = 0, y = 0
		for (let index = 0; index < config.game.grid.width; index++) {	//TODO: abstract into it's own class/type for better clarity
			for (let index1 = 0; index1 < config.game.grid.height; index1++) {
				arr.push({ x, y })
				y += config.game.blockSize
			}
			x += config.game.blockSize
		}
	}

	Update() {
		//TODO: update to insert this object into the update loop
		//TODO: update to sync this.matrix with corresponding blocks in this.blockMatrix
	}

	SpawnTetrimino(tetrimino) {
		//TODO: update to add the tetrimino matrix to this.matrix, 
	}

	_SpawnBlock(column, row, color, exists=false) {
		if (!this.blockLookup.get([column, row])) {
			const block = BlockFactory.Get(color),
				coords = this.GetCoords(column, row)

			block.SetPosition(coords.x, coords.y)
			if (!!exists) {
				block.exists = true  //insert block into game update loop
			}
			this.blockLookup.set([column, row], block)
			this.blockContainer.add(block)
		}
	}

	_ClearBlock(column, row) {
		const block = this.blockLookup.get([column, row])
		if (!!block) {
			this.blockContainer.remove(block, true)
			this.blockLookup.set([column, row], 0)
		}
	}

	GetCoords(column, row) {
		return this.coordinateLookup[column][row]
	}
}