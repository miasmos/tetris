import 'phaser-shim'
import Observer from './Observer'
const config = require('../config.json')
let PhaserGame, instance

class GameEngine extends Observer {
	constructor() {
		if (!instance) {
			super()
			PhaserGame = new Phaser.Game(config.game.width, config.game.height, Phaser.AUTO, 'game', {
				preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this)
			})
			instance = this
		}
		return instance
	}

	preload() {
		this.emit('preload', [PhaserGame])
	}

	update() {
		this.emit('update', [PhaserGame])
	}

	create() {
		this.emit('create', [PhaserGame])
	}
}

export { PhaserGame, GameEngine }
