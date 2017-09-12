import Tetrimino from './GameObjects/Tetrimino'
import Util from './Util'
import Matrix from './Matrix'
const config = require('../config.json'),
	Enum = require('../enum.json')

class _TetriminoFactory {
	constructor() {
		this.min = 0
		this.max = Object.keys(config.tetrimino).length - 1

		this.matrices = {}
		for (let index in config.tetrimino) {	//cache all tetrimino orientations
			const tetriminoData = config.tetrimino[index]

			this.matrices[tetriminoData.name] = this.Generate(tetriminoData.name)
		}
	}

	Generate(type) {
		let defaultMatrix = config.tetrimino[type].matrix,
			directions = {}

		for (let index in Enum.GAME.DIRECTION) {	//generate matrices for each orientation of the tetrimino
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

	Get(type) {
		if (typeof type === 'undefined') {
			const index = Util.Math.randomInt(this.min, this.max)
			type = Object.keys(config.tetrimino)[index]
		}

		let tetrimino = new Tetrimino(type)
		tetrimino.matrices = this.matrices[type]
		tetrimino.matrix = tetrimino.matrices[Enum.GAME.DIRECTION.UP]
		return tetrimino
	}
}

const TetriminoFactory = new _TetriminoFactory()

export default TetriminoFactory