import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
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
		this.shadow = true

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
			tetromino: undefined,
			shadowTetromino: undefined
		}
		this.add(blockContainer)
	}

	SpawnTetromino(spin) {
		let tetromino = TetrominoFactory.Get(),
			x = Math.floor(config.game.grid.width / 2 - tetromino.matrix.width / 2),
			y = -1

		let shadow
		if (this.shadow) {
			shadow = TetrominoFactory.Get(tetromino.name)
		}

		tetromino.x = x
		tetromino.y = y
		this.gameObjects.tetromino = tetromino
		this.add(tetromino.group)

		if (this.shadow) {
			shadow.opacity = 0.5
			this.gameObjects.shadowTetromino = shadow
			this.UpdateShadow()
			this.add(shadow.group)
		}

		if (typeof spin !== 'undefined') {
			this.SpinTetromino(spin)
		}

		return !this.HitTest(x, y, tetromino, Enum.GAME.DIRECTION.UP)
	}

	GetTetromino() {
		return this.gameObjects.tetromino
	}

	MoveTetromino(deltaX, deltaY) {
		let tetromino = this.gameObjects.tetromino,
			shadow = this.gameObjects.shadow

		tetromino.x += deltaX
		tetromino.y += deltaY
		this.UpdateShadow()
	}

	UpdateShadow() {
		if (this.shadow) {
			let tetromino = this.gameObjects.tetromino,
				shadow = this.gameObjects.shadowTetromino

			shadow.x = tetromino.x
			shadow.y = tetromino.y
			this.DropTetromino(shadow)
		}
	}

	SpinTetromino(direction = Enum.GAME.SPIN.CW) {
		let shouldRevert = false,
			tetromino = this.gameObjects.tetromino,
			shadow = this.gameObjects.shadowTetromino

		if (direction === Enum.GAME.SPIN.CW) {
			tetromino.RotateCW()
		} else {
			tetromino.RotateCCW()
		}

		if (this.HitTest(tetromino.x, tetromino.y, tetromino, Enum.GAME.DIRECTION.UP)) {
			shouldRevert = true
		}

		if (shouldRevert && !this.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
			this.MoveTetromino(1, 0)
			shouldRevert = false
		}

		if (shouldRevert && !this.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
			this.MoveTetromino(-1, 0)
			shouldRevert = false
		}

		if (shouldRevert) {
			if (direction === Enum.GAME.SPIN.CW) {
				tetromino.RotateCCW()
			} else {
				tetromino.RotateCW()
			}
		} else {
			if (direction === Enum.GAME.SPIN.CW) {
				shadow.RotateCW()
			} else {
				shadow.RotateCCW()
			}
			this.UpdateShadow()
		}

		return !shouldRevert
	}

	DropTetromino(tetromino = this.gameObjects.tetromino) {
		let safeY = -1,
			startY = tetromino.y < 0 ? 0 : tetromino.y

		for (let y = startY; y <= this.matrix.height; y++) {
			let hittest = this.HitTest(tetromino.x, y, tetromino)
			if (!!hittest) {
				safeY = y - 1
				break
			}
		}

		if (safeY >= -1) {
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

		let ignoreBoundary
		if (tetromino.y <= 0) {
			ignoreBoundary = Enum.GAME.DIRECTION.UP
		}

		return this.HitTest(update.x, update.y, tetromino, ignoreBoundary)
	}

	HitTest(x, y, tetromino, ignoreBoundary) {
		return Util.Matrix.intersect(tetromino.matrix, this.matrix, x, y, ignoreBoundary)
	}

	AddTetrominoToGrid() {
		let tetromino = this.gameObjects.tetromino,
			world,
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

		if (!!this.gameObjects.shadowTetromino) {
			this.remove(this.gameObjects.shadowTetromino.group, true)
			this.gameObjects.shadowTetromino = undefined
		}
	}

	LinesCleared() {
		return this.matrix.getNonEmptyRows().length
	}

	AnimateClearedLines() {
		let clearedRows = this.matrix.getNonEmptyRows()
		clearedRows.map(value => this.ToggleRow(value))
	}

	RemoveClearedLines() {
		let clearedRows = this.matrix.getNonEmptyRows(),
			yMod = 1, shouldIncrement = false
		const largestAffectedRowIndex = clearedRows[clearedRows.length - 1]

		for (let index = largestAffectedRowIndex; index >= 0; index--) {
			const isClearedLine = clearedRows.indexOf(index) > -1

			for (let index1 = 0; index1 < this.lookups.blocks.data[index].length; index1++) {
				const block = this.lookups.blocks.data[index][index1]

				if (isClearedLine) {
					this._ClearBlock(index1, index)
				} else {
					if (!!block) {
						block.y += yMod
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
	}

	ToggleRow(index) {
		for (let index1 = 0; index1 < this.lookups.blocks.data[index].length; index1++) {
			const block = this.lookups.blocks.data[index][index1]
			block.active = !block.active
		}
	}

	DisableShadow() {
		this.shadow = false
	}

	EnableShadow() {
		this.shadow = true
	}

	IsEmpty() {
		return this.matrix.isEmpty()
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