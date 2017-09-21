import 'phaser-shim'
import { PhaserGame } from '../PhaserGame'
import Grid from '../GameObjects/Grid'
import TetrominoFactory from '../TetrominoFactory'
import InputManager from '../InputManager'
import Observer from '../Observer'
import SoundManager from '../SoundManager'
import UI from '../UI'
import LevelManager from '../LevelManager'
import TimerManager from '../TimerManager'
import FrameTimeout from '../FrameTimeout'
import RegularText from '../GameObjects/RegularText'
import Util from '../Util'

const config = require('../../config.json'),
	Enum = require('../../enum.json')

export default class Game {
	create() {
		UI.Init()
		this.Reset()
		this.keyboard = new InputManager()
		this.level = new LevelManager(this.emitter, UI.Level)
		this.timer = new TimerManager(UI.Timer)
		this.sound = new SoundManager(this.emitter)

		this.groups = {
			game: new Phaser.Group(PhaserGame),
			message: new Phaser.Group(PhaserGame)
		}
		this.game.add.existing(this.groups.game)
		this.game.add.existing(this.groups.message)

		//set up game ui
		let grid = new Grid()
		this.groups.game.add(grid)

		UI.Score.x = grid.x - 100
		UI.Score.y = grid.y + 100
		this.groups.game.add(UI.Score)
	
		UI.Level.x = grid.x - 97
		UI.Level.y = UI.Score.y + 60
		this.groups.game.add(UI.Level)
	
		UI.Next.x = grid.x + grid.width + 100 - UI.Next.width
		UI.Next.y = grid.y + 100
		this.groups.game.add(UI.Next)
	
		UI.Timer.x = grid.x + grid.width / 2 - UI.Timer.width / 2 - 2
		UI.Timer.y = grid.y + grid.height + 20
		this.groups.game.add(UI.Timer)
		//end set up game ui

		//set up message ui
		let message = new RegularText(PhaserGame)
		this.groups.message.exists = false
		this.groups.message.add(message)
		this.message = message
		//end set up message ui
	
		this.grid = grid

		this.timer.Start()
		this.sound.Play('BGM', true)
		this.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
	}

	update() {
		let { state, emitter, grid, keyboard, level, sound, timer, paused, hardDrop, shouldUseSpawnDelay, didDropPiece, didMovePiece, gravity, engine } = this
		gravity = level.Gravity()
	
		if (keyboard.isDown(Phaser.Keyboard.P) && !keyboard.isBuffered(Phaser.Keyboard.P)) {
			keyboard.buffer(Phaser.Keyboard.P)
			
			if (paused) {
				this.Unpause(PhaserGame)
				this.HideMessage()
			} else {
				this.Pause(PhaserGame)
				this.ShowMessage('PAUSE')
			}
		}
	
		if (state === Enum.GAME.STATE.SPAWN_TETROMINO) {
			let spin
	
			if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY) && shouldUseSpawnDelay) {
				FrameTimeout.SpawnDelay()
			}
	
			if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.SPAWN_DELAY) || !shouldUseSpawnDelay) {
				shouldUseSpawnDelay = true
	
				if (keyboard.isDown(Phaser.Keyboard.Z)) {
					keyboard.buffer(Phaser.Keyboard.Z)
					spin = Enum.GAME.SPIN.CW
				} else if (keyboard.isDown(Phaser.Keyboard.X)) {
					keyboard.buffer(Phaser.Keyboard.X)
					spin = Enum.GAME.SPIN.CCW
				}
	
				const didPlace = grid.SpawnTetromino(spin)
				UI.Next.SetTetromino(TetrominoFactory.GetNext())
	
				if (didPlace) {
					emitter.emit(Enum.GAME.EVENTS.SPAWN, [TetrominoFactory.GetNext().name])
					FrameTimeout.Gravity(gravity)
					this.SetState(Enum.GAME.STATE.PLACING_TETROMINO)
				} else {
					this.SetState(Enum.GAME.STATE.LOSE)
				}
			}
		} else if (state === Enum.GAME.STATE.PLACING_TETROMINO) {
			if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
				didDropPiece = false
				didMovePiece = false
				this.SetState(Enum.GAME.STATE.TETROMINO_COLLIDED)
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
				if (!keyboard.isBuffered(Phaser.Keyboard.Z) && keyboard.isDown(Phaser.Keyboard.Z)) {
					keyboard.buffer(Phaser.Keyboard.Z)
					const didSpin = grid.SpinTetromino(Enum.GAME.SPIN.CW)
					if (didSpin) {
						didMovePiece = true
					}
				} else if (!keyboard.isBuffered(Phaser.Keyboard.X) && keyboard.isDown(Phaser.Keyboard.X)) {
					keyboard.buffer(Phaser.Keyboard.X)
					const didSpin = grid.SpinTetromino(Enum.GAME.SPIN.CCW)
					if (didSpin) {
						didMovePiece = true
					}
				}
			
				if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT) || FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.DELAYED_AUTO_SHIFT) || (this.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.keyboard.isBuffered(Phaser.Keyboard.LEFT)) || (this.keyboard.isDown(Phaser.Keyboard.RIGHT) && !this.keyboard.isBuffered(Phaser.Keyboard.RIGHT))) {
					if (keyboard.isDown(Phaser.Keyboard.LEFT)) {
						FrameTimeout.DelayedAutoShift()
						keyboard.buffer(Phaser.Keyboard.LEFT)
	
						if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
							grid.MoveTetromino(-1, 0)
							didMovePiece = true
						}
					} else if (keyboard.isDown(Phaser.Keyboard.RIGHT)) {
						FrameTimeout.DelayedAutoShift()
						keyboard.buffer(Phaser.Keyboard.RIGHT)
	
						if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
							grid.MoveTetromino(1, 0)
							didMovePiece = true
						}
					}
				}
				
				if (hardDrop && !keyboard.isBuffered(Phaser.Keyboard.UP) && keyboard.isDown(Phaser.Keyboard.UP)) {
					keyboard.buffer(Phaser.Keyboard.UP)
					grid.DropTetromino()
					didDropPiece = true
					didMovePiece = true
				} else if (!keyboard.isBuffered(Phaser.Keyboard.DOWN) && keyboard.isDown(Phaser.Keyboard.DOWN)) {
					keyboard.buffer(Phaser.Keyboard.DOWN, 10)
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
		} else if (state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
			grid.AddTetrominoToGrid()
				
			if (!!grid.LinesCleared()) {
				this.SetState(Enum.GAME.STATE.LINE_CLEARED)
			} else {
				this.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
			}
		} else if (state === Enum.GAME.STATE.LINE_CLEARED) {
			const numLinesCleared = grid.LinesCleared()
	
			if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
				FrameTimeout.LineClearDelay()
				grid.AnimateClearedLines()
				emitter.emit(Enum.GAME.EVENTS.LINE, [numLinesCleared])
			}
	
			if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
				grid.RemoveClearedLines()
				this.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
			}
		} else if (state === Enum.GAME.STATE.LOSE) {
			this.ShowMessage('GAME OVER')
			this.Pause(false)

			if (!keyboard.isBuffered(Phaser.Keyboard.SPACEBAR) && keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				keyboard.buffer(Phaser.Keyboard.SPACEBAR)
				PhaserGame.state.start(Enum.APP.STATE.MENU)
			}
		}
	
		PhaserGame.debug.text(PhaserGame.time.fps || '--', 2, 14, "#00ff00")
	}

	focus() {
		this.Unpause()
	}

	blur() {
		this.Pause()
	}

	Pause(shouldChangeState = true) {
		if (!this.paused) {
			if (shouldChangeState) {
				this.SetState(Enum.GAME.STATE.PAUSE)
			}
			this.timer.Pause()
			this.groups.game.alpha = 0.2
			this.paused = true
		}
	}

	Unpause(shouldChangeState = true) {
		if (this.paused) {
			if (shouldChangeState) {
				this.RevertState()
			}
			this.timer.Start()
			this.groups.game.alpha = 1
			this.paused = false
		}
	}

	Reset(PhaserGame) {
		this.state = Enum.GAME.STATE.IDLE
		this.grid = undefined
		this.keyboard = undefined
		this.level = undefined
		this.sound = undefined
		this.timer = undefined
		this.paused = false
		this.hardDrop = false
		this.shouldUseSpawnDelay = false
		this.didMovePiece = false
		this.didDropPiece = false
		this.emitter = new Observer()
		this.gravity = 0
	}

	SetState(state) {
		if (Object.values(Enum.GAME.STATE).indexOf(state) > -1) {
			this.lastState = this.state
			this.state = state
		}
	}

	RevertState(state) {
		this.state = this.lastState
	}

	ShowMessage(text) {
		this.message.text = text
		this.message.y = config.game.height / 2 - this.message.height / 2
		this.message.x = config.game.width / 2 - this.message.width / 2
		this.groups.message.alpha = 1
		this.groups.message.exists = true
	}

	HideMessage() {
		this.groups.message.alpha = 0
		this.groups.message.exists = false
	}
}