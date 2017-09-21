import 'phaser-shim'
import Block from './GameObjects/Block'
import { PhaserGame } from './PhaserGame'
const config = require('../config.json')

class _BlockFactory {
	constructor() {
		this.textures = {}
		for (let index in config.tetromino) {
			const tetrominoData = config.tetromino[index],
				color = tetrominoData.color

			const graphic = new Phaser.Graphics(PhaserGame)
			graphic.beginFill(config.game.color.background, 1)
			graphic.drawRect(0, 0, config.game.blockSize, config.game.blockSize)
			graphic.endFill()
			let fillSize = 2
			graphic.beginFill(color, 1)
			graphic.drawRect(fillSize, fillSize, config.game.blockSize - fillSize, config.game.blockSize - fillSize)
			graphic.endFill()
			this.textures[color] = graphic.generateTexture()
		}
	}

	Get(color) {
		let block
		if (typeof color === 'undefined') {
			block = new Block()
		} else {
			block = new Block(this.textures[color])
		}

		return block
	}
}
const BlockFactory = new _BlockFactory()
export default BlockFactory