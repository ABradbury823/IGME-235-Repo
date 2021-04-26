let limit = 0;
let regionStartOffset = 0;
let currentPageOffset = 0;
let isType1 = true;

function dataExampleLoaded(e){
    let xhr = e.target;
    
    let obj = JSON.parse(xhr.responseText);
    let examplePokemon = obj.pokemon;
    //console.log(examplePokemon);

    limit = document.querySelector("#limit").value;
    regionStartOffset = document.querySelector("#region").value;

    document.querySelector("#examples-status1").innerHTML = `<b>Searching for ${capitalize(type1)} type Pokémon...</b>`;

    //examplePokemon has just pokemon name and url
    for(let i = currentPageOffset; i < currentPageOffset + limit; i++){
        if(i < examplePokemon.length){
        getPokemonData(examplePokemon[i].pokemon.url);
        }
    }

    document.querySelector("#examples-status1").innerHTML = `<b>${examplePokemon.length} results found for ${capitalize(type1)} type Pokémon:</b>`

    if(type2 != ""){isType1 = !isType1;}

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
    let pokemonName = capitalize(obj.name);

    //certain forms go above max pokedex number
    let dexNumber = 0;
    if(obj.id < 899){dexNumber = obj.id;}
    else{dexNumber = "???";}

    let pokemonSprite = obj.sprites.front_default;

    //show both types (if applicable)
    let type = "";
    for(let i = 0; i < obj.types.length; i++){
        if(obj.types.length > 1 && i == 0){
        type += capitalize(obj.types[i].type.name) + "/";
        }
        else{type += capitalize(obj.types[i].type.name);}
    }

    //make div to show example
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `<p id="${dexNumber}" class="name">#${dexNumber} ${pokemonName}</p>
                        <img src="${pokemonSprite}" alt="${pokemonName} Image" class="image">
                        <p class="type">${type}</p>`;
    newDiv.style.border = "solid 1px black";
    newDiv.style.order = dexNumber;
    if(!isType1Added){document.querySelector("#example-pokemon1").appendChild(newDiv);}
    else{document.querySelector("#example-pokemon2").appendChild(newDiv);}
}

function pokemonDataError(e){
    console.log("There was an error retrieving data for a Pokémon!")
}