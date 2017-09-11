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
		if (PhaserGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.WEST)) {
				grid.MoveTetrimino(-1, 0)
			}
		} else if (PhaserGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			if (!grid.TetriminoWillCollide(Enum.GAME.DIRECTION.EAST)) {
				grid.MoveTetrimino(1, 0)
			}
		} else if (PhaserGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			grid.SpinTetrimino()
		}
	} else if (game.state === Enum.GAME.STATE.TETRIMINO_COLLIDED) {
		grid.AddTetriminoToGrid()
		game.SetState(Enum.GAME.STATE.IDLE)
	}

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