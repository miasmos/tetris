const Enum = require('../enum.json')

export default class GameEventsConsumer {
	constructor(emitter) {
		this.emitter = emitter
		this.name = 'Unnamed'
		this.verbose = false
		emitter.on(Enum.GAME.EVENTS.LINE, this.onLine.bind(this))
		emitter.on(Enum.GAME.EVENTS.SPAWN, this.onSpawn.bind(this))
		emitter.on(Enum.GAME.EVENTS.PLACE, this.onPlace.bind(this))
		emitter.on(Enum.GAME.EVENTS.LOCK, this.onLock.bind(this))
		emitter.on(Enum.GAME.EVENTS.PAUSE, this.onPause.bind(this))
		emitter.on(Enum.GAME.EVENTS.UNPAUSE, this.onUnpause.bind(this))
		emitter.on(Enum.GAME.EVENTS.WIN, this.onWin.bind(this))
	}

	onLine(linesCleared) {
		this.log(`onLine ${linesCleared}`)
	}

	onSpawn(type) {
		this.log(`onSpawn ${type}`)
	}

	onPlace() {
		this.log(`onPlace`)
	}

	onLock(linesCleared) {
		this.log(`onLock`)
	}

	onPause() {
		this.log(`Pause`)
	}

	onUnpause() {
		this.log(`Unpause`)
	}

	onWin() {
		this.log(`Win`)
	}

	log(str) {
		if (this.verbose) {
			console.log(`${this.name}: ${str}`)
		}
	}
}