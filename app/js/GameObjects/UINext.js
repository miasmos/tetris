import 'phaser-shim'
import { PhaserGame } from '../Game'
import Util from '../Util'
const config = require('../../config.json')

export default class Next extends Phaser.Group {
	constructor(defaultTitle = "") {
		super(PhaserGame)

		this.textContainer = new Phaser.Group(PhaserGame)
		this.add(this.textContainer)

		this.title = new Phaser.Text(PhaserGame)
		this.title.text = defaultTitle
		this.title.fontWeight = "normal"
		this.title.fontSize = 12
		this.title.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
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
		this.tetromino.group.y = this.title.height
		this.tetromino.group.x = this.width / 2 - this.tetromino.group.width / 2
		this.textContainer.add(this.tetromino.group)
	}
}