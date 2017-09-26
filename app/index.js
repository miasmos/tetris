import 'phaser-shim'
import Game from './js/States/Game'
import TitleScreen from './js/States/TitleScreen'
import { GameEngine, PhaserGame } from './js/PhaserGame'

const Enum = require('./enum.json'),
	engine = new GameEngine()
let game, menu

engine.on('create', PhaserGame => {
	PhaserGame.time.advancedTiming = true
	PhaserGame.stage.disableVisibilityChange = true
	game = new Game()
	menu = new TitleScreen()

	PhaserGame.state.add(Enum.APP.STATE.MENU, menu)
	PhaserGame.state.add(Enum.APP.STATE.GAME, game)
	PhaserGame.state.start(Enum.APP.STATE.MENU)
})