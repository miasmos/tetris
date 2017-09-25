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
import ScoreManager from '../ScoreManager'
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
		this.score = new ScoreManager(this.emitter, UI.Score, UI.Grade, this.level)
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

		UI.Score.x = grid.x - 65
		UI.Score.y = grid.y + 200
		this.groups.game.add(UI.Score)
	
		UI.Level.x = grid.x - 55
		UI.Level.y = grid.y + grid.height - UI.Level.height
		this.groups.game.add(UI.Level)
	
		UI.Next.x = grid.x
		UI.Next.y = grid.y - UI.Next.height - 50
		this.groups.game.add(UI.Next)
	
		UI.Timer.x = grid.x + grid.width / 2 - UI.Timer.width / 2 - 2
		UI.Timer.y = grid.y + grid.height + 10
		this.groups.game.add(UI.Timer)

		UI.Grade.x = grid.x - UI.Grade.width - 15
		UI.Grade.y = grid.y
		this.groups.game.add(UI.Grade)
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
		let { state, emitter, grid, keyboard, level, score, sound, timer, paused, hardDrop, shouldUseSpawnDelay, didDropPiece, didMovePiece, gravity, engine } = this
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

		if ((timer.IsBefore(4, 15) && level.level >= 300 && score.score >= 12000) ||
			(timer.IsBefore(7, 30) && level.level >= 500 && score.score >= 40000) ||
			(timer.IsBefore(13, 30) && level.level === 999 && score.score >= 126000)) {
				score.SetGM()
			}
	
		if (state === Enum.GAME.STATE.SPAWN_TETROMINO) {
			let spin
			this.soft = 0

			if (this.level.level > 100) {
				grid.DisableShadow()
			}
	
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
				//  else {
				// 	this.SetState(Enum.GAME.STATE.LOSE)
				// 	return
				// }
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

				if (keyboard.isBuffered(Phaser.Keyboard.DOWN) && keyboard.isDown(Phaser.Keyboard.DOWN) && !FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
					this.soft += 1
				}
			}
	
			if (didMovePiece) {
				if (grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
					if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
						emitter.emit(Enum.GAME.EVENTS.PLACE)
						FrameTimeout.LockDelay()
					}
				} else {
					if (FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)) {
						FrameTimeout.Clear(Enum.GAME.FRAME_TIMEOUT_TYPES.LOCK_DELAY)
					}
				}
				didMovePiece = false
			}
		} else if (state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
			grid.AddTetrominoToGrid()

			const linesCleared = grid.LinesCleared()
			if (!!linesCleared) {
				emitter.emit(Enum.GAME.EVENTS.LOCK, [linesCleared, this.soft, grid.IsEmpty()])
				this.SetState(Enum.GAME.STATE.LINE_CLEARED)
			} else {
				emitter.emit(Enum.GAME.EVENTS.LOCK, [0, this.soft, grid.IsEmpty()])
				this.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
			}
		} else if (state === Enum.GAME.STATE.LINE_CLEARED) {
			const linesCleared = grid.LinesCleared()
	
			if (!FrameTimeout.IsSet(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
				FrameTimeout.LineClearDelay()
				grid.AnimateClearedLines()
				emitter.emit(Enum.GAME.EVENTS.LINE, [linesCleared, this.soft])
			}
	
			if (FrameTimeout.IsComplete(Enum.GAME.FRAME_TIMEOUT_TYPES.LINE_CLEAR_DELAY)) {
				grid.RemoveClearedLines()

				if (this.level.level === 999) {
					this.SetState(Enum.GAME.STATE.WIN)
				} else {
					this.SetState(Enum.GAME.STATE.SPAWN_TETROMINO)
				}
			}
		} else if (state === Enum.GAME.STATE.LOSE) {
			this.ShowMessage('GAME OVER')
			this.Pause(false)
			emitter.emit(Enum.GAME.EVENTS.LOSE)

			if (!keyboard.isBuffered(Phaser.Keyboard.SPACEBAR) && keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				keyboard.buffer(Phaser.Keyboard.SPACEBAR)
				PhaserGame.state.start(Enum.APP.STATE.MENU)
			}
		} else if (state === Enum.GAME.STATE.WIN) {
			this.ShowMessage('GAME OVER')
			this.Pause(false)
			emitter.emit(Enum.GAME.EVENTS.WIN)

			if (!keyboard.isBuffered(Phaser.Keyboard.SPACEBAR) && keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				keyboard.buffer(Phaser.Keyboard.SPACEBAR)
				PhaserGame.state.start(Enum.APP.STATE.MENU)
			}
		}
	
		// PhaserGame.debug.text(PhaserGame.time.fps || '--', 2, 14, "#00ff00")
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
			this.emitter.emit(Enum.GAME.EVENTS.PAUSE)
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
			this.emitter.emit(Enum.GAME.EVENTS.UNPAUSE)
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
		this.soft = 0
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