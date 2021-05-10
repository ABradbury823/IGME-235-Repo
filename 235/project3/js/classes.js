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
    constructor(nodes, halfWidth = 10){
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


//Troop class that represents one of the player's troops
class Troop extends PIXI.Graphics{
    constructor(x, y, speed, health){
        super();
        this.size = 20;
        this.position = new Vector2(x - this.size / 2, y - this.size / 2);
        this.speed = speed;
        this.target = trackNodes[1];
        this.direction = trackNodes[0].direction;
        this.targetIndex = 1;
        this.realign = false;
        this.realignPos = new Vector2();
        this.isAlive = true;
        this.health = health;

        this.beginFill(0xFFFF00);
        this.drawRect(0, 0, this.size, this.size);
        this.endFill();
    }

    move(dt){
        //turn when you reach a corner
        if(isColliding(this, this.target) && this.targetIndex < trackNodes.length - 1){
            this.realign = true;
            let dist = this.target.size + this.size / 2
            this.realignPos = Vector2.add(this.position, Vector2.multiply(this.direction, dist));
            this.direction = this.target.direction;
            this.targetIndex++;
            this.target = trackNodes[this.targetIndex];
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
    }

    decreaseHealth(amount){
        this.health -= amount;
        if(this.health <= 0){
            this.isAlive = false;
        }
    }
}

//Enemy class that shoots at the player's troops
class Enemy extends PIXI.Graphics{
    constructor(x, y, radius, firingSpeed){
        super();
        this.size = 20;
        this.position = new Vector2(x - this.size / 2, y - this.size / 2);
        this.radius = radius;
        this.target = null;
        this.pivot.x = this.size / 2;
        this.pivot.y = this.size / 2;
        this.direction = Vector2.down();
        this.fireSpeed = firingSpeed;
        this.shotTimer = 0;

        //radius circle
        this.beginFill(0x00FFFF, .3);
        this.drawCircle(this.size / 2, this.size / 2, this.radius, .5);
        this.endFill();

        this.beginFill(0xFF0000);
        this.drawRect(0, 0, this.size, this.size);
        this.endFill();
    }

    followTarget(dt){
        let towerToTarget = Vector2.subtract(this.target.position, this.position);
        let angle = Vector2.dot(this.direction, towerToTarget);
        angle = angle / (this.direction.magnitude() * towerToTarget.magnitude());
        angle = Math.acos(angle);
        this.rotation = -angle * dt;
    }

    shoot(dt){
        let targetPos = Vector2.add(this.target.position, (new Vector2(this.target.size, this.target.size)));
        let targetVelocity = Vector2.multiply(this.target.direction, this.target.speed).multiply(dt);
        let bulletDirection = Vector2.subtract(targetPos, this.position);
        bulletDirection = bulletDirection.add(targetVelocity) //add targets velocity for better aim
        bulletDirection.normalize();
        let bulletDist =  Vector2.subtract(this.target.position, this.position).magnitude() //expire at target position (guarantee hit)
        let bullet = new Bullet(this.position.x, this.position.y, 200, bulletDirection, bulletDist);
        bullets.push(bullet);
        gameScene.addChild(bullet);
        this.target.decreaseHealth(1);
    }
}

//Bullet that towers shoot
class Bullet extends PIXI.Graphics{
    constructor(x, y, speed, direction, distance){
        super();
        this.size = 5;
        this.position = new Vector2(x - this.size / 2, y - this.size / 2);
        this.start = new Vector2(x - this.size / 2, y - this.size / 2);
        this.pivot.x = this.size / 2;
        this.pivot.y = this.size / 2;
        this.speed = speed;
        this.direction = direction;
        this.isAlive = true;
        this.distance = distance;

        this.beginFill(0xFFFFFF);
        this.drawRect(0, 0, this.size, this.size);
        this.endFill();
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

//Barricade class: "enemy" that has hit points, cannot attack, and marks the end of the level if destroyed

