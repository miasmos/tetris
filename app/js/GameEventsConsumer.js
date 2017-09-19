const Enum = require('../enum.json')

export default class GameEventsConsumer {
	constructor(emitter) {
		this.emitter = emitter
		this.name = 'Unnamed'
		this.verbose = false
		emitter.on(Enum.GAME.EVENTS.LINE, this.onLine.bind(this))
		emitter.on(Enum.GAME.EVENTS.SPAWN, this.onSpawn.bind(this))
	}

	onLine(linesCleared) {
		this.log(`onLine ${linesCleared}`)
	}

	onSpawn(type) {
		this.log(`onSpawn ${type}`)
	}

	log(str) {
		if (this.verbose) {
			console.log(`${this.name}: ${str}`)
		}
	}
}