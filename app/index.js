import 'phaser-shim'
import { Game } from './js/Game'
import Grid from './js/GameObjects/Grid'
import TetrominoFactory from './js/TetrominoFactory'
import Input from './js/Input'
import UI from './js/UI'
import LevelTracker from './js/LevelTracker'
import FrameTimeout from './js/FrameTimeout'
import Util from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json'),
	game = new Game(config.game.width, config.game.height)

let grid, Keyboard, Level,
	didMovePiece = false, didShiftPiece = false, canLock = false, gravity = 0

game.OnCreate(PhaserGame => {
	PhaserGame.time.advancedTiming = true
	game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
})

game.OnUpdate(PhaserGame => {
	// Util.Benchmark.start('update')
	gravity = Level.Gravity()

	if (game.state === Enum.GAME.STATE.SPAWN_TETROMINO) {
		let spin

		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY)) {
			FrameTimeout.SpawnDelay()
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY)) {
			Level.Add()

			if (Keyboard.isDown(Phaser.Keyboard.Z)) {
				spin = Enum.GAME.SPIN.CW
			} else if (Keyboard.isDown(Phaser.Keyboard.X)) {
				spin = Enum.GAME.SPIN.CCW
			}

			const didPlace = grid.SpawnTetromino(spin)
			UI.Next.SetTetromino(TetrominoFactory.GetNext())

			if (didPlace) {
				game.SetState(Enum.GAME.STATE.PLACING_TETROMINO)
			} else {
				//lose state
				game.SetState(Enum.GAME.STATE.PAUSE)
				console.log('loser')
			}
		}
	} else if (game.state === Enum.GAME.STATE.PLACING_TETROMINO) {
		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)) {
			FrameTimeout.Gravity(gravity)
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)) {
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetromino(0, 1)
				didMovePiece = true
			}
		}

		if (!Keyboard.isBuffered(Phaser.Keyboard.Z) && Keyboard.isDown(Phaser.Keyboard.Z)) {
			Keyboard.buffer(Phaser.Keyboard.Z)
			grid.SpinTetromino(Enum.GAME.SPIN.CW)
			didMovePiece = true
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.X) && Keyboard.isDown(Phaser.Keyboard.X)) {
			Keyboard.buffer(Phaser.Keyboard.X)
			grid.SpinTetromino(Enum.GAME.SPIN.CCW)
			didMovePiece = true
		}

		let autoshiftTimeoutSet = FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT)
		if (!autoshiftTimeoutSet || FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT) || (Keyboard.isDown(Phaser.Keyboard.LEFT) && !Keyboard.isBuffered(Phaser.Keyboard.LEFT)) || (Keyboard.isDown(Phaser.Keyboard.RIGHT) && !Keyboard.isBuffered(Phaser.Keyboard.RIGHT))) {
			if (Keyboard.isDown(Phaser.Keyboard.LEFT)) {
				FrameTimeout.DelayedAutoShift()
				Keyboard.buffer(Phaser.Keyboard.LEFT)

				if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
					grid.MoveTetromino(-1, 0)
					didMovePiece = true
				}
			} else if (Keyboard.isDown(Phaser.Keyboard.RIGHT)) {
				FrameTimeout.DelayedAutoShift()
				Keyboard.buffer(Phaser.Keyboard.RIGHT)

				if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
					grid.MoveTetromino(1, 0)
					didMovePiece = true
				}
			}
		}

		if (!Keyboard.isBuffered(Phaser.Keyboard.UP) && Keyboard.isDown(Phaser.Keyboard.UP)) {
			Keyboard.buffer(Phaser.Keyboard.UP)
			grid.DropTetromino()
			didMovePiece = true
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.DOWN) && Keyboard.isDown(Phaser.Keyboard.DOWN)) {
			Keyboard.buffer(Phaser.Keyboard.DOWN, 50)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetromino(0, 1)
				didMovePiece = true
			}
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
			game.SetState(Enum.GAME.STATE.TETROMINO_COLLIDED)
		}

		if (didMovePiece) {
			if (grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				FrameTimeout.LockDelay()
			}
			FrameTimeout.Clear(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)
			didMovePiece = false
		}
	} else if (game.state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
		grid.AddTetrominoToGrid()
			
		if (!!grid.LinesCleared()) {
			game.SetState(Enum.GAME.STATE.LINE_CLEARED)
		} else {
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		}

		grid.matrix.log()
	} else if (game.state === Enum.GAME.STATE.LINE_CLEARED) {
		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
			FrameTimeout.LineClearDelay()
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		}

		const numLinesCleared = grid.LinesCleared()
		Level.Add(numLinesCleared, Enum.GAME.LEVEL_TYPES.LINE)
		grid.ClearLines()
	}

	// Util.Benchmark.end('update')
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

	Level = new LevelTracker(UI.Level)
})

game.Start()