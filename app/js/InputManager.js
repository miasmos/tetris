import 'phaser-shim'
import { PhaserGame } from './PhaserGame'

export default class InputManager {
	constructor() {
		this.keyboard = PhaserGame.input.keyboard
		this.keyboard.onDownCallback = this._onDown.bind(this)
		this.keyboard.onPressCallback = this._onPress.bind(this)
		this.keyboard.onUpCallback = this._onUp.bind(this)

		this.cache = []
		this.timeout = {}
	}

	isDown(keyCode) {
		return this.keyboard.isDown(keyCode)
	}

	isBuffered(keyCode) {
		return this.cache.indexOf(keyCode) > -1
	}

	buffer(keyCode, timeout) {
		this._cacheKey(keyCode, timeout)
	}

	_cacheKey(keyCode, timeout) {
		if (!this.isBuffered(keyCode)) {
			this.cache.push(keyCode)

			if (typeof timeout === 'number') {
				this.timeout[keyCode] = setTimeout(() => {
					this._releaseKey(keyCode)
				}, timeout)
			}
		}
	}

	_releaseKey(keyCode) {
		if (this.isBuffered(keyCode)) {
			this.cache.splice(this.cache.indexOf(keyCode), 1)
		}
		if (keyCode in this.timeout) {
			clearTimeout(this.timeout[keyCode])
			this.timeout[keyCode] = undefined
			delete this.timeout[keyCode]
		}
	}

	_onUp(event) {
		if (!(event.keyCode in this.timeout)) {
			this._releaseKey(event.keyCode)
		}
	}

	_onPress(event) {
	}

	_onDown(event) {
	}
}