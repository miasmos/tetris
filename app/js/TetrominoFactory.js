import Tetromino from './GameObjects/Tetromino'
import Util from './Util'
import Matrix from './Matrix'
const config = require('../config.json'),
	Enum = require('../enum.json')

class _TetrominoFactory {
	constructor() {
		this.min = 0
		this.max = Object.keys(config.tetromino).length - 1

		this.rotations = {}
		for (let index in config.tetromino) {	//cache all tetromino orientations
			const tetrominoData = config.tetromino[index]
			this.rotations[tetrominoData.name] = this.GenerateRotations(tetrominoData.name)
		}

		this.redrawCount = 6
		this.count = 0
		this.bag = new Bag(4)
		this.next = undefined
		this.current = undefined
	}

	GenerateRotations(type) {
		let defaultMatrix = config.tetromino[type].matrix,
			defaultOrigin = config.tetromino[type].origin,
			directions = {}

		for (let index in Enum.GAME.DIRECTION) {	//generate matrices for each orientation of the tetromino
			let direction = Enum.GAME.DIRECTION[index],
				matrix,
				origin

			if (direction === Enum.GAME.DIRECTION.UP) {
				matrix = new Matrix(defaultMatrix)
				origin = {
					x: defaultOrigin[0],
					y: defaultOrigin[1]
				}
			} else {
				const shouldHaveTwoRotations = type === Enum.GAME.TETROMINO.I || type === Enum.GAME.TETROMINO.S || type === Enum.GAME.TETROMINO.Z
				if (shouldHaveTwoRotations) {
					if (direction === Enum.GAME.DIRECTION.DOWN) {
						matrix = new Matrix(directions[Enum.GAME.DIRECTION.UP].matrix.data)
						origin = directions[Enum.GAME.DIRECTION.UP].origin
					} else if (direction === Enum.GAME.DIRECTION.LEFT) {
						matrix = new Matrix(directions[Enum.GAME.DIRECTION.RIGHT].matrix.data)
						origin = directions[Enum.GAME.DIRECTION.RIGHT].origin
					} else {
						matrix = new Matrix(Util.Matrix.rotate(directions[direction - 1].matrix))
						origin = Util.Matrix.origin(matrix)
					}
				} else {
					matrix = new Matrix(Util.Matrix.rotate(directions[direction - 1].matrix))
					origin = Util.Matrix.origin(matrix)
				}
			}

			directions[direction] = {
				matrix,
				origin
			}
		}

		return directions
	}

	Create(type) {
		let tetromino = new Tetromino(type)
		tetromino.rotations = this.rotations[type]
		tetromino.matrix = tetromino.rotations[Enum.GAME.DIRECTION.UP].matrix
		tetromino.origin = tetromino.rotations[Enum.GAME.DIRECTION.UP].origin
		return tetromino
	}

	Draw(count = 1, ignore = []) {
		const index = Util.Math.randomInt(this.min, this.max),
			value = Object.keys(config.tetromino)[index]

		if (ignore.indexOf(value) > -1) {
			return this.Draw(count, ignore)
		}
		if (this.bag.Contains(value) && count <= this.redrawCount) {
			return this.Draw(++count, ignore)
		}

		return value
	}

	Get(type) {
		if (typeof type !== 'undefined') {
			return this.Create(type)
		}

		if (typeof this.next === 'undefined') {
			type = this.Draw(1, [Enum.GAME.TETROMINO.S, Enum.GAME.TETROMINO.Z, Enum.GAME.TETROMINO.O])
			this.next = this.Create(type)
		}
		type = this.Draw()

		this.current = this.next
		this.bag.Insert(this.current.name)
		this.next = this.Create(type)
		this.count++

		return this.current
	}

	Reset() {
		this.count = 0
		this.bag = new Bag(4)
		this.next = this.Get()
	}

	GetNext() {
		return this.next
	}

	GetCurrent() {
		return this.current
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

	Log() {
		let str = ''
		this.pool.map(value => str += ` ${value}`)
		console.log(str)
	}
}

const TetrominoFactory = new _TetrominoFactory()

export default TetrominoFactory