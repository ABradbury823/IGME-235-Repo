window.addEventListener( "load",(e) => {document.querySelector("#generate").onclick = generateButtonClicked});
window.addEventListener("load", (e) => {document.querySelector("#type1").onchange = noSelectingDoubleType});

let type1 = "";
let type2 = "";

//PURPOSE:sets up api url when the generate button has been clicked
//ARGUMENTS: --
function generateButtonClicked(){
    //console.log("Generate button clicked!")
    let url1 = POKEAPI_URL + "type/"    //url for type1
    let url2 = POKEAPI_URL + "type/"    //option url for type2

    type1 = document.querySelector("#type1").value;
    //console.log(`Type 1: ${type1} (button clicked)`);

    type2 = document.querySelector("#type2").value;
    //console.log(`Type 1: ${type2} (button clicked)`);

    //update status based on what types are selected
    //nothing is selected or only type 2 is selected
    if(type1 == ""){
        document.querySelector("#status").innerHTML = `<b>Type 1 has not been selected. Please select a type from type 1</b>`
        return;
    }

    //both type 1 and type 2 have been selected
    else if(type1 != "" && type2 != ""){
        document.querySelector("#status").innerHTML = 
        `<b>Retrieving type matchups for ${capitalizeFirstLetter(type1)} and ${capitalizeFirstLetter(type2)} types...</b>`;

        url1 += type1;
        url2 += type2;
        //console.log(url1);
        //console.log(url2);

        //retrieve data for both types
        getMatchupData(url1);
        //getMatchupData(url2);
    }

    //only type 1 has been only
    else if(type1 != "" && type2 == ""){
        document.querySelector("#status").innerHTML = 
        `<b>Retrieving type matchups for ${capitalizeFirstLetter(type1)} types...</b>`;

        url1 += type1
        getMatchupData(url1);
    }

}

//PURPOSE: get type matchup data from the api
//ARGUMENTS: a url to the api to request data from
function getMatchupData(url){
    let xhr = new XMLHttpRequest();

	xhr.onload = dataMatchupLoaded;
	xhr.onerror = dataMatchupError;

	xhr.open("GET", url);
	xhr.send();
}

//PURPOSE: sorts type matchup data into proper division
//ARGUMENT: XMLHttpRequest containing type matchup data
function dataMatchupLoaded(e){

}

//PURPOSE: displays an error message in the console
//ARGUMENTS: XMLHttpRequest that caused the error
function dataMatchupError(e){
    console.log("An occurred while loading type matchups!");
}


//PURPOSE: prevent the same type being selected twice
//ARGUMENTS: --
function noSelectingDoubleType(){
    type1 = document.querySelector("#type1").value;
    //console.log(`Type 1: ${type1} (selection changed)`);

    type2 = document.querySelector("#type2").value;
    //console.log(`Type 2: ${type2} (selection changed)`);

    //re-enable all options in type 2 (don't want options to stay disabled!)
    const numberOfOptions = 19;
    let options = document.querySelectorAll("#type2 option")
    for(let i = 0; i < numberOfOptions; i++){options[i].disabled = false;}

    //reset type2 if the same type is selected in type 1
    if(type1 == type2){document.querySelector("#type2").selectedIndex = 0;}

    //disable option in type 2
    if(type1 != ""){document.querySelector(`#type2 [value=${type1}]`).disabled = true;}
}