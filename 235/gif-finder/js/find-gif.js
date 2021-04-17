window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
let displayTerm = "";
	
function searchButtonClicked(){
	//console.log("searchButtonClicked() called");
	const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
    let GIPHY_KEY = "y01drJL5OV12yGpe697EfHgCcggS19xm";
    let url = GIPHY_URL + "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;
    term = term.trim();
    term = encodeURIComponent(term);

    //no term - abort
    if(term.length < 1) return;
        
    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";
    console.log(url);

	getData(url);
}

function getData(url)
{
	let xhr = new XMLHttpRequest();

	xhr.onload = dataLoaded;
	xhr.onerror = dataError;

	xhr.open("GET", url);
	xhr.send();
}

function dataLoaded(e)
{
	let xhr = e.target;
	console.log(xhr.responseText);

	let obj = JSON.parse(xhr.responseText);

	//no data - abort
	if(!obj.data || obj.data.length == 0)
	{
		document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
		return;
	}

	let results = obj.data;
	console.log("results.length = " + results.length);
	let bigString = "";

	for(let i = 0; i < results.length; i++)
	{
		let result = results[i];

        let rating = result.rating.toUpperCase();
        if(!rating) rating = "NA";

		let smallURL = result.images.fixed_width_downsampled.url;
		if(!smallURL) smallURL = "images/no-image-found.png";

		let url = result.url;

		//make div for each gif result
		let line = `<div class='result'><p><b>Rating: ${rating}</b></p>`;
		line += `<img src='${smallURL}' title='${result.id}' />`;
		line += `<span><a target='_blank' href='${url}'>View on Giphy</a></span></div>`;
		bigString += line;
	}

	document.querySelector("#content").innerHTML = bigString;
	document.querySelector("#status").innerHTML = "<b>Success!</b> <p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e)
{
	console.log("An error occurred");
}