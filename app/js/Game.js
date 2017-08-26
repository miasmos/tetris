import 'phaser-shim'

let PhaserGame, instance
class Game {
	constructor(width, height) {
		if (!instance) {
			this.width = width
			this.height = height
			this.on = {
				create: [],
				preload: []
			}
			instance = this
		}

		return instance
	}

	Start() {
		if (!PhaserGame) {
			PhaserGame = new Phaser.Game(this.width, this.height, Phaser.AUTO, 'game', { preload: this._preload.bind(this), create: this._create.bind(this), update: this._update.bind(this) })
		}
		return PhaserGame
	}

	Get() {
		return PhaserGame
	}

	OnCreate(fn) {
		this.on.create.push(fn)
	}

	OnPreload(fn) {
		this.on.preload.push(fn)
	}

	_preload() {
		for (var index in this.on.preload) {
			const value = this.on.preload[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
	}

	_create() {
		for (var index in this.on.create) {
			const value = this.on.create[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
	}

	_update() {

	}
}

export { Game, PhaserGame }