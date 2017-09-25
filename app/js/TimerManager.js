import 'phaser-shim'
import { PhaserGame } from './PhaserGame'
const Enum = require('../enum.json'),
	config = require('../config.json')

export default class TimerManager {
	constructor(ui) {
		this.ui = ui
		this.Reset()
		this.timer = undefined
		this.running = false
	}

	IsBefore(minutes, seconds = 0, milliseconds = 0) {
		return this.minutes < minutes || 
			this.minutes === minutes && this.seconds < seconds || 
			this.minutes === minutes && this.seconds === seconds && this.milliseconds < milliseconds
	}

	Start() {
		if (!this.running) {
			this.timer = setInterval(this.Tick.bind(this), 10)
			this.running = true
		}
	}

	Stop() {
		this.Pause()
		this.Reset()
		this.running = false
	}

	Pause() {
		clearInterval(this.timer)
		this.timer = undefined
		this.running = false
	}

	Tick() {
		if (++this.milliseconds === 100) {
			this.seconds++
			this.milliseconds = 0
		}
		if (this.seconds === 60) {
			this.minutes++
			this.seconds = 0
		}
		if (this.minutes === 60) {
			this.minutes = 59
		}

		this.ui.SetTime(this.minutes, this.seconds, this.milliseconds)
	}

	Reset() {
		this.milliseconds = 0
		this.seconds = 0
		this.minutes = 0
		this.ui.SetTime(0, 0, 0)
	}
}

