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
let gameScene, levelText, goldText, track, goldRate, spawnTroop;
let gameOverScene;

let trackNodes = [];
let troops = [];
let enemies = [];
let bullets = [];
let levelNum = 1;
let gold = 0;
let paused = true;
let selecting = false;

function setup() {
	stage = app.stage;
	app.renderer.backgroundColor = 0x13871f;
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
	
	// #6 - Load Sounds
	
	// #7 - Load sprite sheet
		
}

//PURPOSE: Set up all buttons and labels in game
//ARGUMENTS: --
function createButtonsAndLabels(){
	//----placeholder style----
	let startAndGameOverStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontSize: 60,
		fontFamily: 'Comic Sans',
		stroke: 0x222222,
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
		stroke: 0x222222,
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

	spawnTroop = new PIXI.Text("Spawn Troop");
	spawnTroop.style = gameTextStyle;
	spawnTroop.x = 5;
	spawnTroop.y = 100;
	spawnTroop.interactive = true;
	spawnTroop.buttonMode = true;
	spawnTroop.on("pointerup", addTroop);
	spawnTroop.on("pointerover", e=>{e.target.alpha = .7;});
	spawnTroop.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	gameScene.addChild(spawnTroop);

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
	levelNum = 1;
	goldRate = (1/20) * levelNum;
	paused = false;
	selecting = true;
	changeGoldAmount(100);

	//make enemy towers
	let enemy = new Enemy(100, 300, 150, 4);
	enemies.push(enemy);
	gameScene.addChild(enemies[enemies.length - 1]);
	let enemy2 = new Enemy(620, 240, 150, 4);
	enemies.push(enemy2);
	gameScene.addChild(enemies[enemies.length - 1]);

	app.ticker.add(update);
}

//PURPOSE: End game and empty out game scene
//ARGUMENTS: --
function gameOver(){
	startScene.visible = false;
	gameScene.visible = false;
	gameOverScene.visible = true;

	app.ticker.remove(update);

	//clean out scene
	for(let i = 0; i < enemies.length; i++){
		gameScene.removeChild(enemies[i]);
		enemies.shift();
		i--;
	}

	paused = true;
	selecting = true;
	changeGoldAmount(-gold);
	changeLevelTo(1);
	goldRate = 0;

	killAll(bullets);
	killAll(troops);
	cleanUpObejcts(bullets);
	cleanUpObejcts(troops);
}

//PURPOSE: Add another troop at the beginning of the track
//ARGUMENTS: --
function addTroop(){
	if(gold >= 50){
		changeGoldAmount(-50);
		let troop = new Troop(trackNodes[0].x, trackNodes[0].y, 20, 5);
		troops.push(troop);
		gameScene.addChild(troops[troops.length - 1]);
	}
}

//PURPOSE: Change the level the player is currently on
//ARGUMENTS: Level to change to
function changeLevelTo(level){
	levelNum = level;
	levelText.text = `Level: ${levelNum}`;
}

//PURPOSE: Change the player's gold amount
//ARGUMENT: The amount of gold to give or take from the player
function changeGoldAmount(amount){
	gold += amount;
	goldText.text = `Gold: ${Math.trunc(gold)}`;
}

//PURPOSE: Update screen each frame
//ARGUMENTS: --
function update(){
	if(paused){return;}
	
	let deltaTime = 1 / app.ticker.FPS;
	if(deltaTime <= 1/12){deltaTime = 1/12;}

	//only earn gold if you have troops on the track
	if(troops.length == 0){selecting = true;}
	else{selecting = false;}
	
	if(!selecting){
		changeGoldAmount(goldRate);
	}

	//player can't buy troops if they don't have funds
	if(gold < 50){
		spawnTroop.interactive = false;
		spawnTroop.alpha = .7;

		if(troops.length == 0){
			gameOver();
			return;
		}
	}
	else{
		spawnTroop.interactive = true;
		spawnTroop.alpha = 1.0;
	}

	for(let i = 0; i < troops.length; i++){
		if(troops[i].position.y < -troops[i].size){
			troops[i].isAlive = false;
		}
		
		if(troops[i].isAlive){
			troops[i].move(deltaTime);
		}

		//have enemies track troops
		for(let j = 0; j < enemies.length; j++){
			if(i == 0){
				enemies[j].shotTimer -= deltaTime;
			}

			if(enemies[j].target != null && Vector2.distance(enemies[j].target.position, enemies[j].position) <= enemies[j].radius){
				if(enemies[j].shotTimer <= 0){
					enemies[j].shotTimer = enemies[j].fireSpeed;
					enemies[j].shoot(deltaTime);
				}

				if(!enemies[j].target.isAlive){
					enemies[j].target = null;
				}
					
				continue;
			}

			else if(Vector2.distance(troops[i].position, enemies[j].position) <= enemies[j].radius && enemies[j].target == null){
				if(!troops[i].isAlive){
					continue;
				}

				enemies[j].target = troops[i];
			}

			if(enemies[j].target != null && Vector2.distance(enemies[j].target.position, enemies[j].position) > enemies[j].radius){
				enemies[j].target = null;
			}
		}
	}

	//move bullets
	for(let i = 0; i < bullets.length; i++){
		if(bullets[i].isAlive){
			bullets[i].move(deltaTime);
		}
	}

	//remove dead bullets and troops
	cleanUpObejcts(bullets);
	cleanUpObejcts(troops);
}

//PURPOSE: A clean up objects that are dead
//ARGUMENTS: A list of game objects with the isAlive property
function cleanUpObejcts(objList){
	for(let i = 0; i < objList.length; i++){
		if(!objList[i].isAlive){
			gameScene.removeChild(objList[i]);
			objList.splice(i, 1);
			i--;
		}
	}
}

//PURPOSE: A very dramatic sounding function that toggles alive status of gameObjects
//ARGUMENTS: A list of game objects with the isAlive property
function killAll(objList){
	for(let i = 0; i < objList.length; i++){
		objList[i].isAlive = false;

		//remove health bar if it has one
		if(objList[i].healthBarGreen && objList[i].healthBarRed){
			gameScene.removeChild(objList[i].healthBarGreen);
			gameScene.removeChild(objList[i].healthBarRed);
		}
	}
}