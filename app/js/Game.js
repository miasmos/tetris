import 'phaser-shim'
const Enum = require('../enum.json'),
	uuid = require('uuid/v4')

let PhaserGame, instance
class Game {
	constructor(width, height) {
		if (!instance) {
			this.width = width
			this.height = height
			this.on = {
				create: [],
				preload: [],
				update: {}
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

	OnUpdate(fn, priority = Enum.PRIORITY.MEDIUM) {
		if (!(priority in this.on.update)) {
			this.on.update[priority] = {}
		}

		let id = uuid()

		while(id in this.on.update[priority]) {
			id = uuid()
		}
		this.on.update[priority][id] = ({ fn, id })
		console.log(`Added GameObject with uuid ${id} with priority of ${priority}`)

		return id
	}

	OffUpdate(id, priority = Enum.PRIORITY.MEDIUM) {
		if (id in this.on.update[priority]) {
			delete(this.on.update[priority][id])
			console.log(`Removed GameObject with uuid ${id} with priority of ${priority}`)
		} else {
			console.warn(`Tried to recycle a GameObject with uuid ${id}, but it wasn't found with a priority of ${priority}`)
		}
	}

	_preload() {
		for (let index in this.on.preload) {
			const value = this.on.preload[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
		this.on.preload = undefined
	}

	_create() {
		for (let index in this.on.create) {
			const value = this.on.create[index]
			if (typeof value === 'function') {
				value.call(this, PhaserGame)
			}
		}
		this.on.create = undefined
	}

	_update() {
		for (let priority in this.on.update) {
			if (Enum.PRIORITY.URGENT in this.on.update) {
				for (let index in this.on.update[Enum.PRIORITY.URGENT]) {
					const entry = this.on.update[Enum.PRIORITY.URGENT][index]
					if (typeof entry.fn === 'function') {
						entry.fn.call(this, PhaserGame)
					}
				}
			}

			if (Enum.PRIORITY.HIGH in this.on.update) {
				for (let index in this.on.update[Enum.PRIORITY.HIGH]) {
					const entry = this.on.update[Enum.PRIORITY.HIGH][index]
					if (typeof entry.fn === 'function') {
						entry.fn.call(this, PhaserGame)
					}
				}
			}

			if (Enum.PRIORITY.MEDIUM in this.on.update) {
				for (let index in this.on.update[Enum.PRIORITY.MEDIUM]) {
					const entry = this.on.update[Enum.PRIORITY.MEDIUM][index]
					if (typeof entry.fn === 'function') {
						entry.fn.call(this, PhaserGame)
					}
				}
			}

			if (Enum.PRIORITY.LOW in this.on.update) {
				for (let index in this.on.update[Enum.PRIORITY.LOW]) {
					const entry = this.on.update[Enum.PRIORITY.LOW][index]
					if (typeof entry.fn === 'function') {
						entry.fn.call(this, PhaserGame)
					}
				}
			}
		}
	}
}

export { Game, PhaserGame }