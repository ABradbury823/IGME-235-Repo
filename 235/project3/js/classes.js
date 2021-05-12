//PURPOSE: Track Node class that represents a corner on the track
//CONSTRUCTOR: X position of the node, Y position of the node, X coordinate of direction vector, Y coordinate of direction vector
class TrackNode extends PIXI.Graphics{
    constructor(posX, posY, dirX = 0, dirY = -1){
        super();
        this.size = 5;
        this.position = new Vector2(posX - this.size / 2, posY - this.size / 2);
        this.direction = new Vector2(dirX, dirY).normalize();

        this.beginFill(0xFFFFFF);
        this.drawRect(0, 0, this.size, this.size);
        this.endFill();
    }

    draw(){
        this.x = this.position.x;
        this.y = this.position.y;
        this.width = size;
        this.height = size;
    }
}

//PURPOSE: Track class that holds a list of Track Nodes, milestones/checkpoints, and represents drawn track
//CONSTRUCTOR: An array of TrackNodes, The half-width of the track (pixels)
class Track{
    constructor(nodes, halfWidth = 50){
        this.nodes = nodes;
        this.halfWidth = halfWidth;
        this.trackLines = [];
    }

    draw(){
        for(let i = 0; i < this.nodes.length - 1; i++){
            let dirOffset = Vector2.multiply(this.nodes[i].direction, this.halfWidth / 2);

            let line = new PIXI.Graphics();
            line.lineStyle(this.halfWidth, 0x61450a, 1);
            line.moveTo(this.nodes[i].x, this.nodes[i].y);
            line.lineTo(this.nodes[i + 1].x + dirOffset.x, this.nodes[i + 1].y + dirOffset.y);
            this.trackLines.push(line);
            gameScene.addChild(line);
        }
    }
}

//PURPOSE: Troop class that represents one of the player's basic troops
//CONSTRUCTOR: X and Y position, how fast troop moves, maximum health, damage dealt to barricade, attack speed
class Troop extends PIXI.Sprite{
    constructor(x, y, speed = 25, health = 5, damage = 10, attackSpeed = 3){
        super(app.loader.resources["media/sprites/knight.png"].texture);
        this.size = 20;
        this.anchor.set(.5, .5);
        this.scale.set(2);
        this.position = new Vector2(x, y);
        this.speed = speed;
        this.target = level.trackNodes[1];
        this.direction = level.trackNodes[0].direction;
        this.targetIndex = 1;
        this.realign = false;
        this.realignPos = new Vector2();
        this.isAlive = true;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.attackSpeed = attackSpeed;
        this.attackTimer = attackSpeed;
        
        //health bar (red)
        this.healthBarRed = new PIXI.Graphics();
        this.healthBarRed.beginFill(0xFF0000);
        this.healthBarRed.lineStyle(1, 0xFFFFFF);
        this.healthBarRed.drawRect(-this.width / 2, -5, this.width, 5);
        this.healthBarRed.endFill();
        gameScene.addChild(this.healthBarRed);

        //health bar(green)
        this.healthBarGreen = new PIXI.Graphics();
        this.healthBarGreen.beginFill(0x00FF00);
        this.healthBarGreen.drawRect(-this.width / 2, -5, this.width, 5);
        this.healthBarGreen.endFill();
        gameScene.addChild(this.healthBarGreen);
    }

    move(dt){
        //turn when you reach a corner
        if(isColliding(this, this.target) && this.targetIndex < level.trackNodes.length - 1){
            this.realign = true;
            let dist = this.target.size + this.size / 2
            this.realignPos = Vector2.add(this.position, Vector2.multiply(this.direction, dist));
            this.direction = this.target.direction;
            this.targetIndex++;
            this.target = level.trackNodes[this.targetIndex];
        }

        let xDiff = Math.abs(this.position.x - this.realignPos.x);
        let yDiff = Math.abs(this.position.y - this.realignPos.y);

        //going up or down, adjust horizontally
        if(this.direction.x == 0 && xDiff > .1 && this.realign){
            this.position.x = lerp(this.position.x, this.realignPos.x, .1);
        }

        //going left or right, adjust vertically
        else if(this.direction.y == 0 && yDiff > .1 && this.realign){
            this.position.y = lerp(this.position.y, this.realignPos.y, .1);
        }
        else {this.realign = false;}

        let velocity = Vector2.multiply(this.direction, this.speed);
        velocity = velocity.multiply(dt);
        this.position = Vector2.add(this.position, velocity);
        this.x = this.position.x;
        this.y = this.position.y;
        this.healthBarGreen.x = this.position.x;
        this.healthBarGreen.y = this.position.y - this.size;
        this.healthBarRed.x = this.position.x;
        this.healthBarRed.y = this.position.y - this.size;
    }

    decreaseHealth(amount){
        this.healthBarGreen.width -= (amount / this.maxHealth) * this.width;
        this.health -= amount;
        if(this.health <= 0){
            this.isAlive = false;
            gameScene.removeChild(this.healthBarRed);
            gameScene.removeChild(this.healthBarGreen);
        }
    }

    attack(dt){
        this.attackTimer -= dt;

        if(this.attackTimer <= 0){
            this.attackTimer = this.attackSpeed;
            barricade.changeHealth(this.damage);
        }
    }
}

//PURPOSE: Enemy class that shoots at the player's troops
//CONSTRUCTOR: X and Y position, detection radius of enemy, firing speed of enemy
class Enemy extends PIXI.Sprite{
    constructor(x, y, radius, firingSpeed = 3){
        super(app.loader.resources["media/sprites/tower.png"].texture);
        this.size = 20;
        this.anchor.set(.5, .5);
        this.scale.set(1.5);
        this.position = new Vector2(x, y);
        this.radius = radius;
        this.target = null;
        this.pivot.x = this.size / 2;
        this.pivot.y = this.size / 2;
        this.direction = Vector2.down();
        this.fireSpeed = firingSpeed;
        this.shotTimer = 0;
        this.damage = 1;

        //radius circle
        this.detectRadius = new PIXI.Graphics();
        this.detectRadius.beginFill(0x00FFFF, .3);
        this.detectRadius.drawCircle(this.position.x - this.width / 2, this.position.y, this.radius, .5);
        this.detectRadius.endFill();
    }

    //unused
    followTarget(dt){
        let towerToTarget = Vector2.subtract(this.target.position, this.position);
        let angle = Vector2.dot(this.direction, towerToTarget);
        angle = angle / (this.direction.magnitude() * towerToTarget.magnitude());
        angle = Math.acos(angle);
        this.rotation = -angle * dt;
    }

    shoot(dt){
        let targetPos = Vector2.add(this.target.position, (new Vector2()));
        let targetVelocity = Vector2.multiply(this.target.direction, this.target.speed).multiply(dt);
        let bulletDirection = Vector2.subtract(targetPos, this.position);
        bulletDirection = bulletDirection.add(targetVelocity) //add targets velocity for better aim
        bulletDirection.normalize();
        let bulletDist =  Vector2.subtract(this.target.position, this.position).magnitude() //expire at target position (guarantee hit)
        let bullet = new Bullet(this.position.x, this.position.y, 300, bulletDirection, bulletDist);
        bullets.push(bullet);
        gameScene.addChild(bullet);
        this.target.decreaseHealth(this.damage);
    }

    drawRadius(){
        gameScene.addChild(this.detectRadius);
    }
}

//PURPOSE: Bullet that towers shoot
//CONSTRUCTOR: X and Y positions, how fast the bullet moves, direction bullet will move in, how far bullet travels before disappearing
class Bullet extends PIXI.Sprite{
    constructor(x, y, speed, direction, distance){
        super(app.loader.resources["media/sprites/bullet.png"].texture);
        this.size = 5;
        this.anchor.set(.5, .5);
        this.scale.set(1.5);
        this.position = new Vector2(x, y);
        this.start = new Vector2(x, y);
        this.speed = speed;
        this.direction = direction;
        this.isAlive = true;
        this.distance = distance;
    }

    move(dt){
        if(this.distance <= 0){
            this.isAlive = false;
        }

        let velocity = Vector2.multiply(this.direction, this.speed);
        velocity = velocity.multiply(dt);
        this.distance -= velocity.magnitude();
        this.position = Vector2.add(this.position, velocity);
        this.x = this.position.x;
        this.y = this.position.y;
    }
}

//PURPOSE: Barricade class that has hit points, cannot attack, and marks the end of the level if destroyed
//CONSTRUCTOR: X and Y position of the barricade, maximum health, is this a horizontal barricade
class Barricade extends PIXI.Sprite{
    constructor(x, y = 0, isHorizontal = true){
        super(app.loader.resources["media/sprites/wall.png"].texture);
        if(isHorizontal){
            this.size = new Vector2(100, 50);
        }
        else{
            this.size = new Vector2(50, 100);
        }

        this.anchor.set(.5, .5);
        this.scale.set(2);
        this.position = new Vector2(x, y);
        this.health = 100;
        this.maxHealth = 100;
        this.isAlive = true;
        this.destroyed = false;

        //health bar (red)
        this.healthBarRed = new PIXI.Graphics();
        this.healthBarRed.beginFill(0xFF0000);
        this.healthBarRed.lineStyle(1, 0xFFFFFF);
        this.healthBarRed.drawRect(-this.width / 2, this.size.y / 4 - 5, this.size.x, 5)
        this.healthBarRed.endFill();
        this.healthBarRed.x = this.position.x + this.size.x + 5;

        //health bar(green)
        this.healthBarGreen = new PIXI.Graphics();
        this.healthBarGreen.beginFill(0x00FF00);
        this.healthBarGreen.drawRect(-this.width / 2, this.size.y / 4 - 5, this.size.x, 5)
        this.healthBarGreen.endFill();
        this.healthBarGreen.x = this.position.x + this.size.x + 5;
    }

    destroy(){
        this.isAlive = false;
        gameScene.removeChild(this.healthBarRed);
        gameScene.removeChild(this.healthBarGreen);

        //don't give player money when scene is cleared
        if(this.health <= 0 && !this.destroyed){
            changeGoldAmount(100);
            destroySound.play();
            moneySound.play();
            this.destroyed = true;
        }
    }

    changeHealth(amount){
        this.healthBarGreen.width -= (amount / this.maxHealth) * this.size.x;
        this.health -= amount;
        if(this.health <= 0){
            this.destroy();
        }
        else{
            hitSound.play();
        }
    }

    drawHealth(){
        gameScene.addChild(this.healthBarRed);
        gameScene.addChild(this.healthBarGreen);
    }
}