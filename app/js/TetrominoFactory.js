import Tetromino from './GameObjects/Tetromino'
import Util from './Util'
import Matrix from './Matrix'
const config = require('../config.json'),
	Enum = require('../enum.json')

class _TetrominoFactory {
	constructor() {
		this.min = 0
		this.max = Object.keys(config.tetromino).length - 1

		this.matrices = {}
		for (let index in config.tetromino) {	//cache all tetromino orientations
			const tetrominoData = config.tetromino[index]

			this.matrices[tetrominoData.name] = this.Generate(tetrominoData.name)
		}

		this.redrawCount = 6
		this.count = 0
		this.bag = new Bag(4)
	}

	Generate(type) {
		let defaultMatrix = config.tetromino[type].matrix,
			directions = {}

		for (let index in Enum.GAME.DIRECTION) {	//generate matrices for each orientation of the tetromino
			let direction = Enum.GAME.DIRECTION[index],
				matrix

			if (direction === Enum.GAME.DIRECTION.UP) {
				matrix = new Matrix(defaultMatrix)
			} else {
				matrix = new Matrix(Util.Matrix.rotate(directions[direction - 1]))
			}

			directions[direction] = matrix
		}

		return directions
	}

	Create(type) {
		let tetromino = new Tetromino(type)
		tetromino.matrices = this.matrices[type]
		tetromino.matrix = tetromino.matrices[Enum.GAME.DIRECTION.UP]
		return tetromino
	}

	Draw(count = 1, ignore = []) {
		const index = Util.Math.randomInt(this.min, this.max),
			value = Object.keys(config.tetromino)[index]

		if (ignore.indexOf(value) > -1) {console.log(`got ignored piece ${value}, redrawing`)
			return this.Draw(count)
		}
		if (this.bag.Contains(value) && count <= this.redrawCount) {console.log(`bag contains ${value}, redrawing`)
			return this.Draw(++count)
		}

		return value
	}

	Get(type) {
		if (typeof type === 'undefined') {
			if (this.count = 0) {
				type = this.Draw(1, [Enum.GAME.TETROMINO.S, Enum.GAME.TETROMINO.Z, Enum.GAME.TETROMINO.O])
			} else {
				type = this.Draw()
			}
		}

		this.bag.Insert(type)
		console.log(this.bag)
		this.count++
		return this.Create(type)
	}

	Reset() {
		this.count = 0
		this.bag = new Bag(4)
	}
}

class Bag {
	constructor(size) {
		this.size = size
		this.pool = [Enum.GAME.TETROMINO.Z, Enum.GAME.TETROMINO.Z, Enum.GAME.TETROMINO.S, Enum.GAME.TETROMINO.S]
	}

	Insert(value) {
		this.pool.push(value)
		if (this.pool.length > this.size) {
			this.pool.splice(0, 1)
		}
	}

	Contains(value) {
		return this.pool.indexOf(value) > -1
	}
}

const TetrominoFactory = new _TetrominoFactory()

export default TetrominoFactory