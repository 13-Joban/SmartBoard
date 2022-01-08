let optionsCont = document.querySelector(".options-cont");

let toolsCont = document.querySelector(".tools-cont");
let penciltools = document.querySelector(".pencil-tools");
let erasertools = document.querySelector(".eraser-tools");
let pencilToolFlag = false;
let erasertoolsFlag = false;
let optionFlag = true;
let pencil = document.querySelector(".Pencil");
let eraser = document.querySelector(".Eraser");
let sticky = document.querySelector(".StickyNote");
let upload = document.querySelector(".Upload")
let notesPage = document.querySelector(".sticky-cont");
let notesPageFlag = false;

penciltools.style.display = "none";

erasertools.style.display = "none";


//  click the option icons for opening and closing the tools

// NOTE --- if optionflag = true and we clicked  then  close the tools else open the tools 


let optionelement = optionsCont.children[0];


optionsCont.addEventListener("click", (e) => {

    optionFlag = !optionFlag;

    if (optionFlag) {
        openTool();
    } else {
        closeTool();
    }

})

function openTool() {


    // not necessary to open the eraser and pencil tools 


    penciltools.style.display = "none";

    erasertools.style.display = "none";




    toolsCont.style.display = "flex";
    // why flex ? because we made it flex while styling 

    // remove  * symbol
    optionelement.classList.remove("fa-times");
    optionelement.classList.add("fa-bars");


}
function closeTool() {
    penciltools.style.display = "none";

    erasertools.style.display = "none";
    toolsCont.style.display = "none";
    //   add   * symbol
    optionelement.classList.add("fa-times");
    optionelement.classList.remove("fa-bars");

}
// when clicked on pencil it will show pencil tools 

pencil.addEventListener("click", (e) => {

    pencilToolFlag = !pencilToolFlag;

    if (pencilToolFlag) {
        penciltools.style.display = "block";
    }
    else {
        penciltools.style.display = "none";
    }
})

// when clicked on eraser it will show eraser tools 

eraser.addEventListener("click", (e) => {

    erasertoolsFlag = !erasertoolsFlag;

    if (erasertoolsFlag) {
        erasertools.style.display = "flex";
    }
    else {
        erasertools.style.display = "none";
    }
})

upload.addEventListener("click", (e) => {


    // open the file explorer 

    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();


    input.addEventListener("change", (e) => {
        let file = input.files[0];

        let url = URL.createObjectURL(file);

        let stickytemplateHTML = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="close"></div>
        </div>
        <div class ="note-cont">
        <img src ="${url}"> </img>
        </div>
      `;

        createSticky(stickytemplateHTML);


    })

})


// when clicked on stickynotes Icon it will show notes  tools 

sticky.addEventListener("click", (e) => {

    let stickytemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="close"></div>
    </div>
    <div class="note-cont">
        <textarea class="textarea" spellcheck = "false"></textarea>
    </div>
 `
    createSticky(stickytemplateHTML);

});


// creating a template for the sticky container to enhance code reusability with the help of functional programming 


function createSticky(stickytemplateHTML) {


    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = `${stickytemplateHTML} `;

    document.body.appendChild(stickyCont);

    //  minimize and close button functionality

    let minimize = stickyCont.querySelector(".minimize");

    let close = stickyCont.querySelector(".close");

    NoteActions(minimize, close, stickyCont);

    // drag and drop functionality

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };


    stickyCont.ondragstart = function () {
        return false;
    };


};


// minimize and close buttons


function NoteActions(minimize, close, stickyCont) {

    minimize.addEventListener("click", (e) => {


        let notesCont = stickyCont.querySelector(".note-cont");

        let display = getComputedStyle(notesCont).getPropertyValue("display");

        if (display === "none") {
            notesCont.style.display = "block";
        }

        else {
            notesCont.style.display = "none";
        }
    })

    close.addEventListener("click", (e) => {
        stickyCont.remove();
    })

}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    // (1) prepare to moving: make absolute and on top by z-index
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    // move it out of any current parents directly into body
    // to make it positioned relative to the body
    // document.body.append(element);

    // centers the element at (pageX, pageY) coordinates


    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    // move our absolutely positioned element under the pointer
    moveAt(event.pageX, event.pageY);

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // (2) move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // (3) drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };


}
