const template = document.createElement("template");
template.innerHTML = `
<style>
    .container {
        padding: 2rem;
    }

    .slider-wrapper {
        position: relative;
        max-width: 48rem;
        margin: 0 auto;
    }

    .slider {
        display: flex;
        align-items: center;
        aspect-ratio: 16/9;
        overflow: hidden;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        box-shadow: 0 1.5rem 3rem -.75rem hsla(0, 0, 0, .25);
        border-radius: 1rem;
        user-select: none;
    }

    .slider img {
        flex: 1 0 100%;
        scroll-snap-align: start;
        object-fit: cover;
        max-width: 48rem;
    }

    .slider-nav {
        display: flex;
        column-gap: 1rem;
        position: absolute;
        bottom: 5rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
    }

    .slider-dot {
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
        border: 1px solid #555555;
        background-color: #ffffff;
        opacity: .5;
        transition: opacity ease 250ms;
        cursor: pointer;
    }

    .slider-dot:hover {
        opacity: 1;
    }

    .slider-arrows {
        display: flex;
        justify-content: space-between;
        padding: .5rem;
        background-color: #ccc;
        border-radius: 10px;
        margin-top: .25rem;
    }

    .left-arrow, .right-arrow {
        width: 5rem;
        height: 3rem;
        border-radius: 25%;
        border: 1px solid #555555;
        background-color: #a6a6a6;
        opacity: .75;
        transition: opacity ease 250ms;
        cursor: pointer;
        text-align: center;
        line-height: 3rem;
        font-size: 1.5rem;
        color: #353535;
        user-select: none;
    }

    .left-arrow:hover, .right-arrow:hover {
        opacity: 1;
    }
</style>
<section class="container">
    <div class="slider-wrapper">
        <div class="slider">
            <!-- List of images go here --!>
        </div>
        <div class="slider-nav">
            <!-- Slider dots to show location --!>
        </div>
        <div class="slider-arrows">
            <span class="left-arrow">&lt;</span>
            <span class="right-arrow">&gt;</span>
        </div>
    </div>
</section>
`;

class ImageSlider extends HTMLElement {
    static defaultImage = "https://via.placeholder.com/100x100";

    constructor(){
        super();

        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.leftBtn = this.shadowRoot.querySelector(".left-arrow");
        this.rightBtn = this.shadowRoot.querySelector(".right-arrow");
        this.slider = this.shadowRoot.querySelector(".slider");
        this.sliderNav = this.shadowRoot.querySelector(".slider-nav");

        this.imageData = this.dataset.images.split(",") ?? [];
        this.images = [];
        
        //go through images and make image and slider dot
        //format: src,alt,src,alt,etc.
        for (let i = 0; i < this.imageData.length; i += 2) {
            let newImg = document.createElement("img");
            newImg.id = `slide${i/2 + 1}`;
            newImg.src = this.imageData[i];
            newImg.alt = this.imageData[i+1];
            this.images.push(newImg);
            
            let newDot = document.createElement("span");
            newDot.classList.add("slider-dot");
            
            this.slider.appendChild(newImg);
            this.sliderNav.appendChild(newDot);
        }
        this.totalImages = this.images.length ?? 0;
        //console.log(this.imageData + ", " + this.totalImages);

        this.currentImage = this.imageData[0] ?? null;
        this.currentIndex = 0;


        //hooking up button events
        const leftWrapper = e => this.changeImage(this.currentIndex - 1);
        const rightWrapper = e => this.changeImage(this.currentIndex + 1);

        this.leftBtn.onclick = leftWrapper;
        this.rightBtn.onclick = rightWrapper;

        //hooking up slider dots event
        this.sliderDots = Array.from(this.shadowRoot.querySelectorAll(".slider-nav span"));
        this.sliderDots[0].style = "opacity: 1;";
        for(let i = 0; i < this.sliderDots.length; i++) {
            const dotWrapper = e => this.changeImage(i);
            this.sliderDots[i].onclick = dotWrapper;
        }

        this.render();
    }

    disconnectedCallback() {
        this.leftBtn.onclick = null;
        this.rightBtn.onclick = null;
    }

    render() {
        for(let i = 0; i < this.totalImages; i++) {
            //change opacity of appropriate slider dot
            i == this.currentIndex ? this.sliderDots[i].style = "opacity: 1" : this.sliderDots[i].style = "opacity: .5";

            //change image being displayed
            i == this.currentIndex ? this.images[i].hidden = false : this.images[i].hidden = true; 
        }
        
    }

    changeImage(index) {
        if(this.currentIndex == index) return;

        this.currentIndex = index;

        //sanitize index
        if(this.currentIndex < 0) this.currentIndex = this.totalImages - 1;
        else if(this.currentIndex >= this.totalImages) this.currentIndex = 0;

        console.log("change image to index " + this.currentIndex);

        this.currentImage = this.images[this.currentIndex];

        this.render();
    }


} //end class

customElements.define("image-slider", ImageSlider)

//Dynamic image slider HTML
//     <section class="container">
//         <div class="slider-wrapper">
//             <div class="slider">
//                 <img id="slide1" src="media/personal-eyes.PNG" alt="Title screen of Personal Eyes">

//                 PLACEHOLDER IMAGE
//                 <img id="slide2" src="media/cropbuster.jpg" alt="">
                        
//                 PLACEHOLDER IMAGE
//                 <img id="slide3" src="media/siege-the-castle.PNG" alt="">
//             </div>
//         <div class="slider-nav">
//             <span class="slider-dot"></span>
//             <span class="slider-dot"></span>
//             <span class="slider-dot"></span>
//         </div>
//         <div class="slider-arrows">
//             <span class="left-arrow">&lt;</span>
//             <span class="right-arrow">&gt;</span>
//         </div>
//     </div>
// </section>