import "./image-slider.js"

const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const buttons = [btn1, btn2, btn3];

//default content to hidden
const firstProjectContent = document.querySelector("#first-project");
firstProjectContent.hidden = true;

const secondProjectContent = document.querySelector("#second-project");
secondProjectContent.hidden = true;

const thirdProjectContent = document.querySelector("#third-project");
thirdProjectContent.hidden = true;

const contents = [firstProjectContent, secondProjectContent, thirdProjectContent];

const toggleOne = e => toggleVisible(0);
btn1.onclick = toggleOne;
const toggleTwo = e => toggleVisible(1);
btn2.onclick = toggleTwo;
const toggleThree = e => toggleVisible(2);
btn3.onclick = toggleThree;

//toggle visibility of dropdown content
const toggleVisible = (index) => {
    let content = contents[index];
    let button = buttons[index];
    content.hidden = !content.hidden;
    content.hidden ? button.textContent = "Show More" : button.textContent = "Show Less";
}