import 'phaser-shim'
import { PhaserGame } from './Game'

export default class Input {
	constructor() {
		this.keyboard = PhaserGame.input.keyboard
		this.keyboard.onDownCallback = this.OnDown.bind(this)
		this.keyboard.onPressCallback = this.OnPress.bind(this)
		this.keyboard.onUpCallback = this.OnUp.bind(this)

		this.cache = []
	}

	CacheKey(keyCode) {
		if (!this.isBuffered(keyCode)) {
			this.cache.push(keyCode)
		}
	}

	ReleaseKey(keyCode) {
		if (this.isBuffered(keyCode)) {
			this.cache.splice(this.cache.indexOf(keyCode), 1)
		}
	}

	OnUp(event) {
		this.ReleaseKey(event.keyCode)
	}

	OnPress(event) {
	}

	OnDown(event) {
	}

	isDown(keyCode) {
		return this.keyboard.isDown(keyCode)
	}

	isBuffered(keyCode) {
		return this.cache.indexOf(keyCode) > -1
	}

	buffer(keyCode) {
		this.CacheKey(keyCode)
	}
}