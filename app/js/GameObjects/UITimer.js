import 'phaser-shim'
import { PhaserGame } from '../Game'
import Util from '../Util'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class UITimer extends Phaser.Group {
	constructor(defaultTitle = "00") {
		super(PhaserGame)

		this.fontSize = 14

		this.hours = new Phaser.Text(PhaserGame)
		this.hours.text = defaultTitle
		this.hours.fontWeight = "normal"
		this.hours.fontSize = this.fontSize
		this.hours.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.add(this.hours)
		this.hours.x = 0

		this.colon1 = new Phaser.Text(PhaserGame)
		this.colon1.text = ":"
		this.colon1.fontWeight = "normal"
		this.colon1.fontSize = this.fontSize
		this.colon1.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.add(this.colon1)
		this.colon1.x = this.hours.x + this.hours.width + 3

		this.minutes = new Phaser.Text(PhaserGame)
		this.minutes.text = defaultTitle
		this.minutes.fontWeight = "normal"
		this.minutes.fontSize = this.fontSize
		this.minutes.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.add(this.minutes)
		this.minutes.x = this.colon1.left + this.colon1.width + 3

		this.colon2 = new Phaser.Text(PhaserGame)
		this.colon2.text = ":"
		this.colon2.fontWeight = "normal"
		this.colon2.fontSize = this.fontSize
		this.colon2.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.add(this.colon2)
		this.colon2.x = this.minutes.left + this.minutes.width + 3

		this.seconds = new Phaser.Text(PhaserGame)
		this.seconds.text = defaultTitle
		this.seconds.fontWeight = "normal"
		this.seconds.fontSize = this.fontSize
		this.seconds.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
		this.add(this.seconds)
		this.seconds.x = this.colon2.left + this.colon2.width + 3
	}

	SetSeconds(text) {
		this.seconds.text = text
	}

	SetHours(text) {
		this.hours.text = text
	}

	SetMinutes(text) {
		this.minutes.text = text
	}

	SetTime(hours = this.hours.text, minutes = this.minutes.text, seconds = this.seconds.text) {
		this.SetHours(this.Pad(hours))
		this.SetMinutes(this.Pad(minutes))
		this.SetSeconds(this.Pad(seconds))
	}

	Pad(value) {
		value = String(value)
		if (value.length === 1) {
			value = "0" + value
		}
		return value
	}
}