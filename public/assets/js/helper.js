$(window).resize(function(){
  // document.body.style.backgroundPosition = window.innerWidth/2 + "px " + (window.innerHeight-100)/2 + "px";
 if($(window).width() <= 660){
  $('#color-buttons').removeClass('ml-auto');
  $('#color-buttons').addClass('mx-auto');
 }
 else{
   $('#color-buttons').addClass('ml-auto');
   $('#color-buttons').removeClass('mx-auto');
 }
});

window.onbeforeunload = function() {
  return "Your drawing will be lost if you leave this page, are you sure?";
};

function scaleValue(value, from, to) {
	var scale = (to[1] - to[0]) / (from[1] - from[0]);
	var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
	return ~~(capped * scale + to[0]);
}

$(document).on('click', '.dropdown-menu', function (e) {
  e.stopPropagation();
});

function changeFGColor(e){
  var cursor = document.getElementById('circleCursor');
  var color = e.target.style.backgroundColor;
  cursor.setAttributeNS(null, 'fill', color);
  var brushPreview = document.getElementById('brushPreview');
  brushPreview.setAttributeNS(null, 'fill', color);
  pad.setLineColor(color);
  document.getElementById("pal1a").style.backgroundColor = color;
}

function changeBGColor(e){
  var color = e.target.style.backgroundColor;
  //console.log(color);
  document.body.style.backgroundColor = color;
  document.getElementById("pal2a").style.backgroundColor = color;
  currentBGColor = color;
}
