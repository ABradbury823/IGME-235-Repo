//PURPOSE: Contains basically functionality of a 2D Vector
//CONSTRCUTOR: An x coordinate, A y coordinate
class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    //methods for this instance
    //Adds another vector to this vector
    add(vec){
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    //Subtracts another vector from this vector
    subtract(vec){
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    //Multiplies this vector by a scalar
    multiply(scalar){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    //Multiplies this vector by a scalar
    divide(scalar){
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    //Makes this vector unit length, with a magnitude of 1
    normalize(){
        let mag = this.magnitude();
        if(mag == 0){
            this.x = 0;
            this.y = 1;
        }
        else{
            this.divide(mag);
        }
        return this;
    }

    //Calculates the magnitude of this vector
    magnitude(){
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    //Calculates the magnitude of this vector squared (no square root)
    magnitudeSquared(){
        return this.x * this.x + this.y * this.y;
    }

    //Returns the length of the vector
    length(){
        return this.magnitude();
    }

    //Sets this vector's magnitude to a specific length
    setMagnitude(length){
        this.normalize();
        this.multiply(length);
        return this;
    }

    //Makes a copy of this vector
    copy(){
        return new Vector2(this.x, this.y);
    }

    //class methods
    //Adds two vectors together
    static add(v1, v2){
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }

    //Subtracts the second vector from the first one
    static subtract(v1, v2){
        return new Vector2(v1.x - v2.x, v1.y - v2.y);
    }

    //Multiplies a given vector by a scalar
    static multiply(v, scalar){
        return new Vector2(v.x * scalar, v.y * scalar);
    }

    //Divides a given vector by a scalar
    static divide(v, scalar){
        return new Vector2(v.x / scalar, v.y / scalar);
    }

    //Returns a unit length copy of a given vector
    static normalized(v){
        return v.copy().normalize();
    }

    //Returns a unit vector representing UP (0, -1)
    static up(){
        return new Vector2(0, -1);
    }

    //Returns a unit vector representing DOWN (0, 1)
    static down(){
        return new Vector2(0, 1);
    }

    //Returns a unit vector representing RIGHT (1, 0)
    static right(){
        return new Vector2(1, 0);
    }

    //Returns a unit vector representing LEFT (-1, 0)
    static left(){
        return new Vector2(-1, 0);
    }

    //Returns a vector of (1, 1)
    static one(){
        return new Vector2(1, 1);
    }

    //Returns a vector of (0, 0)
    static zero(){
        return new Vector2(0, 0);
    }

    //Returns a random vector of unit length
    static randomUnitVector(){
        return new Vector2(Math.random(), Math.random()).normalize();
    }

    //Calculates distance between two vectors
    static distance(v1, v2){
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }

    //Calculates distance squared between two vectors
    static distanceSquared(v1, v2){
        return (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y);
    }

    //Calculates dot product between two vectors
    static dot(v1, v2){
        return (v1.x * v2.x) + (v1.y * v2.y);
    }

    static copy(v){
        return v.copy();
    }
}