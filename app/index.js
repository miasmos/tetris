import 'phaser-shim'
import { Game } from './js/Game'
import Grid from './js/GameObjects/Grid'
import Player from './js/Player'
import Input from './js/Input'
import Util from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json'),
	game = new Game(config.game.width, config.game.height)

let grid, player, Keyboard

function OnDrop() {
	if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.SOUTH)) {
		grid.MoveTetrimino(0, 1)
	} else {
		game.StopDropInterval(config.game.dropInterval, OnDrop, grid)
		game.SetState(Enum.GAME.STATE.TETRIMINO_COLLIDED)
	}
}

game.OnCreate(PhaserGame => {
	PhaserGame.time.advancedTiming = true
})

game.OnUpdate(PhaserGame => {
	Util.Benchmark.start('update')
	if (game.state === Enum.GAME.STATE.IDLE) {
		const didPlace = grid.SpawnTetrimino()

		if (didPlace) {
			game.StartDropInterval(config.game.dropInterval, OnDrop, grid)
			game.SetState(Enum.GAME.STATE.PLACING_TETRIMINO)
		} else {
			//lose state
			game.SetState(Enum.GAME.STATE.PAUSE)
			console.log('loser')
		}
	} else if (game.state === Enum.GAME.STATE.PLACING_TETRIMINO) {
		if (!Keyboard.isBuffered(Phaser.Keyboard.LEFT) && Keyboard.isDown(Phaser.Keyboard.LEFT)) {
			Keyboard.buffer(Phaser.Keyboard.LEFT)
			if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.LEFT)) {
				grid.MoveTetrimino(-1, 0)
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.RIGHT) && Keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			Keyboard.buffer(Phaser.Keyboard.RIGHT)
			if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.RIGHT)) {
				grid.MoveTetrimino(1, 0)
			}
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.UP) && Keyboard.isDown(Phaser.Keyboard.UP)) {
			Keyboard.buffer(Phaser.Keyboard.UP)
			grid.SpinTetrimino()
		} else if (!Keyboard.isBuffered(Phaser.Keyboard.DOWN) && Keyboard.isDown(Phaser.Keyboard.DOWN)) {
			// Keyboard.buffer(Phaser.Keyboard.DOWN)
			if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.DOWN)) {
				grid.MoveTetrimino(0, 1)
			}
		}
	} else if (game.state === Enum.GAME.STATE.TETRIMINO_COLLIDED) {
		grid.AddTetriminoToGrid()

		if (grid.LineCleared()) {
			game.SetState(Enum.GAME.STATE.LINE_CLEARED)
		} else {
			game.SetState(Enum.GAME.STATE.IDLE)
		}
	} else if (game.state === Enum.GAME.STATE.LINE_CLEARED) {
		grid.ClearLines(() => {game.SetState(Enum.GAME.STATE.IDLE)})
	}
Util.Benchmark.end('update')
	PhaserGame.debug.text(PhaserGame.time.fps || '--', 2, 14, "#00ff00")
	PhaserGame.debug.text(game.state, 2, 34, "#00ff00")
})

game.OnPreload(PhaserGame => {
	grid = new Grid()
	PhaserGame.add.existing(grid)
	player = new Player()
	Keyboard = new Input()
})
game.Start()