import 'phaser-shim'
import { Game } from './js/Game'
import Tetrimino from './js/Tetrimino'
import DebugGrid from './js/GameObjects/DebugGrid'
import TetriminoFactory from './js/TetriminoFactory'
import Grid from './js/GameObjects/Grid'
import { Matrix } from './js/Util'

const config = require('./config.json'),
	Enum = require('./enum.json')

const game = new Game(config.game.width, config.game.height)

game.OnCreate(PhaserGame => {
	const tetrimino = TetriminoFactory.Get(Enum.GAME.TETRIMINO.Z)
	Matrix.log(tetrimino.matrix)
	Matrix.log(tetrimino.RotateCW())
	Matrix.log(tetrimino.RotateCW())

	const grid = new Grid()
	PhaserGame.add.existing(grid)
})

game.OnUpdate(PhaserGame => {

})

game.OnPreload(PhaserGame => {

})
game.Start()