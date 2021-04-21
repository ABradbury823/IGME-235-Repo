window.addEventListener( "load",(e) => {document.querySelector("#generate").onclick = generateButtonClicked});
window.addEventListener("load", (e) => {document.querySelector("#type1").onchange = noDoubleType});

let type1 = "";
let type2 = "";

function generateButtonClicked(){
    //console.log("Generate button clicked!")
    let url = POKEAPI_URL + "type/"

    type1 = document.querySelector("#type1").value;
    //console.log(`Type 1: ${type1} (button clicked)`);
    type2 = document.querySelector("#type2").value;
    //console.log(`Type 1: ${type2} (button clicked)`);
}

//prevent the same type being selected twice (disable option in type 2 dropdown)
function noDoubleType(){
    type1 = document.querySelector("#type1").value;
    //console.log(`Type 1: ${type1} (selection changed)`);
    type2 = document.querySelector("#type2").value;
    //console.log(`Type 2: ${type2} (selection changed)`);

    //re-enable all options in type 2
    const numberOfOptions = 19;
    let options = document.querySelectorAll("#type2 option")
    for(let i = 0; i < numberOfOptions; i++){options[i].disabled = false;}

    if(type1 == type2){type2 = "";}

    //disable option in type 2
    if(type1 != ""){document.querySelector(`#type2 [value=${type1}]`).disabled = true;}
}