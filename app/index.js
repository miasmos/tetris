import 'phaser-shim'
import { Game } from './js/Game'
import Tetrimino from './js/GameObjects/Tetrimino'
import DebugGrid from './js/GameObjects/DebugGrid'
import Grid from './js/Grid'

const config = require('./config.json'),
	Enum = require('./enum.json')

const game = new Game(config.game.width, config.game.height)

game.OnCreate(PhaserGame => {
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.I))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.J, 64))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.L, 128))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.O, 192))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.S, 256))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.T, 320))
	PhaserGame.add.existing(new Tetrimino(config.tetriminos.Z, 384))

	const grid = new Grid()
	PhaserGame.add.existing(grid)

	// grid.add(new DebugGrid(grid))
	console.log(grid)
})

game.OnUpdate(PhaserGame => {
	
})

game.OnPreload(PhaserGame => {

})
game.Start()