import 'phaser-shim'
import { Game } from './js/Game'
import Grid from './js/GameObjects/Grid'
import TetrominoFactory from './js/TetrominoFactory'
import Input from './js/Input'
import UI from './js/UI'
import Util from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json'),
	game = new Game(config.game.width, config.game.height)

let grid, Keyboard, lastClearWasQuad = false

function OnDrop() {
	if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
		grid.MoveTetromino(0, 1)
		UI.Score.Add(config.game.points.drop)
	} else {
		game.StopDropInterval(config.game.dropInterval, OnDrop, grid)
		game.SetState(Enum.GAME.STATE.TETROMINO_COLLIDED)
	}
}

game.OnCreate(PhaserGame => {
	PhaserGame.time.advancedTiming = true
	game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
})

game.OnUpdate(PhaserGame => {
	Util.Benchmark.start('update')
	if (game.state === Enum.GAME.STATE.SPAWN_TETROMINO) {
		let spin

		if (Keyboard.isDown(Phaser.Keyboard.Z)) {
			spin = Enum.GAME.SPIN.CW
		} else if (Keyboard.isDown(Phaser.Keyboard.X)) {
			spin = Enum.GAME.SPIN.CCW
		}

		const didPlace = grid.SpawnTetromino(spin)
		UI.Next.SetTetromino(TetrominoFactory.GetNext())

		if (didPlace) {
			game.StartDropInterval(config.game.dropInterval, OnDrop, grid)
			game.SetState(Enum.GAME.STATE.PLACING_TETROMINO)
		} else {
			//lose state
			game.SetState(Enum.GAME.STATE.PAUSE)
			console.log('loser')
		}
	} else if (game.state === Enum.GAME.STATE.PLACING_TETROMINO) {
		let didMove = false

		if (!Keyboard.isBuffered(Phaser.Keyboard.Z) && Keyboard.isDown(Phaser.Keyboard.Z)) {
			Keyboard.buffer(Phaser.Keyboard.Z)
			grid.SpinTetromino(Enum.GAME.SPIN.CW)
			didMove = true
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.X) && Keyboard.isDown(Phaser.Keyboard.X)) {
			Keyboard.buffer(Phaser.Keyboard.X)
			grid.SpinTetromino(Enum.GAME.SPIN.CCW)
			didMove = true
		}

		if (!Keyboard.isBuffered(Phaser.Keyboard.LEFT) && Keyboard.isDown(Phaser.Keyboard.LEFT)) {
			Keyboard.buffer(Phaser.Keyboard.LEFT, 50)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
				grid.MoveTetromino(-1, 0)
				didMove = true
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.RIGHT) && Keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			Keyboard.buffer(Phaser.Keyboard.RIGHT, 50)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
				grid.MoveTetromino(1, 0)
				didMove = true
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.UP) && Keyboard.isDown(Phaser.Keyboard.UP)) {
			Keyboard.buffer(Phaser.Keyboard.UP)
			grid.DropTetromino()
			didMove = true
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.DOWN) && Keyboard.isDown(Phaser.Keyboard.DOWN)) {
			Keyboard.buffer(Phaser.Keyboard.DOWN, 50)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetromino(0, 1)
				didMove = true
				UI.Score.Add(config.game.points.drop)
			}
		}

		if (didMove) {
			game.ResetDropInterval()
		}
	} else if (game.state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
		grid.AddTetrominoToGrid()

		if (!!grid.LinesCleared()) {
			game.SetState(Enum.GAME.STATE.LINE_CLEARED)
		} else {
			lastClearWasQuad = false
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		}

		grid.matrix.log()
	} else if (game.state === Enum.GAME.STATE.LINE_CLEARED) {
		const numLinesCleared = grid.LinesCleared()

		grid.ClearLines(() => {
			switch(numLinesCleared) {
				case 2:
					UI.Score.Add(config.game.points.double * UI.Level.Number())
					break
				case 3:
					UI.Score.Add(config.game.points.triple * UI.Level.Number())
					break
				case 4:
					if (lastClearWasQuad) {
						UI.Score.Add(config.game.points.consecutiveQuad * UI.Level.Number())
					} else {
						UI.Score.Add(config.game.points.quad * UI.Level.Number())
					}
					break
				default:
					UI.Score.Add(config.game.points.line * numLinesCleared * UI.Level.Number())
					break
			}

			if (numLinesCleared === 4) {
				lastClearWasQuad = true
			} else {
				lastClearWasQuad = false
			}

			UI.Lines.Add(numLinesCleared)
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		})

		game.SetState(Enum.GAME.STATE.IDLE)
	}

	Util.Benchmark.end('update')
	PhaserGame.debug.text(PhaserGame.time.fps || '--', 2, 14, "#00ff00")
})

game.OnPreload(PhaserGame => {
	UI.Init()

	grid = new Grid()
	PhaserGame.add.existing(grid)

	UI.Score.x = grid.x - 100
	UI.Score.y = grid.y + 100
	PhaserGame.add.existing(UI.Score)

	UI.Level.x = grid.x - 97
	UI.Level.y = UI.Score.y + 60
	PhaserGame.add.existing(UI.Level)

	UI.Lines.x = grid.x - 97
	UI.Lines.y = UI.Level.y + 60
	PhaserGame.add.existing(UI.Lines)

	UI.Next.x = grid.x + grid.width + 100 - UI.Next.width
	UI.Next.y = grid.y + 100
	PhaserGame.add.existing(UI.Next)

	Keyboard = new Input()
})

game.Start()