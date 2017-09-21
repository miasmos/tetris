import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
const config = require('../../config.json')

export default class TitleText extends Phaser.Text {
	constructor(PhaserGame) {
		super(PhaserGame)
		this.fontWeight = "normal"
		this.fontSize = 48
		this.lineSpacing = 3
		this.font = config.game.font.title
		this.addColor(Util.Color.CSSHex(config.game.color.primary), 0)
	}
}