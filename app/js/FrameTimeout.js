const config = require('../config.json'),
	Enum = require('../enum.json')

class _FrameTimeout {
	constructor() {
		this.timeouts = {
			ARE: undefined,
			DAS: undefined,
			lockDelay: undefined,
			lineClear: undefined,
			gravity: undefined
		}

		this.delays = {
			ARE: config.game.spawnDelay / 60 * 1000,
			DAS: config.game.delayedAutoShift / 60 * 1000,
			lockDelay: config.game.lockDelay / 60 * 1000,
			lineClear: config.game.lineClearDelay / 60 * 1000,
			gravity: 0
		}
	}

	SpawnDelay() {
		this.Set(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY)
	}

	DelayedAutoShift() {
		this.Set(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT)
	}

	LockDelay() {
		this.Set(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)
	}

	LineClearDelay() {
		this.Set(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)
	}

	Gravity(gravity) {
		this.delays.gravity = (1 / gravity) / config.game.fps * 1000
		this.Set(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)
	}

	Set(type) {
		let key = this.GetKey(type)

		if (typeof this.timeouts[key] !== 'undefined') {
			this.Clear(type)
		}

		this.timeouts[key] = setTimeout(() => {
			this.timeouts[key] = true
		}, this.delays[key])
	}

	Clear(type) {
		let key = this.GetKey(type)

		if (typeof this.timeouts[key] !== 'undefined') {
			clearTimeout(this.timeouts[key])
			this.timeouts[key] = undefined
		}
	}

	GetKey(type) {
		switch (type) {
			case Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY:
				return 'ARE'
				break
			case Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT:
				return 'DAS'
				break
			case Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY:
				return 'lockDelay'
				break
			case Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY:
				return 'lineClear'
				break
				case Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY:
				return 'gravity'
				break
		}

		return false
	}

	IsSet(type) {
		return typeof this.timeouts[this.GetKey(type)] !== 'undefined'
	}

	IsComplete(type) {
		let key = this.GetKey(type)

		if (this.timeouts[key] === true) {
			this.Clear(type)
			return true
		}

		return false
	}
}

const FrameTimeout = new _FrameTimeout()
export default FrameTimeout