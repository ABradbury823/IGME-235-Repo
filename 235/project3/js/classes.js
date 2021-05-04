//Track Node class that represents a point on the track(corner) that each troop seeks in order
class TrackNode extends PIXI.Graphics{
    constructor(posX, posY, dirX = 0, dirY = -1){
        super();
        this.position = new Vector2(posX, posY);
        this.direction = new Vector2(dirX, dirY).normalize();

        //debugging
        this.beginFill(0xFFFFFF);
        this.drawCircle(0, 0, 2);
        this.endFill();
    }

    draw(){
        this.x = this.position.x;
        this.y = this.position.y;
    }
}

//Track class that holds a list of Track Nodes, milestones/checkpoints, and represents drawn track
class Track{
    constructor(nodes, halfWidth = 10){
        this.nodes = nodes;
        this.halfWidth = halfWidth;
        this.trackLines = [];

        for(let i = 0; i < nodes.length; i++){
            nodes[i].draw();
            gameScene.addChild(nodes[i]);
        }
    }

    addNode(node){
        this.nodes.push(node);
    }

    draw(){
        for(let i = 0; i < this.nodes.length - 1; i++){
            let dirOffset = Vector2.multiply(this.nodes[i].direction, this.halfWidth / 2);

            let line = new PIXI.Graphics();
            line.lineStyle(this.halfWidth, 0x00FF00, 1);
            line.moveTo(this.nodes[i].x, this.nodes[i].y);
            line.lineTo(this.nodes[i + 1].x + dirOffset.x, this.nodes[i + 1].y + dirOffset.y);
            this.trackLines.push(line);
            gameScene.addChild(line);
        }
    }
}


//Troop class that represents one of the player's troops


//Enemy class that shoots at the player's troops


//Barricade class: "enemy" that has hit points, cannot attack, and marks the end of the level if destroyed

