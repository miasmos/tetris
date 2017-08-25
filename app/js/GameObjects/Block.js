const config = require('../../config.json'),
	Phaser = require('phaser')

export default class Block {
	constructor(game, color) {
		this.width = config.game.blockSize
		this.height = config.game.blockSize
		this.color = color

		const rectangle = new Rectangle(this.width, this.height, 0, 0)
		this.shape = rectangle

		const graphic = game.add.graphics(0, 0)
		graphic.beginFill(color)
		graphic.drawPolygon(rectangle.points)
		graphic.endFill()
		this.graphic = graphic
	}
}