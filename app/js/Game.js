import 'phaser-shim'
import Observer from './Observer'
const Enum = require('../enum.json'),
	config = require('../config.json'),
	uuid = require('uuid/v4')

let PhaserGame, instance
class Game extends Observer {
	constructor(width, height) {
		if (!instance) {
			super()
			this.width = width
			this.height = height
			this.dropEvent = undefined
			this.state = Enum.GAME.STATE.IDLE
			this.initCallbacks = {
				create: [],
				preload: [],
				update: {}
			}
			instance = this
		}

		return instance
	}

	SetState(state) {
		if (Object.values(Enum.GAME.STATE).indexOf(state) > -1) {
			this.state = state
			this.emit('STATE', state)
		}
	}

	Start() {
		if (!PhaserGame) {
			PhaserGame = new Phaser.Game(this.width, this.height, Phaser.AUTO, 'game', { preload: this._preload.bind(this), create: this._create.bind(this), update: this._update.bind(this) })
			this.timer = new Phaser.Timer(PhaserGame)
		}
		return PhaserGame
	}

	Get() {
		return PhaserGame
	}

	StartDropInterval(interval, fn, context) {
		if (!!this.dropEvent) {
			return
		}
		if (typeof context === 'undefined') {
			context = fn
		}

		this.dropEvent = PhaserGame.time.events.loop(interval, fn, context)
	}

	StopDropInterval() {
		if (!!this.dropEvent) {
			PhaserGame.time.events.remove(this.dropEvent)
			this.dropEvent = undefined
		}
	}

	OnCreate(fn) {
		this.initCallbacks.create.push(fn)
	}

	OnPreload(fn) {
		this.initCallbacks.preload.push(fn)
	}

	OnUpdate(fn, priority = Enum.APP.PRIORITY.MEDIUM) {
		if (!(priority in this.initCallbacks.update)) {
			this.initCallbacks.update[priority] = {}
		}

		let id = uuid()

		while(id in this.initCallbacks.update[priority]) {
			id = uuid()
		}
		this.initCallbacks.update[priority][id] = ({ fn, id })
		console.log(`Added GameObject with uuid ${id} with priority of ${priority}`)

		return id
	}

	OffUpdate(id, priority = Enum.APP.PRIORITY.MEDIUM) {
		if (id in this.initCallbacks.update[priority]) {
			delete(this.initCallbacks.update[priority][id])
			console.log(`Removed GameObject with uuid ${id} with priority of ${priority}`)
		} else {
			console.warn(`Tried to recycle a GameObject with uuid ${id}, but it wasn't found with a priority of ${priority}`)
		}
	}

	_preload() {
		for (let index in this.initCallbacks.preload) {
			const value = this.initCallbacks.preload[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
		this.initCallbacks.preload = undefined
	}

	_create() {
		for (let index in this.initCallbacks.create) {
			const value = this.initCallbacks.create[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
		this.initCallbacks.create = undefined
	}

	_update() {
		if (Enum.APP.PRIORITY.URGENT in this.initCallbacks.update) {
			for (let index in this.initCallbacks.update[Enum.APP.PRIORITY.URGENT]) {
				const entry = this.initCallbacks.update[Enum.APP.PRIORITY.URGENT][index]
				if (typeof entry.fn === 'function') {
					entry.fn.call(this, PhaserGame)
				}
			}
		}

		if (Enum.APP.PRIORITY.HIGH in this.initCallbacks.update) {
			for (let index in this.initCallbacks.update[Enum.APP.PRIORITY.HIGH]) {
				const entry = this.initCallbacks.update[Enum.APP.PRIORITY.HIGH][index]
				if (typeof entry.fn === 'function') {
					entry.fn.call(this, PhaserGame)
				}
			}
		}

		if (Enum.APP.PRIORITY.MEDIUM in this.initCallbacks.update) {
			for (let index in this.initCallbacks.update[Enum.APP.PRIORITY.MEDIUM]) {
				const entry = this.initCallbacks.update[Enum.APP.PRIORITY.MEDIUM][index]
				if (typeof entry.fn === 'function') {
					entry.fn.call(this, PhaserGame)
				}
			}
		}

		if (Enum.APP.PRIORITY.LOW in this.initCallbacks.update) {
			for (let index in this.initCallbacks.update[Enum.APP.PRIORITY.LOW]) {
				const entry = this.initCallbacks.update[Enum.APP.PRIORITY.LOW][index]
				if (typeof entry.fn === 'function') {
					entry.fn.call(this, PhaserGame)
				}
			}
		}
	}
}

export { Game, PhaserGame }
