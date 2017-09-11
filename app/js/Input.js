import 'phaser-shim'
import { PhaserGame } from './Game'

export default class Input {
	constructor() {
		this.keyboard = PhaserGame.input.keyboard
		this.keyboard.onDownCallback = this.onDown
	}

	MovementKeyPressed() {
		return this.keyboard.is(Phaser.Keyboard.LEFT) ||
			this.keyboard.isDown(Phaser.Keyboard.RIGHT) ||
			this.keyboard.isDown(Phaser.Keyboard.DOWN)
	}

	OnDown(event) {
		console.log(event)
	}
}