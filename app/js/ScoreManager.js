import GameEventsConsumer from './GameEventsConsumer'
const Enum = require('../enum.json'),
	config = require('../config.json')

export default class ScoreManager extends GameEventsConsumer {
	constructor(emitter, uiScore, uiGrade, level) {
		super(emitter)
		this.uiScore = uiScore
		this.uiGrade = uiGrade
		this.levelRef = level
		this.name = 'ScoreManager'
		// this.verbose = true

		this.grades = Object.values(config.game.grades)
		this.scores = Object.keys(config.game.grades).map(value => {return Number(value)})
		this.Reset()
	}

	onLock(linesCleared, soft, bravo) {
		super.onLock(linesCleared)

		if (bravo) {
			this.bravo = 4
		}

		if (linesCleared === 0) {
			this.combo = 1
		} else {
			this.combo = this.combo + (2 * linesCleared) - 2
		}

		const score = Math.ceil(((Math.ceil(this.levelRef.level + linesCleared) / 4) + soft) * linesCleared * this.combo * this.bravo)
		if (score > 0) {
			this.score += score
			this.uiScore.Add(score)

			let grade = this.GetGrade()
			this.grade = grade.grade
			this.diff = grade.diff
			this.uiGrade.SetTitle(this.diff)
			this.uiGrade.SetGrade(this.grade)
		}

		this.bravo = 1
	}

	onWin() {
		if (this.isGM) {
			this.uiGrade.SetGrade('GM')
		}
	}

	GetGrade() {
		for (let index = 0; index < this.scores.length; index++) {
			if (index === this.scores.length - 2) {
				return {
					grade: this.grades[index],
					diff: '??????'
				}
			}

			const score = this.scores[index],
				nextScore = this.scores[index + 1]
			if (this.score >= score && this.score < nextScore) {
				return {
					grade: this.grades[index],
					diff: nextScore - this.score
				}
			}
		}
	}

	SetGM() {
		this.isGM = true
	}

	Reset() {
		this.score = 0
		this.combo = 0
		this.bravo = 1
		this.grade = this.grades[0]
		this.diff = this.scores[1]
		this.isGM = false

		this.uiScore.SetNumber(this.score)
		let grade = this.GetGrade()
		this.grade = grade.grade
		this.diff = grade.diff
		this.uiGrade.SetTitle(this.diff)
		this.uiGrade.SetGrade(this.grade)
	}
}

