import 'phaser-shim'
import { Game } from '../Game'
const Enum = require('../../enum.json'),
	game = new Game()

export default class ActiveGameObject {
	constructor(priority = Enum.PRIORITY.MEDIUM) {
		this.priority = priority
		this.uuid = game.OnUpdate(this.Update.bind(this), priority)
	}

	Update() {
	}

	Destroy() {
		game.OffUpdate(this.uuid, this.priority)
	}
}