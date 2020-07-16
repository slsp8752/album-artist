var el = document.getElementById('sketchpad');
// console.log(el);


// var body = document.body,
//     html = document.documentElement;
//
// var height = Math.max( body.scrollHeight, body.offsetHeight,
//                        html.clientHeight, html.scrollHeight, html.offsetHeight );
// var sliderVal = document.getElementById('sizeSlider').value;
// var brushSize = scaleValue(sliderVal, [0,100], [1,30]) * 2;
var pad = new Sketchpad(el, {
  width: el.offsetWidth,
  height: window.innerHeight - 100,
  line: {
    size: 10,
    color: "rgba(0,0,0,0)"
  }
});


pad.resize(el.offsetWidth);
setPencil();
// setLineSize
function setLineSize(e) {
    var size = e.target.value;
    var sizeScaled = scaleValue(size, [0,100], [1,30]) * 2;

    pad.setLineSize(sizeScaled);
}
//document.getElementById('sizeSlider').oninput = setLineSize;

function setEraser(){
  // highlight eraser, un-highlight pencil
  var eraser = document.getElementById("eraser");
  var pencil = document.getElementById("pencil");
  eraser.classList.remove("btn-secondary");
  eraser.classList.add("btn-primary");
  pencil.classList.remove("btn-primary");
  pencil.classList.add("btn-secondary");

  pad.setLineTool(true);
}
document.getElementById('eraser').onclick = setEraser;

function setPencil(){
  // highlight pencil, un-highlight eraser
  var eraser = document.getElementById("eraser");
  var pencil = document.getElementById("pencil");
  pencil.classList.remove("btn-secondary");
  pencil.classList.add("btn-primary");
  eraser.classList.remove("btn-primary");
  eraser.classList.add("btn-secondary");
  pad.setLineTool(false);
}
document.getElementById('pencil').onclick = setPencil;

// undo
function undo() {
    pad.undo();
}
document.getElementById('undo').onclick = undo;

// redo
function redo() {
    pad.redo();
}
document.getElementById('redo').onclick = redo;

// clear
function clear() {
    pad.clear();
}

document.getElementById('clearConfirmButton').onclick = clear;

// resize
window.onresize = function (e) {
  pad.resize(el.offsetWidth);
}
