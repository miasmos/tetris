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
	}

	SetTitle(text) {
		this.title.text = text
	}

	SetTetromino(tetromino) {
		if (!!this.tetromino) {
			this.remove(this.tetromino.group)
		}
		this.tetromino = tetromino
		this.tetromino.group.y = this.title.height - config.game.blockSize
		if (tetromino.name === Enum.GAME.TETROMINO.O) {
			this.tetromino.group.x = this.width / 2 - this.tetromino.group.width / 2 - config.game.blockSize
		} else {
			this.tetromino.group.x = this.width / 2 - this.tetromino.group.width / 2
		}
		this.textContainer.add(this.tetromino.group)
	}
}