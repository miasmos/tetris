import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
import RegularText from './RegularText'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class UITimer extends Phaser.Group {
	constructor(defaultTitle = "00") {
		super(PhaserGame)

		this.hours = new RegularText(PhaserGame)
		this.hours.text = defaultTitle
		this.add(this.hours)

		this.colon1 = new RegularText(PhaserGame)
		this.colon1.text = ":"
		this.add(this.colon1)
		this.colon1.x = this.hours.x + this.hours.width + 3

		this.minutes = new RegularText(PhaserGame)
		this.minutes.text = defaultTitle
		this.add(this.minutes)
		this.minutes.x = this.colon1.left + this.colon1.width + 3

		this.colon2 = new RegularText(PhaserGame)
		this.colon2.text = ":"
		this.add(this.colon2)
		this.colon2.x = this.minutes.left + this.minutes.width + 3

		this.seconds = new RegularText(PhaserGame)
		this.seconds.text = defaultTitle
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