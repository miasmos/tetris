import 'phaser-shim'
import { Game } from './js/Game'
import Grid from './js/GameObjects/Grid'
import Input from './js/Input'
import NumericTextDisplay from './js/GameObjects/NumericTextDisplay'
import Util from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json'),
	game = new Game(config.game.width, config.game.height)

let grid, score, level, lines, Keyboard, lastClearWasQuad = false

function OnDrop() {
	if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
		grid.MoveTetromino(0, 1)
		score.Add(config.game.points.drop)
	} else {
		game.StopDropInterval(config.game.dropInterval, OnDrop, grid)
		game.SetState(Enum.GAME.STATE.TETROMINO_COLLIDED)
	}
}

game.OnCreate(PhaserGame => {
	PhaserGame.time.advancedTiming = true
})

game.OnUpdate(PhaserGame => {
	Util.Benchmark.start('update')
	if (game.state === Enum.GAME.STATE.IDLE) {
		const didPlace = grid.SpawnTetromino()

		if (didPlace) {
			game.StartDropInterval(config.game.dropInterval, OnDrop, grid)
			game.SetState(Enum.GAME.STATE.PLACING_TETROMINO)
		} else {
			//lose state
			game.SetState(Enum.GAME.STATE.PAUSE)
			console.log('loser')
		}
	} else if (game.state === Enum.GAME.STATE.PLACING_TETROMINO) {
		if (!Keyboard.isBuffered(Phaser.Keyboard.LEFT) && Keyboard.isDown(Phaser.Keyboard.LEFT)) {
			Keyboard.buffer(Phaser.Keyboard.LEFT)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
				grid.MoveTetromino(-1, 0)
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.RIGHT) && Keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			Keyboard.buffer(Phaser.Keyboard.RIGHT)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
				grid.MoveTetromino(1, 0)
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.UP) && Keyboard.isDown(Phaser.Keyboard.UP)) {
			Keyboard.buffer(Phaser.Keyboard.UP)
			grid.SpinTetromino()
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.DOWN) && Keyboard.isDown(Phaser.Keyboard.DOWN)) {
			Keyboard.buffer(Phaser.Keyboard.DOWN, 50)
			if (!grid.TetrominoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetromino(0, 1)
				score.Add(config.game.points.drop)
			}
		}
	} else if (game.state === Enum.GAME.STATE.TETROMINO_COLLIDED) {
		grid.AddTetrominoToGrid()
		lastClearWasQuad = false

		if (!!grid.LinesCleared()) {
			game.SetState(Enum.GAME.STATE.LINE_CLEARED)
		} else {
			game.SetState(Enum.GAME.STATE.IDLE)
		}
	} else if (game.state === Enum.GAME.STATE.LINE_CLEARED) {
		const numLinesCleared = grid.LinesCleared()

		grid.ClearLines(() => {
			switch(numLinesCleared) {
				case 2:
					score.Add(config.game.points.double * level.Number())
					break
				case 3:
					score.Add(config.game.points.triple * level.Number())
					break
				case 4:
					if (lastClearWasQuad) {
						score.Add(config.game.points.consecutiveQuad * level.Number())
					} else {
						score.Add(config.game.points.quad * level.Number())
					}
					lastClearWasQuad = true
					break
				default:
					score.Add(config.game.points.line * numLinesCleared * level.Number())
					break
			}
			lines.Add(numLinesCleared)

			game.SetState(Enum.GAME.STATE.IDLE)
		})
	}

	Util.Benchmark.end('update')
	PhaserGame.debug.text(PhaserGame.time.fps || '--', 2, 14, "#00ff00")
})

game.OnPreload(PhaserGame => {
	grid = new Grid()
	PhaserGame.add.existing(grid)

	score = new NumericTextDisplay('SCORE')
	score.x = grid.x - 100
	score.y = grid.y + 100
	PhaserGame.add.existing(score)

	level = new NumericTextDisplay('LEVEL', 1)
	level.x = grid.x - 97
	level.y = score.y + 60
	PhaserGame.add.existing(level)

	lines = new NumericTextDisplay('LINES')
	lines.x = grid.x - 97
	lines.y = level.y + 60
	PhaserGame.add.existing(lines)

	Keyboard = new Input()
})

game.Start()