import 'phaser-shim'
import { PhaserGame } from '../Game'
import BlockFactory from '../BlockFactory'
import TetriminoFactory from '../TetriminoFactory'
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
			borderSize = 2

		this.borderGraphic = new Phaser.Graphics(PhaserGame)
		this.borderGraphic.beginFill(0xFFFFFF, 1)
		this.borderGraphic.drawRect(-borderSize, -borderSize, gridWidth + borderSize * 2, gridHeight + borderSize * 2)
		this.borderGraphic.endFill()
		this.add(this.borderGraphic)

		this.fillGraphic = new Phaser.Graphics(PhaserGame)
		this.fillGraphic.beginFill(0x000000, 1)
		this.fillGraphic.drawRect(0, 0, gridWidth, gridHeight)
		this.fillGraphic.endFill()
		this.add(this.fillGraphic)

		this.x = gridX
		this.y = gridY
		this.width = gridWidth
		this.height = gridHeight
		this.clearing = false

		this.matrix = new Matrix(Util.Matrix.generate(config.game.grid.width - 1, config.game.grid.height - 1))

		this.lookups = {
			blocks: new Matrix(Util.Matrix.generate(config.game.grid.width - 1, config.game.grid.height - 1))
		}

		let blockContainer = new Phaser.Group(PhaserGame)
		blockContainer.height = gridHeight
		blockContainer.width = gridWidth

		this.gameObjects = {
			blockContainer: blockContainer,
			tetrimino: undefined
		}
		this.add(blockContainer)
	}

	Update() {

	}

	SpawnTetrimino() {
		let tetrimino = TetriminoFactory.Get(Enum.GAME.TETRIMINO.I),
			x = Math.floor(config.game.grid.width / 2 - tetrimino.matrix.width / 2),
			y = 0

		if (this.HitTest(x, y, tetrimino)) {
			return false
		} else {
			tetrimino.x = x
			tetrimino.y = y
			this.gameObjects.tetrimino = tetrimino
			this.add(tetrimino.group)
			return true
		}
	}

	MoveTetrimino(deltaX, deltaY) {
		let tetrimino = this.gameObjects.tetrimino
		tetrimino.x += deltaX
		tetrimino.y += deltaY
	}

	SpinTetrimino(direction = Enum.GAME.SPIN.CW) {
		let tetrimino = this.gameObjects.tetrimino
		if (direction === Enum.GAME.SPIN.CW) {
			tetrimino.RotateCW()
		} else {
			tetrimino.RotateCCW()
		}
	}

	TetriminoWillCollide(direction = Enum.GAME.DIRECTION.DOWN) {
		let tetrimino = this.gameObjects.tetrimino,
			local = {
				x: tetrimino.x,
				y: tetrimino.y
			}

		switch(direction) {
			case Enum.GAME.DIRECTION.RIGHT:
				local.x += 1
				break
			case Enum.GAME.DIRECTION.DOWN:
				local.y += 1
				break
			case Enum.GAME.DIRECTION.LEFT:
				local.x -= 1
				break
			case Enum.GAME.DIRECTION.UP:
				local.x -= 1
				break
		}

		return this.HitTest(local.x, local.y, tetrimino)
	}

	HitTest(x, y, tetrimino, direction) {		//TODO: cache tetrimino edges for each orientation
		if (y + tetrimino.matrix.height > config.game.grid.height ||
			x + tetrimino.matrix.width > config.game.grid.width ||
			x < 0 ||
			y < 0) {
			return true
		}

		let tetriminoMatrix

		switch(direction) {
			case Enum.GAME.DIRECTION.RIGHT:
				x += tetrimino.matrix.width - 1
				tetriminoMatrix = new Matrix(Util.Matrix.edge(tetrimino.matrix, direction))
				break
			case Enum.GAME.DIRECTION.DOWN:
				y += tetrimino.matrix.height - 1
				tetriminoMatrix = new Matrix(Util.Matrix.edge(tetrimino.matrix, direction))
				break
			case Enum.GAME.DIRECTION.LEFT:
			case Enum.GAME.DIRECTION.UP:
				tetriminoMatrix = new Matrix(Util.Matrix.edge(tetrimino.matrix, direction))
				break
			default:
				tetriminoMatrix = tetrimino.matrix
		}

		return Util.Matrix.intersect(tetriminoMatrix, this.matrix, x, y)
	}

	AddTetriminoToGrid() {
		let tetrimino = this.gameObjects.tetrimino,
			world = {
				x: tetrimino.gridX,
				y: tetrimino.gridY
			},
			local = {
				x: tetrimino.x,
				y: tetrimino.y
			}

		this.matrix.overwrite(Util.Matrix.join(tetrimino.matrix, this.matrix, local.x, local.y))
this.matrix.log()
		for (let index in tetrimino.matrix.data) {
			for (let index1 in tetrimino.matrix.data[index]) {
				world = {
					x: local.x * config.game.blockSize,
					y: local.y * config.game.blockSize
				}

				if (!!tetrimino.matrix.data[index][index1]) {
					this._SpawnBlock(local.x, local.y, tetrimino.color)
				}
				local.x++
			}
			local.y++
			local.x = tetrimino.x
		}

		this.remove(tetrimino.group, true)
		this.gameObjects.tetrimino = undefined
	}

	LineCleared() {
		return !!this.matrix.getNonEmptyRows().length
	}

	ClearLines(callback) {
		if (this.clearing) return
		this.clearing = true
		let clearedRows = this.matrix.getNonEmptyRows()

		let cnt = 0,
			interval = setInterval(() => {
				clearedRows.map((value, index) => this.ToggleRow(value))
				if (++cnt >= 5) {
					clearInterval(interval)
					eraseLines.call(this, clearedRows)
					callback.call()
					this.clearing = false
				}
			}, 150)

		function eraseLines(rows) {
			for (let index in rows) {
				const value = rows[index]
				for (let index1 = 0; index1 < this.lookups.blocks.data[value].length - 1; index1++) {
					this._ClearBlock(value, index1)
				}
				this.matrix.overwrite(Util.Matrix.removeRow(this.matrix, value))
			}
			//TODO: update rendered block positions to match updated matrix
			this.matrix.log()
		}
	}

	ToggleRow(index) {
		this.lookups.blocks.data[index].map(value => value.active = !value.active)
	}

	_SpawnBlock(x, y, color, exists=true) {
		if (!this.lookups.blocks.get(x, y)) {
			const block = BlockFactory.Get(color),
				world = {
					x: x * config.game.blockSize,
					y: y * config.game.blockSize
				}

			block.SetPosition(world.x, world.y)
			if (!!exists) {
				block.exists = true  //insert block into game update loop
			}
			this.lookups.blocks.set(x, y, block)
			this.gameObjects.blockContainer.add(block)
		}
	}

	_ClearBlock(column, row) {
		const block = this.lookups.blocks.data[column][row]
		if (!!block) {
			this.gameObjects.blockContainer.remove(block, true)
			this.lookups.blocks.set(column, row, 0)
		}
	}
}