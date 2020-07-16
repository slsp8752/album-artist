var trackTimer;

var pageLoad = false;
  (function() {

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    document.getElementById('album-art-refresh').onclick = getTrackData;
    document.getElementById('recheckPauseStatusButton').onclick = getTrackData;
    artElement.src = "assets/img/note.png"
    function getTrackData(){
      $.ajax({
          url: '/track_info',
          success: function(response) {
            var spotifyData = {
              "album_art" : "assets/img/note.png",
              "track_title" : "",
              "artist" : "",
              "album" : ""
            }
            var trackElement = document.getElementById("track");
            var artistElement = document.getElementById("artist");
            var albumElement = document.getElementById("album");
            var artElement = document.getElementById("album-art");
            // console.log(artElement);
            if(response.valid == false){
              $('#pausedModal').modal('show');
            }
            else{
              // console.log(response);
              if(response.is_playing == false){
                // console.log("track is paused");
                $('#pausedModal').modal('show');
              }
              else{
                $('#pausedModal').modal('hide');
                artistElement.innerHTML = response.artist;
                albumElement.innerHTML = response.album;
                var albumSource = response.art
                trackElement.innerHTML = response.track;

                var trackDuration = response.duration;
                var trackProgress = response.progress;
                // console.log(trackDuration);
                // console.log(trackProgress);
                clearTimeout(trackTimer);
                trackTimer = setTimeout(getTrackData, (trackDuration-trackProgress)+1000);
                // $('#login').hide();
                // $('#cursorDiv').show();
                // $('#loggedin').show();
                // $('#sketchpad').show();
                // $('#login').removeClass("d-flex");
                if(albumSource != artElement.src){
                  if(pageLoad == true){
                    $('#newAlbumModal').modal('show');
                  }
                  artElement.src = albumSource;
                  const album = document.querySelector('img').src;
                  const colorThief = new ColorThief();
                  var img = new Image();
                  img.crossOrigin = "Anonymous";
                  img.src = album;
                  img.onload = function () {
                     palette = colorThief.getPalette(img);
                     prevBGColor = currentBGColor;
                     currentBGColor = "rgb(" + palette[1].join() + ")";
                     // console.log(currentBGColor);
                     if(pageLoad == false){
                       document.body.style.backgroundColor = "rgb(" + palette[1].join() + ")";
                       pageLoad = true;
                     }
                     pad.setLineColor("rgb(" + palette[0].join() + ")");
                     var brushPreview = document.getElementById('brushPreview');
                     var cursor = document.getElementById('circleCursor');
                     brushPreview.setAttributeNS(null, 'fill', "rgb(" + palette[0].join() + ")");
                     cursor.setAttributeNS(null, 'fill', "rgb(" + palette[0].join() + ")");
                     for(var i = 0; i < palette.length-2; i++){
                       var pal = document.getElementById('pal' + (i+1).toString(10));
                       if(i < 2){
                         var pal_prev = document.getElementById('pal' + (i+1).toString(10) + 'a');
                       }
                       rgb = palette[i].join();
                       var pal_bg = document.getElementById('pal' + (i+1).toString(10) + 'b');
                       pal_bg.style.backgroundColor = "rgb(" + rgb + ")";
                       pal.style.backgroundColor = "rgb(" + rgb + ")";
                       if(i < 2){
                         pal_prev.style.backgroundColor = "rgb(" + rgb + ")";
                       }
                    }
                  }
                }
              }
            }
          }
      });
    }

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
      alert('There was an error during the authentication');
    }
    else {
      getTrackData();
      // getNewToken();
    }
    function getNewToken(){
      $.ajax({
        url: '/refresh_token',
      });
      setTimeout(getNewToken, 3500000);
    }
  })();
