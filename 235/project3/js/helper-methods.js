//PURPOSE: Generates a random floating point integer
//ARGUMENTS: a minimum value (inclusive), a maximum value (inclusive)
//RETURNS: A random floating point number between the given range
function random(min, max){
    return (Math.random() * (max - min) + min);
}