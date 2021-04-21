window.addEventListener("load", populateOnLoad);

const POKEAPI_URL = "https://pokeapi.co/api/v2/";

//called upon program start to populate drop down lists
function populateOnLoad(){
    let url = POKEAPI_URL + "type/";
    //console.log(url);

    getTypeData(url);
}

//retrieve data from the api
function getTypeData(url){
    let xhr = new XMLHttpRequest()

    xhr.onload = populateDropDown;
    xhr.onerror = dataTypeError;

    xhr.open("GET",url)
    xhr.send();
}

//adds all types to dropdown lists
function populateDropDown(e){
    let xhr = e.target;
    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);
    let results = obj.results;
    //console.log(results);

    let type1DropDown = document.querySelector("#type1")
    let type2DropDown = document.querySelector("#type2")
    let numberOfTypes = 18;
    //add all types to both drop downs
    for(let i = 0; i < numberOfTypes; i++){
        let type = results[i].name;
        let newOption1 = document.createElement("option");
        let newOption2 = document.createElement("option");
        newOption1.value = type;
        newOption2.value = type;
        newOption1.text = capitalizeFirstLetter(type);
        newOption2.text = capitalizeFirstLetter(type);
        type1DropDown.appendChild(newOption1);
        type2DropDown.appendChild(newOption2);
    }
}

//runs if there is an error retrieving data from the api
function dataTypeError(e){
    console.log("There was an error loading the types!")
}

//capitalizes the first letter of a given string and returns the new string
function capitalizeFirstLetter(string){
    if(string.length == 0) return string;

    let firstLetter = string.slice(0, 1);
    let remainingString = string.slice(1, string.length);
    let newString = firstLetter.toUpperCase() + remainingString;
    return newString;
}