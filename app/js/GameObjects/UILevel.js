import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
import RegularText from './RegularText'
import UINumericText from './UINumericText'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class UILevel extends UINumericText {
	constructor(defaultTitle = "LEVEL", defaultLevel = 0) {
		super(defaultTitle, defaultLevel)
		this.nextLevel = 0

		this.line = new Phaser.Graphics(PhaserGame)
		this.line.beginFill(config.game.color.primary, 1)
		this.line.drawRect(0, this.body.y + this.body.height, this.textContainer.width, 2)
		this.line.endFill()
		this.line.y = this.body.y + this.body.height
		this.textContainer.add(this.line)

		this.body2 = new RegularText(PhaserGame)
		this.body2.text = "0"
		this.body2.y = this.body.y + this.body.height + 2
		this.textContainer.add(this.body2)
	}

	_setNumberText(value) {
		super._setNumberText(value)
		if (value > this.nextLevel && value < 999) {
			const nextLevel = (Math.floor(value / 100) * 100) + 100

			if (nextLevel < 1000) {
				this.nextLevel = nextLevel
			} else {
				this.nextLevel = 999
			}

			this.body2.text = nextLevel.toString()
			this.body2.x = this.textContainer.width - this.body2.width
		}
	}
}