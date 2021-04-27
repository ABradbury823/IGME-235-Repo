window.addEventListener("load", generateTypesURL);

//PURPOSE: generate url for api to retrieve types
//ARGUMENTS: --
function generateTypesURL(){
    let url = POKEAPI_URL + "type/";

    getTypeData(url);
}

//PURPOSE: retrieve type data from the api
//ARGUMENTS: url to the api to request data from
function getTypeData(url){
    let xhr = new XMLHttpRequest()

    xhr.onload = populateDropDown;
    xhr.onerror = dataTypeError;

    xhr.open("GET",url)
    xhr.send();
}

//PURPOSE: adds all types to dropdown lists
//ARGUMENTS: an XMLHttpRequest containing type data
function populateDropDown(e){
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);
    let results = obj.results;

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
        newOption1.text = capitalize(type);
        newOption2.text = capitalize(type);
        type1DropDown.appendChild(newOption1);
        type2DropDown.appendChild(newOption2);
    }
}

//PURPOSE: displays an error message in the console
//ARGUMENTS: XMLHttpRequest that caused the error
function dataTypeError(e){
    console.log("There was an error loading the types!")
}