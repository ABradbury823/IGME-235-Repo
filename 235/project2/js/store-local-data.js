window.addEventListener("load", retrieveLocalData);

function retrieveLocalData(){
    isFirstLoad = true;

    const type1Field = document.querySelector("#type1");
    const type2Field = document.querySelector("#type2");
    const resultsSlider = document.querySelector("#limit");
    const resultsText = document.querySelector("#limit-value");
    const changeResultsButton = document.querySelector("#limit-change");
    const nextButton1 = document.querySelector("#next-examples1")
    const nextButton2 = document.querySelector("#next-examples2")
    const previousButton1 = document.querySelector("#previous-examples1")
    const previousButton2 = document.querySelector("#previous-examples2")
    const prefix = "amb7316";
    const type1Key = prefix + "type1";
    const type2Key = prefix + "type2";
    const resultsKey = prefix + "numResults";
    const type1OffsetKey = prefix + "type1Offset"
    const type2OffsetKey = prefix + "type2Offset"

    //retrieve stored data if user has been to page before
    const storedType1 = localStorage.getItem(type1Key);
    const storedType2 = localStorage.getItem(type2Key);
    const storedResults = localStorage.getItem(resultsKey);
    const storedType1Offset = localStorage.getItem(type1OffsetKey);
    const storedType2Offset = localStorage.getItem(type2OffsetKey);

    //are there stored types?
    if(storedType1){type1Field.querySelector(`option[value=${storedType1}]`).selected = true;}
    if(storedType2){type2Field.querySelector(`option[value=${storedType2}]`).selected = true;}
    
    //are there stored filters for example Pokémon?
    if(storedResults){resultsSlider.value = storedResults; resultsText.value = storedResults;}
    if(storedType1Offset){currentPageOffset1 = storedType1Offset;}
    if(storedType2Offset){currentPageOffset2 = storedType2Offset;}


    if(storedType1 || storedType2){generateButtonClicked(); dropDownSelectionChanged();}

    //set data when field is changed
    type1Field.addEventListener("change", e=> {localStorage.setItem(type1Key, e.target.value);});
    type2Field.addEventListener("change", e=> {localStorage.setItem(type2Key, e.target.value);});
    changeResultsButton.addEventListener("click", e=>{localStorage.setItem(resultsKey, resultsText.value);});

    //save offset when next/previous are clicked
    nextButton1.addEventListener("click", e=>{localStorage.setItem(type1OffsetKey, currentPageOffset1);});
    nextButton2.addEventListener("click", e=>{localStorage.setItem(type2OffsetKey, currentPageOffset2);});
    previousButton1.addEventListener("click", e=>{localStorage.setItem(type1OffsetKey, currentPageOffset1);});
    previousButton2.addEventListener("click", e=>{localStorage.setItem(type2OffsetKey, currentPageOffset2);});
}