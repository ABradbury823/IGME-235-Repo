"use strict";
const app = new PIXI.Application({
    width: 800,
    height: 600
});
document.body.appendChild(app.view);

// constants
const WIDTH = app.view.width;
const HEIGHT = app.view.height;	

// pre-load the images
app.loader.add([""]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let gameScene, levelText, goldText, track;
let gameOverScene;

let trackNodes = [];
let troops = [];
let levelNum = 1;
let gold = 0;
let paused = true;

function setup() {
	stage = app.stage;
	app.renderer.backgroundColor = 0xe4e88e;
	// #1 - Create the `start` scene
	startScene = new PIXI.Container();
	stage.addChild(startScene);
	
	// #2 - Create the main `game` scene and make it invisible
	gameScene = new PIXI.Container();
	gameScene.visible = false;
	stage.addChild(gameScene);

	// #3 - Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
	gameOverScene.visible = false;
	stage.addChild(gameOverScene);

	// #4 - Create labels for all 3 scenes
	createButtonsAndLabels();

	// #5 - Create track
	trackNodes = [
				new TrackNode(600, HEIGHT + 10),		//starting node
				new TrackNode(600, 500, -1, 0),
				new TrackNode(100, 500, 0, -1),
				new TrackNode(100, 400, 1, 0),
				new TrackNode(700, 400, 0, -1),
				new TrackNode(700, 300, -1, 0),
				new TrackNode(200, 300, 0, -1),
				new TrackNode(200, -10)					//ending node
	];

	for(let i = 0; i < trackNodes.length; i++){gameScene.addChild(trackNodes[i]);}

	track = new Track(trackNodes, 50);
	track.draw();

	let troop = new Troop(trackNodes[0].x, trackNodes[0].y, 2);
	troops.push(troop);
	gameScene.addChild(troops[0]);
	
	// #6 - Load Sounds
	
	// #7 - Load sprite sheet
		
	// #8 - Start update loop
	
	// #9 - Start listening for click events on the canvas
	
	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}

//PURPOSE: Set up all buttons and labels in game
//ARGUMENTS: --
function createButtonsAndLabels(){
	//----placeholder style----
	let startAndGameOverStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontSize: 60,
		fontFamily: 'Comic Sans',
		stroke: 0x999999,
		strokeThickness: 5
	});

	//**start scene layout**
	//Game name text
	let startLabel = new PIXI.Text("Siege the Castle!");
	startLabel.style = startAndGameOverStyle;
	startLabel.x = 175;
	startLabel.y = 200;
	startScene.addChild(startLabel);

	//start game button
	let startButton = new PIXI.Text("Start Game");
	startButton.style = startAndGameOverStyle;
	startButton.x = 250;
	startButton.y = HEIGHT - 200;
	startButton.interactive = true;
	startButton.buttonMode = true;
	startButton.on("pointerup", startGame);
	startButton.on("pointerover", e=>{e.target.alpha = .7;});
	startButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	startScene.addChild(startButton);

	//**game scene layout**
	let gameTextStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontSize: 20,
		fontFamily: 'Comic Sans',
		stroke: 0x999999,
		strokeThickness: 3
	});

	//level label
	levelText = new PIXI.Text();
	levelText.style = gameTextStyle;
	levelText.x = 5;
	levelText.y = 5;
	gameScene.addChild(levelText);
	changeLevelTo(1);

	//gold label
	goldText = new PIXI.Text();
	goldText.style = gameTextStyle;
	goldText.x = 5;
	goldText.y = 25;
	gameScene.addChild(goldText);
	changeGoldAmount(0);

	//end game button (debugging)
	let endGameButton = new PIXI.Text("End Game");
	endGameButton.style = gameTextStyle;
	endGameButton.x = WIDTH - 100;
	endGameButton.y = 15;
	endGameButton.interactive = true;
	endGameButton.buttonMode = true;
	endGameButton.on("pointerup", gameOver);
	endGameButton.on("pointerover", e=>{e.target.alpha = .7;});
	endGameButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	gameScene.addChild(endGameButton);

	//**game over scene**
	//game over text
	let gameOverText = new PIXI.Text("Game Over");
	gameOverText.style = startAndGameOverStyle;
	gameOverText.x = 250;
	gameOverText.y = 200;
	gameOverScene.addChild(gameOverText);
	
	//play again button
	let playAgainButton = new PIXI.Text("Play Again");
	playAgainButton.style = startAndGameOverStyle;
	playAgainButton.x = 260;
	playAgainButton.y = HEIGHT - 200;
	playAgainButton.interactive = true;
	playAgainButton.buttonMode = true;
	playAgainButton.on("pointerup", startGame);
	playAgainButton.on("pointerover", e=>{e.target.alpha = .7;});
	playAgainButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	gameOverScene.addChild(playAgainButton);
}

//PURPOSE: Initialize game variables and start the game 
//ARGUMENTS: --
function startGame(){
	startScene.visible = false;
	gameOverScene.visible = false;
	gameScene.visible = true;

	//more when levels, player, and enemies are built
	app.ticker.add(update);
}

//PURPOSE: End game and empty out game scene
//ARGUMENTS: --
function gameOver(){
	startScene.visible = false;
	gameScene.visible = false;
	gameOverScene.visible = true;

	//clean out scene
}

//PURPOSE: Change the level the player is currently on
//ARGUMENTS: Level to change to
function changeLevelTo(level){
	levelNum = level;
	levelText.text = `Level: ${levelNum}`;
}

//PURPOSE: Change the player's gold amount
//ARGUMENT: The amount of gold to give or take from the player
function changeGoldAmount(rate){
	gold += rate;
	goldText.text = `Gold: ${gold}`;
}

function update(){
	troops[0].move();
}