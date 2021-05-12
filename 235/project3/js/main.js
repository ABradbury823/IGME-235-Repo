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
app.loader.add([
	"media/sprites/knight.png",
	"media/sprites/tower.png",
	"media/sprites/wall.png",
	"media/sprites/bullet.png"
]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// aliases
let stage;

// game variables
let startScene;
let gameScene, levelText, goldText, goldRate, spawnTroopButton, shootSound, destroySound, moneySound, hitSound, clickSound;
let gameOverScene;
let victoryScene;

let troops = [];
let enemies = [];
let bullets = [];
let barricade = null;
let levelNum = 1;
let gold = 0;
let paused = true;
let selecting = false;
let victory = false;
let lose = false;
let level1, level2, level3;
let levels = [];
let level = null;

function setup() {
	stage = app.stage;
	app.renderer.backgroundColor = 0x8F8F8F;
	// Create the `start` scene
	startScene = new PIXI.Container();
	stage.addChild(startScene);
	
	// Create the main `game` scene and make it invisible
	gameScene = new PIXI.Container();
	gameScene.visible = false;
	stage.addChild(gameScene);

	// Create the `gameOver` scene and make it invisible
	gameOverScene = new PIXI.Container();
	gameOverScene.visible = false;
	stage.addChild(gameOverScene);

	// Create victoryScene, make it invisible
	victoryScene = new PIXI.Container();
	victoryScene.visible = false;
	stage.addChild(victoryScene);

	// Create labels for all 3 scenes
	createButtonsAndLabels();

	// Create levels	
	generateLevels();

	// Load Sounds
	shootSound = new Howl({
		src: ["media/sounds/projectile.wav"]
	});

	destroySound = new Howl({
		src: ["media/sounds/breaking.wav"]
	});
	
	moneySound = new Howl({
		src: ["media/sounds/money-collect.wav"],
		volume: .5
	});

	hitSound = new Howl({
		src: ["media/sounds/hit.wav"],
		volume: .25
	});

	clickSound = new Howl({
		src: ["media/sounds/click.wav"],
		volume: .15
	});
}

//PURPOSE: Set up all buttons and labels in game
//ARGUMENTS: --
function createButtonsAndLabels(){
	//----placeholder style----
	let placeHolderStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontSize: 60,
		fontFamily: 'Times New Roman',
		stroke: 0x222222,
		strokeThickness: 5
	});

	//**start scene layout**
	//Game name text
	let startLabel = new PIXI.Text("Siege the Castle!");
	startLabel.style = placeHolderStyle;
	startLabel.x = 175;
	startLabel.y = 200;
	startScene.addChild(startLabel);

	//start game button
	let startButton = new PIXI.Text("Start Game");
	startButton.style = placeHolderStyle;
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
		fontFamily: 'Times New Roman',
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
	// let endGameButton = new PIXI.Text("End Game");
	// endGameButton.style = gameTextStyle;
	// endGameButton.x = WIDTH - 100;
	// endGameButton.y = 15;
	// endGameButton.interactive = true;
	// endGameButton.buttonMode = true;
	// endGameButton.on("pointerup", gameOver);
	// endGameButton.on("pointerover", e=>{e.target.alpha = .7;});
	// endGameButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	// gameScene.addChild(endGameButton);

	//spawn troop button
	spawnTroopButton = new PIXI.Text("Spawn Basic Troop \n(-50 Gold)");
	spawnTroopButton.style = gameTextStyle;
	spawnTroopButton.x = 5;
	spawnTroopButton.y = 100;
	spawnTroopButton.interactive = true;
	spawnTroopButton.buttonMode = true;
	spawnTroopButton.on("pointerup", addBasicTroop);
	spawnTroopButton.on("pointerover", e=>{e.target.alpha = .7;});
	spawnTroopButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	gameScene.addChild(spawnTroopButton);

	//**game over scene**
	//game over text
	let gameOverText = new PIXI.Text("You ran out of gold!");
	gameOverText.style = placeHolderStyle;
	gameOverText.x = 150;
	gameOverText.y = 200;
	gameOverScene.addChild(gameOverText);
	
	//play again button
	let playAgainButton = new PIXI.Text("Play Again");
	playAgainButton.style = placeHolderStyle;
	playAgainButton.x = 260;
	playAgainButton.y = HEIGHT - 200;
	playAgainButton.interactive = true;
	playAgainButton.buttonMode = true;
	playAgainButton.on("pointerup", startGame);
	playAgainButton.on("pointerover", e=>{e.target.alpha = .7;});
	playAgainButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	gameOverScene.addChild(playAgainButton);

	//**victory screen **
	//victory text
	let winText = new PIXI.Text("The castle has been sieged!");
	winText.style = placeHolderStyle;
	winText.x = 75;
	winText.y = 200;
	victoryScene.addChild(winText);

	//button to go back to start menu
	let startMenuButton = new PIXI.Text("Start Menu");
	startMenuButton.style = placeHolderStyle;
	startMenuButton.x = 260;
	startMenuButton.y = HEIGHT - 200;
	startMenuButton.interactive = true;
	startMenuButton.buttonMode = true;
	startMenuButton.on("pointerup", e=> {
		victoryScene.visible = false; 
		startScene.visible = true;
		clickSound.play();
	});
	startMenuButton.on("pointerover", e=>{e.target.alpha = .7;});
	startMenuButton.on("pointerout", e=>{e.currentTarget.alpha = 1;});
	victoryScene.addChild(startMenuButton);
}

//PURPOSE: Initialize game variables and start the game 
//ARGUMENTS: --
function startGame(){
	startScene.visible = false;
	gameOverScene.visible = false;
	gameScene.visible = true;
	victoryScene.visible = false;

	if(lose || victory){
		generateLevels();
	}

	victory = false;
	lose = false;
	clickSound.play();

	changeGoldAmount(100);
	changeLevelTo(1);

	app.ticker.add(update);
}

//PURPOSE: Show game over and empty out game scene
//ARGUMENTS: --
function gameOver(){
	startScene.visible = false;
	gameScene.visible = false;
	gameOverScene.visible = true;
	victoryScene.visible = false;
	lose = true;

	app.renderer.backgroundColor = 0x8F8F8F;
	app.ticker.remove(update);

	cleanScene();
}

//PURPOSE: Show victory and empty out game scene
//ARGUMENTS: --
function win(){
	startScene.visible = false;
	gameScene.visible = false;
	gameOverScene.visible = false;
	victoryScene.visible = true;

	app.renderer.backgroundColor = 0x8F8F8F;
	app.ticker.remove(update);

	cleanScene();
}

//PURPOSE: Clean out everything from the scene
//ARGUMENTS: --
function cleanScene(){
	//clean out scene
	for(let i = 0; i < enemies.length; i++){
		gameScene.removeChild(enemies[i].detectRadius);
		gameScene.removeChild(enemies[i]);
		enemies.shift();
		i--;
	}

	//clear track
	if(level){
		for(let i = 0; i < level.track.trackLines.length; i++){
			gameScene.removeChild(level.track.trackLines[i]);
		}
	}

	if(barricade){
		gameScene.removeChild(barricade);
	}

	//no need to destroy if player has already won
	if(!victory && barricade){
		barricade.destroy();
	}

	if(lose || victory){
		paused = true;
		selecting = true;
		changeGoldAmount(-gold);
		goldRate = 0;

		//remove levels
		for(let i = 0; i < levels.length; i++){
			levels.pop();
			i--;
		}
	}

	killAll(bullets);
	killAll(troops);
	cleanUpObejcts(bullets);
	cleanUpObejcts(troops);
}

//PURPOSE: Add basic troop at the beginning of the track
//ARGUMENTS: --
function addBasicTroop(){
	if(gold >= 50){
		changeGoldAmount(-50);
		moneySound.play();
		let troop = new Troop(level.trackNodes[0].x, level.trackNodes[0].y);
		troops.push(troop);
		gameScene.addChild(troops[troops.length - 1]);
	}
}

//PURPOSE: Change the level the player is currently on
//ARGUMENTS: Level to change to
function changeLevelTo(num){
	//need this conditional protect javascript from itself *facepalm*
	if(num <= levels.length){
		cleanScene()

		level = levels[num - 1];
		levelNum = level.id;
		goldRate = level._goldRate
		paused = false;
		selecting = true;

		level.track.draw();

		//make enemy towers
		for(let i = 0; i < level._enemies.length; i++){
			let enemy = level._enemies[i];
			enemies.push(enemy);
			gameScene.addChild(enemy.detectRadius);
			gameScene.addChild(enemy);
		}

		//make barricade at the end
		barricade = level._barricade;
		gameScene.addChild(barricade);
		barricade.drawHealth();

		levelText.text = `Level: ${levelNum}`;
	}
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
		spawnTroopButton.interactive = false;
		spawnTroopButton.alpha = .5;

		if(troops.length == 0){
			gameOver();
			return;
		}
	}
	else{ spawnTroopButton.interactive = true; }

	for(let i = 0; i < troops.length; i++){
		//you win if a troop gets off the screen
		if(troops[i].position.y < -troops[i].size){
			troops[i].isAlive = false;
			if(level.id == levels.length){
				victory = true;
				win();
				return;
			}
			else{
				changeLevelTo(level.id + 1);
				break;
			}
		}
		
		//attack the barricade if you run into it
		if(troops[i].isAlive){
			if(isColliding(troops[i], barricade) && barricade.isAlive){
				troops[i].attack(deltaTime);
			}
			else{
				troops[i].move(deltaTime);
			}
		}

		//have enemies track troops
		for(let j = 0; j < enemies.length; j++){
			if(i == 0){
				enemies[j].shotTimer -= deltaTime;
			}

			//keep tracking and shooting your target unless if it dies
			if(enemies[j].target != null && Vector2.distance(enemies[j].target.position, enemies[j].position) <= enemies[j].radius){
				if(enemies[j].shotTimer <= 0){
					enemies[j].shotTimer = enemies[j].fireSpeed;
					enemies[j].shoot(deltaTime);
					shootSound.play();
				}

				if(!enemies[j].target.isAlive){
					enemies[j].target = null;
				}
					
				continue;
			}

			//target a troop that enters your attack radius
			else if(Vector2.distance(troops[i].position, enemies[j].position) <= enemies[j].radius && enemies[j].target == null){
				enemies[j].target = troops[i];
			}

			//stop targeting if your target leaves your radius
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

	//remove dead objects
	cleanUpObejcts(bullets);
	cleanUpObejcts(troops);
	if(!barricade.isAlive){
		gameScene.removeChild(barricade);
	}
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

//PURPOSE: Generates all of the level objects
//ARGUMENTS: --
function generateLevels(){
	level1 = {
		id: 1,
		trackNodes: [
			new TrackNode(400, 610),            //start
			new TrackNode(400, -10)             //end
		],
		track: null,
		_barricade: null,
		_enemies: [new Enemy(350, 300, 100)],
		_goldRate: 1 / 20
	};
	level1.track = new Track(level1.trackNodes);
	level1._barricade = new Barricade(level1.trackNodes[level1.trackNodes.length - 1].x);
	levels.push(level1);

	level2 = {
		id: 2,
		trackNodes: [
			new TrackNode(400, 610),            //start
			new TrackNode(400, 300, 1, 0),
			new TrackNode(600, 300, 0, -1),
			new TrackNode(600, -10)             //end
		],
		track: null,
		_barricade: null,
		_enemies: [new Enemy(500, 230, 150)],
		_goldRate: 1 / 20
	};
	level2.track = new Track(level2.trackNodes);
	level2._barricade = new Barricade(level2.trackNodes[level2.trackNodes.length - 1].x);
	levels.push(level2);

	level3 = {
		id: 3,
		trackNodes: [
			new TrackNode(300, 610),            //start
			new TrackNode(300, 400, 1, 0),
			new TrackNode(500, 400, 0, -1),
			new TrackNode(500, 200, -1, 0),
			new TrackNode(300, 200, 0, -1),
			new TrackNode(300, -10)             //end
		],
		track: null,
		_barricade: null,
		_enemies: [new Enemy(400, 300, 175)],
		_goldRate: 1 / 20
	}
	level3.track = new Track(level3.trackNodes);
	level3._barricade = new Barricade(level3.trackNodes[level3.trackNodes.length - 1].x);
	levels.push(level3);
}