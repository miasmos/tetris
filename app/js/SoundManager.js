import GameEventsConsumer from './GameEventsConsumer'
const config = require('../config.json'),
	Enum = require('../enum.json')

export default class SoundManager extends GameEventsConsumer {
	constructor(emitter) {
		super(emitter)
		this.directory = config.game.soundDir
		this.name = 'SoundManager'
		// this.verbose = true
		this.sounds = {}

		for (var key in config.game.sounds) {
			const filename = config.game.sounds[key]
			this.sounds[key] = new Audio(`./${this.directory}/${filename}`)
		}
	}

	onSpawn(type) {
		super.onSpawn(type)

		switch (type) {
			case Enum.GAME.TETROMINO.I:
				this.Play('SPAWN_I')
				break
			case Enum.GAME.TETROMINO.J:
				this.Play('SPAWN_J')
				break
			case Enum.GAME.TETROMINO.Z:
				this.Play('SPAWN_Z')
				break
			case Enum.GAME.TETROMINO.O:
				this.Play('SPAWN_O')
				break
			case Enum.GAME.TETROMINO.S:
				this.Play('SPAWN_S')
				break
			case Enum.GAME.TETROMINO.L:
				this.Play('SPAWN_L')
				break
			case Enum.GAME.TETROMINO.T:
				this.Play('SPAWN_T')
				break
		}
	}

	onLine(linesCleared) {
		super.onLine(linesCleared)

		switch (linesCleared) {
			case 4:
				this.Play('CLAPPING')
			default:
				this.Play('LINE_CLEAR')
		}
	}

	onPlace() {
		super.onPlace()
		this.Play('PLACED')
	}

	onPause() {
		super.onPause()
		this.Pause('BGM')
	}

	onUnpause() {
		super.onUnpause()
		this.Play('BGM')
	}

	Play(name, loop = false) {
		if (name in this.sounds) {
			const sound = this.sounds[name]
			sound.play()
			sound.loop = !!loop
		}
	}

	Pause(name) {
		if (name in this.sounds) {
			const sound = this.sounds[name]
			sound.pause()
		}
	}
}