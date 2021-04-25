window.addEventListener("load", (e)=>{document.querySelector("#limit").onchange = sliderValueChanged});
window.addEventListener("load", (e)=>{document.querySelector("#limit-value").onchange = textValueChanged});

//PURPOSE: change text value when slider changes
//ARGUMENTS: --
function sliderValueChanged(){
    let value = document.querySelector("#limit").value;
    document.querySelector("#limit-value").value = value;
}

//PURPOSE: change slider position when text changes
//ARGUMENTS: --
function textValueChanged(){
    let textBox = document.querySelector("#limit-value");
    let value = textBox.value;

    if(value < textBox.min){value = textBox.min;}
    else if(value > textBox.max){value = textBox.max}

    textBox.value = value;
    document.querySelector("#limit").value = value;
}