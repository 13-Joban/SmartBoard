let canvas = document.querySelector("canvas");
let download = document.querySelector(".Download");
let undoRedoTracker = []; // data 
let track = 0; // Represent which action from tracker array 

let undo = document.querySelector(".Undo");
let redo = document.querySelector(".Redo");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let pencilwidthElem = document.querySelector(".dukhi1");
let pencilColor = document.querySelectorAll(".pencil-color");

let eraserwidthElem = document.querySelector(".dukhi2");

let penWidth = pencilwidthElem.value;
let eraserWidth = eraserwidthElem.value;
let penColor = "red";
let erasercolor =  "white";

//API 
let tool = canvas.getContext("2d");
let mousedown = false;

 tool.strokeStyle = penColor; // color of graphic 
 tool.lineWidth = penWidth; // width of graphic line


// tool.beginPath(); // new graphic line
//  tool.moveTo(14, 10); // starting point
// tool.lineTo(100, 304); // end point
// tool.stroke(); // visibility 

// tool.lineTo(20000, 600); // start from where the first ended
//  tool.stroke();

//  tool.strokeStyle = "brown";
//  tool.beginPath(); // new line
//  tool.moveTo(200, 450);
//  tool.lineTo(445, 904);
//  tool.stroke(); //


// mousedown --> start new path 
// mousemove --> Fill the path 

canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX, 
    //     y: e.clientY
       
    // });
//  tool.beginPath();
//  tool.moveTo(e.clientX, e.clientY);     // clientX gives the horizontal distance 
//                                         // clientY gives the vertical distance 
// mousedown = true;\

let data = {
    x:  e.clientX, 
        y: e.clientY
       

}

 socket.emit("beginPath", data);

});
canvas.addEventListener("mousemove", (e) => {
    if(mousedown){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: erasertoolsFlag ? erasercolor : penColor,
            width: erasertoolsFlag ? eraserWidth : penWidth, 

        }
        socket.emit("Fillpath", data);

    }
    //    Fillpath({
    //        x: e.clientX,
    //        y: e.clientY,
    //        color: erasertoolsFlag ? erasercolor : penColor,
    //        width: erasertoolsFlag ? eraserWidth : penWidth, 
    //    })
    

})

canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;



})

function beginPath(StrokeObject) {
    tool.beginPath();
    tool.moveTo(StrokeObject.x, StrokeObject.y);     

}

function Fillpath(StrokeObject) {
    

       
        tool.lineWidth = StrokeObject.width;
        tool.strokeStyle = StrokeObject.color;
        tool.lineTo(StrokeObject.x, StrokeObject.y);

        tool.stroke();
    
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
       penColor = color;
       tool.strokeStyle = penColor;
    })
})
pencilwidthElem.addEventListener("change", (e) => {

   
    penWidth = pencilwidthElem.value;

    tool.lineWidth = penWidth;

})
eraserwidthElem.addEventListener("change", (e) => {

    
   
    eraserWidth = eraserwidthElem.value;
   tool.strokeStyle = erasercolor;
    tool.lineWidth = eraserWidth;
    
});


eraser.addEventListener("click", (e) => {

    
    if(erasertoolsFlag){
        tool.strokeStyle = erasercolor;
        tool.lineWidth = eraserWidth;
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
 let a = document.createElement("a")
 a.href = url;
 a.download = "board.jpg";
 a.click();
});


undo.addEventListener("click", (e) => {
   

    // canvas graphicarray ---> [g1, g2, g3, g4]
    //                                        ^
    //                                        ^
    //                                       track



  if  (track > 0){
      track--;
  }
//   action

let data = {
    trackValue: track,
    undoRedoTracker
}
// undoRedoCanvas(trackObj);


// tracker = trackObj.trackValue;
  
// undoRedoTracker = trackObj.undoRedoTracker;
// let url = undoRedoTracker[tracker];

// let img = new Image(); // new image refrence element
// img.src = url;
// img.onload = (e) => {
//     tool.drawImage(img, 0, 0, canvas.height, canvas.width);

// }

socket.emit('undoRedo', data);

})

redo.addEventListener("click", (e) => {

        // canvas graphicarray ---> [g1, g2, g3, g4]
    //                                ^      
    //                                ^        
    //                              track       
  

    if(track < undoRedoTracker.length - 1){
        track++;
    }


    // action 
      let data = {
        trackValue: track,
        undoRedoTracker
    }

    socket.emit('undoRedo', data);

    // undoRedoCanvas(trackObj);
    // tracker = trackObj.trackValue;
  
    // undoRedoTracker = trackObj.undoRedoTracker;
    // let url = undoRedoTracker[tracker];

    // let img = new Image(); // new image refrence element
    // img.src = url;
    // img.onload = (e) => {
    //     tool.drawImage(img, 0, 0, canvas.height, canvas.width);

    // }

})


function undoRedoCanvas(trackObj){

    track = trackObj.trackValue;
  
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = undoRedoTracker[track];

  let img = new Image(); // new image refrence element
    img.src = url;
    img.onload = (e) => {

        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
        // document.body.appendChild(canvas);
    }

}


// socket.io --> library for real time data flow   

//  

// Now am checking that server has sent data back to me

socket.on('beginPath', (data) => {
// data represents data from server


// and now the computer will perform the tasks 
beginPath(data);



})
socket.on('Fillpath', (data) => {

    Fillpath(data);

})

socket.on('undoredo', (data) => {

  undoRedoCanvas(data);
})


