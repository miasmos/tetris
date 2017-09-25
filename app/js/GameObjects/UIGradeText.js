import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Util from '../Util'
import RegularText from './RegularText'
import TitleText from './TitleText'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class UIGradeText extends Phaser.Group {
	constructor() {
		super(PhaserGame)

		this.verticalPadding = 2

		this.textContainer = new Phaser.Group(PhaserGame)
		this.add(this.textContainer)

		this.grade = new TitleText(PhaserGame)
		this.grade.align = 'right'
		this.grade.text = "9"
		// this.SetGrade("9")
		this.textContainer.add(this.grade)

		this.title = new RegularText(PhaserGame)
		this.title.align = 'right'
		this.title.text = 'NEXT GRADE\nAT'
		this.textContainer.add(this.title)
		
		this.title1 = new RegularText(PhaserGame)
		this.title1.align = 'right'
		this.title1.fontSize = 20
		this.textContainer.add(this.title1)

		this.title2 = new RegularText(PhaserGame)
		this.title2.align = 'right'
		this.title2.text = 'POINTS'
		this.textContainer.add(this.title2)

		this.title.x = this.textContainer.width - this.title.width
		this.title.y = this.grade.y + this.grade.height - this.verticalPadding * 2
		this.title1.y = this.title.y + this.title.height - this.verticalPadding * 2
		this.title2.y = this.title1.y + this.title1.height - this.verticalPadding * 2
		this.title2.x = this.textContainer.width - this.title2.width
		this.grade.x = this.textContainer.width - this.grade.width
	}

	SetTitle(points) {
		this.title1.text = points.toString()
		this.title1.x = this.textContainer.width - this.title1.width
	}

	SetGrade(grade) {
		this.grade.text = grade.toString()
		this.grade.x = this.textContainer.width - this.grade.width
	}
}