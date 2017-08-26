import 'phaser-shim'
import Block from './Block'
import { PhaserGame } from '../Game'
const config = require('../../config.json')

export default class Tetrimino extends Phaser.Group {
	constructor(type, x = 0, y = 0) {
		super(PhaserGame)
		this.color = type.color

		let maxX = 0, maxY = 0
		for (let index in type.matrix) {
			const value = type.matrix[index],
				row = Math.floor(index / 4),
				x = (index - (4 * row)) * config.game.blockSize,
				y = row * config.game.blockSize
			
			if (!!value) {
				const block = new Block(this.color, x, y)
				if (x > maxX) {
					maxX = x
				}
				if (y > maxY) {
					maxY = y
				}
				this.add(block)
			}
		}
		this.width = maxX + config.game.blockSize
		this.height = maxY + config.game.blockSize
		this.x = x
		this.y = y
		console.log(this)
	}
}