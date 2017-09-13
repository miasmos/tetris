import UINumericText from './GameObjects/UINumericText'
import UINext from './GameObjects/UINext'

class _UI {
	constructor() {
		this._lines = undefined
		this._level = undefined
		this._score = undefined
		this._next = undefined
	}

	Init() {
		this.Lines = new UINumericText('LINES')
		this.Level = new UINumericText('LEVEL', 1)
		this.Score = new UINumericText('SCORE')
		this.Next = new UINext('NEXT')
	}

	get Lines() {
		return this._lines
	}

	set Lines(value) {
		this._lines = value
	}

	get Level() {
		return this._level
	}

	set Level(value) {
		this._level = value
	}

	get Score() {
		return this._score
	}

	set Score(value) {
		this._score = value
	}

	get Next() {
		return this._next
	}

	set Next(value) {
		this._next = value
	}
}

const UI = new _UI()
export default UI