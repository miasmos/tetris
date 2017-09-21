import 'phaser-shim'
import InputManager from '../InputManager'
import { PhaserGame } from '../PhaserGame'
import RegularText from '../GameObjects/RegularText'
import TitleText from '../GameObjects/TitleText'
import Util from '../Util'

const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class TitleScreen {
	constructor() {
		this.keyboard = new InputManager()
	}

	create() {
		this.container = new Phaser.Group(PhaserGame)

		this.title = new TitleText(PhaserGame)
		this.title.text = "TETRIS"
		this.container.add(this.title)

		this.start = new RegularText(PhaserGame)
		this.start.text = "PRESS SPACE TO START"
		this.container.add(this.start)

		this.title.x = this.container.width / 2 - this.title.width / 2
		this.start.x = this.container.width / 2 - this.start.width / 2
		this.start.y = this.title.height + 20
		this.container.x = config.game.width / 2 - this.container.width / 2
		this.container.y = config.game.height / 2 - this.container.height / 2
		this.game.add.existing(this.container)
	}

	update() {
		if (this.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.keyboard.isBuffered(Phaser.Keyboard.SPACEBAR)) {
			this.keyboard.buffer(Phaser.Keyboard.SPACEBAR)
			PhaserGame.state.start(Enum.APP.STATE.GAME)
		}
	}
}