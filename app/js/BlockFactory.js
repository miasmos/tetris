import 'phaser-shim'
import Block from './GameObjects/Block'
import { PhaserGame } from './Game'
const config = require('../config.json')

class _BlockFactory {
	constructor() {
		this.textures = {}
		for (let index in config.tetrimino) {
			const tetriminoData = config.tetrimino[index],
				color = tetriminoData.color

			const graphic = new Phaser.Graphics(PhaserGame)
			graphic.beginFill(color, 1)
			graphic.drawRect(0, 0, config.game.blockSize, config.game.blockSize)
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