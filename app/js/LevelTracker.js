const Enum = require('../enum.json'),
	config = require('../config.json')

export default class LevelTracker {
	constructor(ui) {
		this.ui = ui
		this.level = 0
		this.Reset()
	}

	Add(value = 1, type = Enum.GAME.LEVEL_TYPES.SPAWN) {
		if (type === Enum.GAME.LEVEL_TYPES.SPAWN) {
			if (this.Is99()) {
				return
			}

			if (this.level === 998) {
				return
			}
		}

		this.ui.Add(value)
		this.level += value
	}

	Reset() {
		this.level = 0
		this.ui.SetNumber(0)
	}

	Gravity() {
		const keys = Object.keys(config.game.gravity)

		if (this.level >= Number(keys[keys.length - 1])) {
			return Number(keys[keys.length - 1]) / 256
		}

		for (let index in config.game.gravity) {
			const currentLevel = Number(index),
				nextLevel = keys.indexOf(index) + 1 < keys.length ? Number(keys[keys.indexOf(index) + 1]) : undefined,
				numerator = config.game.gravity[index]

			if (typeof nextLevel === 'undefined') {
				return currentLevel / 256
			} else if (currentLevel <= this.level && nextLevel >= this.level) {
				return numerator / 256
			}
		}

		return config.game.gravity[keys[0]] / 256
	}

	Is99() {
		return String(this.level).slice(-2) === '99'
	}
}
