import 'phaser-shim'
import { PhaserGame } from '../Game'
import Util from '../Util'
const config = require('../../config.json')

export default class NumericTextDisplay extends Phaser.Group {
	constructor(defaultTitle = "", defaultNumber = 0) {
		super(PhaserGame)

		this.textContainer = new Phaser.Group(PhaserGame)
		this.add(this.textContainer)

		this.title = new Phaser.Text(PhaserGame)
		this.title.text = defaultTitle
		this.title.fontWeight = "normal"
		this.title.fontSize = 12
		this.title.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.textContainer.add(this.title)

		this.body = new Phaser.Text(PhaserGame)
		this.body.fontWeight = "normal"
		this.body.fontSize = 16
		this.body.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.textContainer.add(this.body)

		this.body.y = this.title.height
		this.title.x = this.textContainer.width / 2 - this.title.width / 2

		if (typeof defaultNumber === 'number') {
			this.SetNumber(defaultNumber)
		}
	}

	SetTitle(text) {
		this.title.text = text
	}

	Add(value) {
		if (typeof value === 'number') {
			this.number += value
			this._setNumberText(this.number)
		}
	}

	Subtract(value) {
		if (typeof value === 'number') {
			this.number -= value
			this._setNumberText(this.number)
		}
	}

	SetNumber(value) {
		if (typeof value === 'number') {
			this.number = value
			this._setNumberText(this.number)
		}
	}

	_setNumberText(value) {
		if (typeof value === 'number') {
			this.body.text = value.toString()
			this.body.x = this.textContainer.width / 2 - this.body.width / 2
		}
	}

	Number() {
		return this.number
	}
}