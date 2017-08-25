const PIXI = require('pixi'),
	p2 = require('p2'),
	Phaser = require('phaser'),
	config = require('./config.json')
	game = new Phaser.Game(config.game.width, config.game.height, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	// game.load.image('polygon', require('./assets/polygon.png'))
}

function create() {
	game.add.sprite(0, 0, '')
}

function update() {
}