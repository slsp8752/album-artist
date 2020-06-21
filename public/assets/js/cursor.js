const smallBall = document.querySelector('.cursor__ball');
var slider = document.getElementById('sizeSlider');
    slider.addEventListener('input', resize);

resize();

document.body.addEventListener('mousemove', onMouseMove);

function showCursor(){
  var cursor = document.getElementById('cursorDiv');
  cursor.style.display = "block";
}

function hideCursor(){
  var cursor = document.getElementById('cursorDiv');
  cursor.style.display = "none";
}

function onMouseMove(e) {
var cursor = document.getElementById('circleCursor');
var svgSize = cursor.getAttributeNS(null, 'cx');
  smallBall.style.transform = "translate(" + (e.clientX - svgSize) + "px," + (e.clientY - svgSize) + "px)";
}


function resize(e){
var cursor = document.getElementById('circleCursor');
var sliderVal = parseInt(slider.value, 10);
var sliderValScaled = scaleValue(sliderVal, [1, 100], [1,30]);
cursor.setAttributeNS(null, 'r', sliderValScaled);
cursor.setAttributeNS(null, 'cx', sliderValScaled+1);
cursor.setAttributeNS(null, 'cy', sliderValScaled+1);

var brushPreview = document.getElementById('brushPreview');
brushPreview.setAttributeNS(null, 'r', sliderValScaled);
brushPreview.setAttributeNS(null, 'cx', 31);
brushPreview.setAttributeNS(null, 'cy', 31);

pad.setLineSize(sliderValScaled * 2);
}
