import 'phaser-shim'
import { PhaserGame } from '../Game'
import BlockFactory from '../BlockFactory'
import TetrominoFactory from '../TetrominoFactory'
import Util from '../Util'
import Matrix from '../Matrix'
const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class Grid extends Phaser.Group {
	constructor() {
		super(PhaserGame)

		const gridWidth = config.game.blockSize * config.game.grid.width,
			gridHeight = config.game.blockSize * config.game.grid.height,
			gridX = config.game.width / 2 - gridWidth / 2,
			gridY = config.game.height / 2 - gridHeight / 2,
			borderSize = config.game.borderSize

		this.borderGraphic = new Phaser.Graphics(PhaserGame)
		this.borderGraphic.beginFill(Util.Color.Hex(config.game.color.primary), 1)
		this.borderGraphic.drawRect(-borderSize, -borderSize, gridWidth + borderSize * 2, gridHeight + borderSize * 2)
		this.borderGraphic.endFill()
		this.add(this.borderGraphic)

		this.fillGraphic = new Phaser.Graphics(PhaserGame)
		this.fillGraphic.beginFill(Util.Color.Hex(config.game.color.background), 1)
		this.fillGraphic.drawRect(0, 0, gridWidth, gridHeight)
		this.fillGraphic.endFill()
		this.add(this.fillGraphic)

		this.x = gridX
		this.y = gridY
		this.width = gridWidth
		this.height = gridHeight
		this.clearing = false

		this.matrix = new Matrix(Util.Matrix.generate(config.game.grid.width, config.game.grid.height))

		this.lookups = {
			blocks: new Matrix(Util.Matrix.generate(config.game.grid.width, config.game.grid.height))
		}

		let blockContainer = new Phaser.Group(PhaserGame)
		blockContainer.height = gridHeight
		blockContainer.width = gridWidth

		this.gameObjects = {
			blockContainer: blockContainer,
			tetromino: undefined
		}
		this.add(blockContainer)
	}

	SpawnTetromino(spin) {
		let tetromino = TetrominoFactory.Get(),
			x = Math.floor(config.game.grid.width / 2 - tetromino.matrix.width / 2),
			y = 0

		if (typeof spin !== 'undefined') {
			if (spin === Enum.GAME.SPIN.CW) {
				tetromino.RotateCW()
			} else {
				tetromino.RotateCCW()
			}
		}

		if (this.HitTest(x, y, tetromino)) {
			return false
		} else {
			tetromino.x = x
			tetromino.y = y
			this.gameObjects.tetromino = tetromino
			this.add(tetromino.group)
			return true
		}
	}

	MoveTetromino(deltaX, deltaY) {
		let tetromino = this.gameObjects.tetromino
		tetromino.x += deltaX
		tetromino.y += deltaY
	}

	SpinTetromino(direction = Enum.GAME.SPIN.CW) {
		let tetromino = this.gameObjects.tetromino

		if (direction === Enum.GAME.SPIN.CW) {
			tetromino.RotateCW()
		} else {
			tetromino.RotateCCW()
		}

		if (!this.HitTest(tetromino.x, tetromino.y, tetromino)) {
			return
		}

		// if (tetromino.name === Enum.TETROMINO.I) {
		// 	revertSpin()
		// 	return
		// }

		if (!this.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
			this.MoveTetromino(1, 0)
			return
		}

		if (!this.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
			this.MoveTetromino(-1, 0)
			return
		}

		revertSpin()

		function revertSpin() {
			if (direction === Enum.GAME.SPIN.CW) {
				tetromino.RotateCCW()
			} else {
				tetromino.RotateCW()
			}
		}
	}

	DropTetromino() {
		let tetromino = this.gameObjects.tetromino

		let safeY = -1
		for (let y = 0; y <= this.matrix.height; y++) {
			let hittest = this.HitTest(tetromino.x, y, tetromino)
			if (!!hittest) {
				safeY = y - 1
				break
			}
		}

		if (safeY >= 0) {
			tetromino.y = safeY
		}
	}

	TetrominoWillCollide(direction = Enum.GAME.DIRECTION.DOWN) {
		let tetromino = this.gameObjects.tetromino,
			update = {
				x: tetromino.x,
				y: tetromino.y
			}

		switch(direction) {
			case Enum.GAME.DIRECTION.RIGHT:
				update.x += 1
				break
			case Enum.GAME.DIRECTION.DOWN:
				update.y += 1
				break
			case Enum.GAME.DIRECTION.LEFT:
				update.x -= 1
				break
			case Enum.GAME.DIRECTION.UP:
				update.y -= 1
				break
		}

		return this.HitTest(update.x, update.y, tetromino)
	}

	HitTest(x, y, tetromino, direction) {
		let tetrominoMatrix

		switch(direction) {
			case Enum.GAME.DIRECTION.RIGHT:
				x += tetromino.matrix.width - 1
				tetrominoMatrix = new Matrix(Util.Matrix.edge(tetromino.matrix, direction))
				break
			case Enum.GAME.DIRECTION.DOWN:
				y += tetromino.matrix.height - 1
				tetrominoMatrix = new Matrix(Util.Matrix.edge(tetromino.matrix, direction))
				break
			case Enum.GAME.DIRECTION.LEFT:
			case Enum.GAME.DIRECTION.UP:
				tetrominoMatrix = new Matrix(Util.Matrix.edge(tetromino.matrix, direction))
				break
			default:
				tetrominoMatrix = tetromino.matrix
		}

		return Util.Matrix.intersect(tetrominoMatrix, this.matrix, x, y)
	}

	AddTetrominoToGrid() {
		let tetromino = this.gameObjects.tetromino,
			world = {
				x: tetromino.gridX,
				y: tetromino.gridY
			},
			local = {
				x: tetromino.x,
				y: tetromino.y
			}

		this.matrix.overwrite(Util.Matrix.join(tetromino.matrix, this.matrix, local.x, local.y))

		for (let index in tetromino.matrix.data) {
			for (let index1 in tetromino.matrix.data[index]) {
				world = {
					x: local.x * config.game.blockSize,
					y: local.y * config.game.blockSize
				}

				if (!!tetromino.matrix.data[index][index1]) {
					this._SpawnBlock(local.x, local.y, tetromino.color)
				}
				local.x++
			}
			local.y++
			local.x = tetromino.x
		}

		this.remove(tetromino.group, true)
		this.gameObjects.tetromino = undefined
	}

	LinesCleared() {
		return this.matrix.getNonEmptyRows().length
	}

	ClearLines(callback) {
		let clearedRows = this.matrix.getNonEmptyRows()

		clearedRows.map(value => this.ToggleRow(value))

		let yMod = 1, shouldIncrement = false
		const largestAffectedRowIndex = clearedRows[clearedRows.length - 1]

		for (let index = largestAffectedRowIndex; index >= 0; index--) {
			const isClearedLine = clearedRows.indexOf(index) > -1
			if (isClearedLine) console.log('clearing line', index)
			for (let index1 = 0; index1 < this.lookups.blocks.data[index].length; index1++) {
				const block = this.lookups.blocks.data[index][index1]

				if (isClearedLine) {
					console.log('clear block', index1, index)
					this._ClearBlock(index1, index)
				} else {
					if (!!block) {
						console.log('move block', index1, index)
						block.y += yMod
						console.log(block)
					}
				}
			}

			if (isClearedLine) {
				this.matrix.overwrite(Util.Matrix.removeRow(this.matrix, index))
				this.lookups.blocks.overwrite(Util.Matrix.removeRow(this.lookups.blocks, index))

				if (shouldIncrement) {
					yMod++
				}
				index++
				clearedRows = this.matrix.getNonEmptyRows()
				shouldIncrement = true
			}
		}

		this.matrix.log()
	}

	ToggleRow(index) {
		for (let index1 = 0; index1 < this.lookups.blocks.data[index].length; index1++) {
			const block = this.lookups.blocks.data[index][index1]
			block.active = !block.active
		}
	}

	_SpawnBlock(x, y, color, exists=true) {
		if (!this.lookups.blocks.get(x, y)) {
			const block = BlockFactory.Get(color)
			block.x = x
			block.y = y
			if (!!exists) {
				block.exists = true  //insert block into game update loop
			}
			this.lookups.blocks.set(x, y, block)
			this.gameObjects.blockContainer.add(block.sprite)
		}
	}

	_ClearBlock(x, y) {
		const block = this.lookups.blocks.data[y][x]
		if (!!block) {
			this.gameObjects.blockContainer.remove(block.sprite, true)
			this.lookups.blocks.set(x, y, 0)
		}
	}
}