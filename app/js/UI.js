import UINumericText from './GameObjects/UINumericText'
import UINext from './GameObjects/UINext'
import UILevel from './GameObjects/UILevel'
import UITimer from './GameObjects/UITimer'
import UIGradeText from './GameObjects/UIGradeText'

class _UI {
	constructor() {
		this._lines = undefined
		this._level = undefined
		this._score = undefined
		this._next = undefined
		this._timer = undefined
		this._grade = undefined
	}

	Init() {
		this.Level = new UILevel()
		this.Score = new UINumericText('POINTS')
		this.Next = new UINext('NEXT')
		this.Timer = new UITimer()
		this.Grade = new UIGradeText()
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

	get Timer() {
		return this._timer
	}

	set Timer(value) {
		this._timer = value
	}

	get Grade() {
		return this._grade
	}

	set Grade(value) {
		this._grade = value
	}
}

const UI = new _UI()
export default UI