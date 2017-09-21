import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
const config = require('../../config.json')

export default class RegularText extends Phaser.Text {
	constructor(PhaserGame) {
		super(PhaserGame)
		this.fontWeight = "normal"
		this.fontSize = 14
		this.font = config.game.font.text
		this.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
	}
}