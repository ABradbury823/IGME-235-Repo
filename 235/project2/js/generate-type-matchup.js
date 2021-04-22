window.addEventListener( "load",(e) => {document.querySelector("#generate").onclick = generateButtonClicked});
window.addEventListener("load", (e) => {document.querySelector("#type1").onchange = dropDownSelectionChanged});

let type1 = "";
let type2 = "";
let lists = null;

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

    //clear lists before starting (remove past input)
    lists = document.querySelectorAll("ul");
    clearLists(lists);

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
        getMatchupData(url2);
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
    let xhr = e.target;
    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    let damageRelations = obj.damage_relations;
    //console.log(damageRelations);   //2xdmg_from, 2xdmg_to, .5xdmg_from, .5xdmg_to, 0dmg_from, 0dmg_to

    //sort the damage relations so they match the page's layout:
    //2xdmg_to, .5xdmg_to, 0dmg_to, 2xdmg_from, .5dmg_from, 0dmg_from
    let reorderedArray = reorderArray(Object.entries(damageRelations));
    //console.log(reorderedArray);
    
    //sort types into just names
    let types = [];
    for(let i = 0; i < lists.length; i++){
        types[i] = [];
        for(let j = 0; j < reorderedArray[i].length; j++){
            types[i].push(reorderedArray[i][j].name);
        }
    }
    //console.log(types);
    
    for(let i = 0; i < lists.length; i++){
        addArrayToList(types[i], lists[i]);
    }

    //update status
    if(type2 == ""){
        document.querySelector("#status").innerHTML = 
        `<b>Here are the type matchups for ${capitalizeFirstLetter(type1)} types:</b>`;
    }
    else{
        //TODO: remove repeated types (offensive + defensive), negate types that are super effective and not very effective(defensive),
        //remove types that have no effect from super effective and not very effective list
        for(let i = 0; i < lists.length; i++){
            removeDuplicates(lists[i]);
        }

        document.querySelector("#status").innerHTML = 
        `<b>Here are the type matchups for ${capitalizeFirstLetter(type1)} and ${capitalizeFirstLetter(type2)} types:</b>`;
    }
}

//PURPOSE: displays an error message in the console
//ARGUMENTS: XMLHttpRequest that caused the error
function dataMatchupError(e){
    console.log("An occurred while loading type matchups!");
}

function clearLists(nodeList){
    for(let i = 0; i < nodeList.length; i++){
        while(nodeList[i].firstChild){
            nodeList[i].removeChild(nodeList[i].firstChild);
        }
    }
}

//PURPOSE: sort damage relations into the correct order
//ARGUMENTS: an array of entries including the damage relations
//RETURNS: an array containing the damage realtions in the order: 2xdmg_to, .5xdmg_to, 0dmg_to, 2xdmg_from, .5dmg_from, 0dmg_from
function reorderArray(array){
    //no need to sort if there is only 1 or 2 points
    if(array.length < 2){return array;}
    
    let newArray = [];

    //place odd indices into front
    for(let i = 1; i < array.length; i += 2){
        newArray.push(array[i][1]); //types are second index of entry array
    }
    //place even indices into back
    for(let i = 0; i < array.length; i += 2){
        newArray.push(array[i][1]);
    }

    return newArray;
}

//PURPOSE: add each type to the given damage relation list
//ARGUMENT: an array of types, list where types should be placed
function addArrayToList(array, list){
    //don't add anything if there's nothing in the array
    if(array.length == 0){return;}

    //add a new li element into the proper list
    for(let i = 0; i < array.length; i++){
        let type = array[i];
        let newLi = document.createElement("li");
        newLi.innerText = capitalizeFirstLetter(type);
        list.appendChild(newLi);
    }

}

function removeDuplicates(list){
    if(list.childElementCount == 0){return;}

    //look for duplicate
    for(let i = 0; i < list.childElementCount; i++){
        
    }
}

//PURPOSE: updates type2 list when type1 dropdown selection is changed
//ARGUMENTS: --
function dropDownSelectionChanged(){
    type1 = document.querySelector("#type1").value;
    //console.log(`Type 1: ${type1} (selection changed)`);

    type2 = document.querySelector("#type2").value;
    //console.log(`Type 2: ${type2} (selection changed)`);

    //re-enable all options in type 2 (don't want options to stay disabled!)
    let options = document.querySelectorAll("#type2 option")
    for(let i = 0; i < options.length; i++){options[i].disabled = false;}

    //reset type2 if the same type is selected in type 1
    if(type1 == type2){document.querySelector("#type2").selectedIndex = 0;}

    //disable option in type 2 if it has already been selected in type 1
    if(type1 != ""){document.querySelector(`#type2 [value=${type1}]`).disabled = true;}
}