import 'phaser-shim'
import { PhaserGame } from './Game'
const Enum = require('../enum.json'),
	config = require('../config.json')

export default class TimerManager {
	constructor(ui) {
		this.ui = ui
		this.Reset()
		this.timer = undefined
		this.running = false
	}

	Start() {
		if (!this.running) {
			this.timer = setInterval(this.Tick.bind(this), 1000)
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
		if (++this.seconds === 60) {
			this.minutes++
			this.seconds = 0
		}
		if (this.minutes === 60) {
			this.hours++
			this.minutes = 0
		}
		if (this.hours === 60) {
			this.hours = 59
		}

		this.ui.SetTime(this.hours, this.minutes, this.seconds)
	}

	Reset() {
		this.seconds = 0
		this.minutes = 0
		this.hours = 0
		this.ui.SetTime(0, 0, 0)
	}
}

