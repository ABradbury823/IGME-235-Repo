let limit = 0;
let regionStartOffset = 0;
let currentPageOffset = 0;

function dataExampleLoaded(e){
    let xhr = e.target;
    
    let obj = JSON.parse(xhr.responseText);
    let examplePokemon = obj.pokemon;
    //console.log(examplePokemon);

    limit = document.querySelector("#limit").value;
    regionStartOffset = document.querySelector("#region").value;

    //examplePokemon has just pokemon name and url
    for(let i = currentPageOffset; i < currentPageOffset + limit; i++){
        if(i < examplePokemon.length){
        getPokemonData(examplePokemon[i].pokemon.url);
        }
    }
}

function getPokemonData(url){
    let xhr = new XMLHttpRequest();

    xhr.onload = pokemonDataLoaded;
    xhr.onerror = pokemonDataError;

    xhr.open("GET", url);
    xhr.send();
}

function pokemonDataLoaded(e){
    let xhr = e.target;
    let obj = JSON.parse(xhr.responseText);
    let pokemonName = obj.name;

    //certain forms go above max pokedex number
    let dexNumber = 0;
    if(obj.id < 899){dexNumber = obj.id;}
    else{dexNumber = "???"}
    //console.log(dexNumber);

}

function pokemonDataError(e){
    console.log("There was an error retrieving data for a Pokémon!")
}