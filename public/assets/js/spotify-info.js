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
          url: 'https://api.spotify.com/v1/me/player/currently-playing',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          data: {
            'additional_types': 'episode'
          },
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
            console.log(artElement);
            if(response == undefined){
              $('#pausedModal').modal('show');
            }
            else{
              console.log(response);
              if(response.is_playing == false){
                console.log("track is paused");
                $('#pausedModal').modal('show');
              }
              else{
                $('#pausedModal').modal('hide');
                if(response.item.type == 'episode'){
                  artistElement.innerHTML = response.item.show.name;
                  albumElement.innerHTML = response.item.show.publisher;
                  var albumSource = response.item.images[0].url
                }
                else{
                  artistElement.innerHTML = response.item.artists[0].name;
                  albumElement.innerHTML = response.item.album.name;
                  var albumSource = response.item.album.images[0].url
                }
                trackElement.innerHTML = response.item.name;

                var trackDuration = response.item.duration_ms;
                var trackProgress = response.progress_ms;
                console.log(trackDuration);
                console.log(trackProgress);
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
                  //todo: clear/download modal
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
    } else {
      if (access_token) {
        getTrackData();

      } else {
          // render initial screen
          //TODO: show error modal with button to go back to home page
          // $('#login').show();
          // $('#loggedin').hide();
          // $('#cursorDiv').hide();
          // $('#sketchpad').hide();
      }

      function getNewToken(){
        $.ajax({
          url: '/refresh_token',
          data: {
            'refresh_token': refresh_token          }
        }).done(function(data) {
          access_token = data.access_token;
          console.log(data);
          console.log("REFRESH: " + refresh_token);
          console.log("ACCESS: " + access_token);
        });
        setTimeout(getNewToken, 3500000);
      }
      getNewToken();
    }
  })();
