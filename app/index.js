import 'phaser-shim'
import { Game } from './js/Game'
import Grid from './js/GameObjects/Grid'
import TetrominoFactory from './js/TetrominoFactory'
import InputManager from './js/InputManager'
import Observer from './js/Observer'
import SoundManager from './js/SoundManager'
import UI from './js/UI'
import LevelManager from './js/LevelManager'
import TimerManager from './js/TimerManager'
import FrameTimeout from './js/FrameTimeout'
import Util from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json'),
	emitter = new Observer(),
	game = new Game(config.game.width, config.game.height)

let grid, Keyboard, Level, Sound, Timer, paused = false, hardDrop = false,
	shouldUseSpawnDelay = false, didMovePiece = false, didDropPiece = false, gravity = 0

game.OnCreate(PhaserGame => {
	PhaserGame.time.advancedTiming = true
	game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
})

game.OnUpdate(PhaserGame => {
	gravity = Level.Gravity()

	if (Keyboard.isDown(Phaser.Keyboard.P) && !Keyboard.isBuffered(Phaser.Keyboard.P)) {
		Keyboard.buffer(Phaser.Keyboard.P)
		
		if (paused) {
			game.RevertState()
			Timer.Start()
			paused = false
		} else {
			game.SetState(Enum.GAME.STATE.PAUSE)
			Timer.Pause()
			paused = true
		}
	}

	if (game.state === Enum.GAME.STATE.SPAWN_TETROMINO) {
		let spin

		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY) && shouldUseSpawnDelay) {
			FrameTimeout.SpawnDelay()
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY) || !shouldUseSpawnDelay) {
			shouldUseSpawnDelay = true

			if (Keyboard.isDown(Phaser.Keyboard.Z)) {
				Keyboard.buffer(Phaser.Keyboard.Z)
				spin = Enum.GAME.SPIN.CW
			} else if (Keyboard.isDown(Phaser.Keyboard.X)) {
				Keyboard.buffer(Phaser.Keyboard.X)
				spin = Enum.GAME.SPIN.CCW
			}

			const didPlace = grid.SpawnTetromino(spin)
			UI.Next.SetTetromino(TetrominoFactory.GetNext())

			if (didPlace) {
				emitter.emit(Enum.GAME.EVENTS.SPAWN, [TetrominoFactory.GetNext().name])
				FrameTimeout.Gravity(gravity)
				game.SetState(Enum.GAME.STATE.PLACING_TETROMINO)
			} else {
				game.SetState(Enum.GAME.STATE.LOSE)
			}
		}
	} else if (game.state === Enum.GAME.STATE.PLACING_TETROMINO) {
		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
			didDropPiece = false
			didMovePiece = false
			game.SetState(Enum.GAME.STATE.TETROMINO_COLLIDED)
			return
		}

		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)) {
			FrameTimeout.Gravity(gravity)
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.GRAVITY)) {
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetromino(0, 1)
				didMovePiece = true
			}
		}

		if (!didDropPiece) {
			if (!Keyboard.isBuffered(Phaser.Keyboard.Z) && Keyboard.isDown(Phaser.Keyboard.Z)) {
				Keyboard.buffer(Phaser.Keyboard.Z)
				const didSpin = grid.SpinTetromino(Enum.GAME.SPIN.CW)
				if (didSpin) {
					didMovePiece = true
				}
			} else if (!Keyboard.isBuffered(Phaser.Keyboard.X) && Keyboard.isDown(Phaser.Keyboard.X)) {
				Keyboard.buffer(Phaser.Keyboard.X)
				const didSpin = grid.SpinTetromino(Enum.GAME.SPIN.CCW)
				if (didSpin) {
					didMovePiece = true
				}
			}
		
			if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT) || FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT) || (Keyboard.isDown(Phaser.Keyboard.LEFT) && !Keyboard.isBuffered(Phaser.Keyboard.LEFT)) || (Keyboard.isDown(Phaser.Keyboard.RIGHT) && !Keyboard.isBuffered(Phaser.Keyboard.RIGHT))) {
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
			
			if (hardDrop && !Keyboard.isBuffered(Phaser.Keyboard.UP) && Keyboard.isDown(Phaser.Keyboard.UP)) {
				Keyboard.buffer(Phaser.Keyboard.UP)
				grid.DropTetromino()
				didDropPiece = true
				didMovePiece = true
			} else if (!Keyboard.isBuffered(Phaser.Keyboard.DOWN) && Keyboard.isDown(Phaser.Keyboard.DOWN)) {
				Keyboard.buffer(Phaser.Keyboard.DOWN, 10)
				if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
					grid.MoveTetromino(0, 1)
					didMovePiece = true
				}
			}
		}

		if (didMovePiece) {
			if (grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
					FrameTimeout.LockDelay()
				}
			}
			didMovePiece = false
		}
	} else if (game.state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
		grid.AddTetrominoToGrid()
			
		if (!!grid.LinesCleared()) {
			game.SetState(Enum.GAME.STATE.LINE_CLEARED)
		} else {
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		}
	} else if (game.state === Enum.GAME.STATE.LINE_CLEARED) {
		const numLinesCleared = grid.LinesCleared()

		if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
			FrameTimeout.LineClearDelay()
			console.log(grid)
			grid.AnimateClearedLines()
			emitter.emit(Enum.GAME.EVENTS.LINE, [numLinesCleared])
		}

		if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
			grid.RemoveClearedLines()
			game.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
		}
	} else if (game.state === Enum.GAME.STATE.LOSE) {

	}

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

	UI.Timer.x = grid.x + grid.width / 2 - UI.Timer.width / 2
	UI.Timer.y = grid.y + grid.height + 20
	PhaserGame.add.existing(UI.Timer)

	Keyboard = new InputManager()
	Level = new LevelManager(emitter, UI.Level)
	Timer = new TimerManager(UI.Timer)
	Timer.Start()
	Sound = new SoundManager(emitter)
	Sound.Play('BGM', true)
})

game.Start()