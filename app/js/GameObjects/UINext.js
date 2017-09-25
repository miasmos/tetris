import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
import RegularText from './RegularText'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class UINext extends Phaser.Group {
	constructor(defaultTitle = "") {
		super(PhaserGame)

		this.textContainer = new Phaser.Group(PhaserGame)
		this.add(this.textContainer)

		this.title = new RegularText(PhaserGame)
		this.title.text = defaultTitle
		this.textContainer.add(this.title)

		this.tetromino = undefined

		this.title.x = this.textContainer.width / 2 - this.title.width / 2
		this.title.y = config.game.blockSize * 2 + 8
	}

	SetTitle(text) {
		this.title.text = text
	}

	SetTetromino(tetromino) {
		if (!!this.tetromino) {
			this.remove(this.tetromino.group)
		}
		this.tetromino = tetromino
		this.tetromino.group.y = 0
		this.tetromino.group.x = this.title.x + this.title.width + 20
		if (tetromino.name === Enum.GAME.TETROMINO.O) {
			this.tetromino.group.x -= config.game.blockSize
		} else if (tetromino.name === Enum.GAME.TETROMINO.I) {
			this.tetromino.group.y += config.game.blockSize
		}
		this.textContainer.add(this.tetromino.group)
	}
}