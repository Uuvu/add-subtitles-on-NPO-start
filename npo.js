// ==UserScript==
// @name         B NPO Main ahkqq
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Retrieve NPO caption and add translated subtitles to NPO video
// @author
// @match        https://www.npostart.nl/*
// @match        https://start-player.npo.nl/embed/*
// @grant        none
// ==/UserScript==

window.addEventListener('load', function () {
  // console.log("tampermonkey loaded")

  // Script for the main video page
  if (document.URL.includes("npostart.nl")) {
    if (window.top === window.self) {

      // only add the button /shortcut on the video pages
      var topMenu = document.getElementsByClassName("npo-menu")
      if (topMenu.length == 0) {
        var button = document.createElement("button");
        button.innerHTML = "Watch with translated Subtitle (or Alt+L)";
        button.onclick = getCaptionAndOpenVideoPayer;
        button.style.position = "absolute";
        button.style.top = "0px";
        button.style.left = "0px";
        document.body.appendChild(button);

        // add  event shorctut on the main page (but doesn't work for the iframe)
        document.addEventListener("keydown", function (key) {
          if (key.altKey && key.code === "KeyL") { //  ●  to find the key name : https://keyjs.dev/
            getCaptionAndOpenVideoPayer()
          }
        }, true);
      }
    } // end if window.top === window.self


    // script for the video player page
  } else if (document.URL.includes("start-player.npo.nl/embed")) {
    if (window.top === window.self) {
      // add a textarea to retrieve the translated subtitles
      var divM = document.createElement("div");
      divM.innerHTML = `
                    <textarea id="vttTextAreaEN" placeholder="Paste English subs and press Enter" style="position: absolute; top: 0px; left: 0px; width: 200px; height: 80%; border: none; z-index: 99;></textarea>
                    <!--textarea id="vttTextAreaNL" placeholder="NL subs"></textarea>-->
                    `
      document.body.appendChild(divM);

      // retrieve previous translated subtitles and add them to the textarea
      var textarea = document.getElementById("vttTextAreaEN")


      var url1000 = document.URL.substring(0, 1000);
      textarea.value = localStorage.getItem(url1000)


      // add focus to textarea
      textarea.focus()

      // ● optional: this will remove the dark overlay that makes it difficult to read the subtitles when on pause/send shortcut + it move the volume button to the right side. This block can be commented out.
      var styles = `
                    /* remove dark overlay*/
                    .video-js:before{
                        background: #f5f0f000;
                    }
                    /* move volume button to the right side */
                    .video-js .vjs-volume-panel.vjs-volume-panel-vertical {
                        position: relative;
                       left: 60px;
                    }
                 `
      var styleSheet = document.createElement("style")
      styleSheet.innerText = styles
      document.head.appendChild(styleSheet)
      // ● comment until here if you wan to keep the dark overlay and the volume button on the left side

      // add event when press Enter on the textarea
      var textareaSourceEn = document.getElementById('vttTextAreaEN');
      textareaSourceEn.addEventListener('keydown', function (e) {
        if (e.key == 'Enter') {

          // retrieve the translated subtitles and remove the textarea
          var vttTranslatedEn = document.getElementById('vttTextAreaEN').value
          var elem = document.getElementById("vttTextAreaEN");
          elem.parentNode.removeChild(elem);

          /******************** ● option 1: add translated subtitles to the player via <track>  ********************/
          //  cons: the subtitles language doesn't appear in the player settings
          //  pros: captions and translated subtitles are display simultaneously

          // modify the position of the subtitles (the size parameter doesn't work, it's modified via css cf below)
          vttTranslatedEn = vttTranslatedEn.replaceAll("line:90% position:50% align:middle", "line:10% position:20% align:left"); // ● replace "line:10% position:20% align:left" by whatever you want


          // save the translated subtitles in the local storage
          var url1000 = document.URL.substring(0, 1000);
          localStorage.setItem(url1000, vttTranslatedEn);


          // add the translated subtitles to the player
          const type = 'text/plain'
          const blob = new Blob([vttTranslatedEn], {
            type
          })
          const url = URL.createObjectURL(blob)

          document.getElementById("video_html5_api").innerHTML = '<track label="English Captions" srclang="en" kind="captions" src=' + url + ' type="text/vtt" default />';

          // change the size of the text   ●
          var styles = `
                        video::-webkit-media-text-track-display {
                        font-size: 50%;
                        }
                      `
          var styleSheet = document.createElement("style")
          styleSheet.innerText = styles
          document.head.appendChild(styleSheet)


          // add a shorcut to toggle the display of the translated subtitles
          // there is probably a better way to do this than with a "memory variable"
          var displayState = 1;
          document.addEventListener("keydown", toggleDisplayTranslatedSub_viaShortcut, false);

          function toggleDisplayTranslatedSub_viaShortcut(key) {

            if (key.code === "ArrowLeft") {
              console.log('enter')
              const ke = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: 13
              });
              document.body.dispatchEvent(ke);
            }
            if (key.altKey && key.code === "KeyL") { //  ●  to find the key name : https://keyjs.dev/
              if (displayState) {
                var stylesA = `
                            video::-webkit-media-text-track-display {
                             display: none;
                             }
                            `
                var styleSheetA = document.createElement("style")
                styleSheetA.innerText = stylesA
                document.head.appendChild(styleSheetA)
                displayState = 0
              } else {
                var stylesB = `
                           video::-webkit-media-text-track-display {
                           display: block;
                           }
                         `
                var styleSheetB = document.createElement("style")
                styleSheetB.innerText = stylesB
                document.head.appendChild(styleSheetB)
                displayState = 1
              }
            }
          }


          /******************** ● option 2: add translated subtitles to the player via player.addRemoteTextTrack: ********************/
          // pro: the translated subtitles appears in the player setting
          // cons: couldn't find a way to make the captions and translated subtitles display simultaneously (also it should be possible)

          // // turn the translated subtitles into a blob that is then used as an URL
          // const type = 'text/plain'
          // const blob = new Blob([vttTranslatedEn], {
          //   type
          // })
          // const url = URL.createObjectURL(blob)

          // // add the translated subtitles to the player
          // // https://stackoverflow.com/a/65019326
          // let captionOption = {
          //   kind: 'subtitles',
          //   srclang: 'en',
          //   label: 'English',
          //   src: url
          // };
          // player.addRemoteTextTrack(captionOption)
          // const tracks = player.remoteTextTracks();
          // for (let i = 0; i < tracks.length; i++) {
          //   const track = tracks[i];
          //   if (track.kind === 'subtitle' && track.language === 'en') {
          //     track.mode = 'showing';
          //   }
          // }


          /******************** ● Still in development:  ********************/
          // Trying to make translated subtitles added via player.addRemoteTextTrack appear simultaneously with the original caption

          // // first trying to remove all tracks (text and remoteText), enable the player.textTrackDisplay.allowMultipleShowingTracks and then add the tracks
          // const tracks = player.textTracks();
          // for (let i = 0; i < tracks.length; i++) {
          //   const track = tracks[i];
          //   player.textTracks().removeTrack(track)
          //   // player.removeTrack(track)

          // }

          // const tracksr = player.remoteTextTracks();
          // for (let i = 0; i < tracksr.length; i++) {
          //   const trackr = tracksr[i];
          //   player.remoteTextTracks().removeTrack(trackr)
          //   // player.removeTrack(track)

          // }
          // // make sure that the tracks are removed
          // console.log(player.remoteTextTracks())
          // console.log(player.textTracks())

          // // enable settings to allow  multiple subtitles at once
          // player.textTrackDisplay.allowMultipleShowingTracks = true

          // // option 2 should be copy/paste here twice to back the orginal caption and the translated subtitles (this needs a second textarea to send the orignal caption along with the translated one)

          // then enable all tracks
          // player.textTracks()[0].mode = 'disabled';
          // player.textTracks()[0].mode = 'showing';
          // player.textTracks()[1].mode = 'disabled';
          // player.textTracks()[1].mode = 'showing';


        } // end of "enter" event
      }); // end of dispatch event

    } // if window.top
  } // end if url
})


function getCaptionAndOpenVideoPayer() {

  // Retrieve the epidoseID and assemble the link of thecaption VTT file
  var epidoseID = document.URL.split("/").pop()
  var urlVTT = "https://assetscdn.npostart.nl/subtitles/original/nl/" + epidoseID + ".vtt"

  /******************** ● Option1: copy the content of the subtitle in the clipboard and open the video player ********************/
  function sendTextToClipboard(e) {
    e.clipboardData.setData("text/plain", vttContentM);
    e.preventDefault();
  }
  var vttContentM = ""
  fetch(urlVTT)
    .then(response => response.text())
    .then(vttContent => {
      vttContentM = vttContent
      document.addEventListener("copy", sendTextToClipboard);
      document.execCommand("copy");
      document.removeEventListener("copy", sendTextToClipboard);

      // get the link of the real video player (the main page calls an iframe) and open it
      var urlIframe = document.getElementsByTagName("iframe")[0].src
      console.log(urlIframe)
      window.open(urlIframe, '_blank').focus();
    })
    .catch(() => alert('problem!'));


  /******************** ● Option 2: save the subtitle file and open the video player ********************/
  // fetch(urlVTT)
  //   .then(resp => resp.blob())
  //   .then(blob => {
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.style.display = 'none';
  //     a.href = url;

  //     // the filename you want
  //     a.download = 'npo_' + epidoseID + '.vtt';
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);

  //     // get the link of the real video player (the main page calls an iframe) and open it
  //     var urlIframe = document.getElementsByTagName("iframe")[0].src
  //     window.open(urlIframe, '_blank').focus();
  //   })
  //   .catch(() => alert('problem!'));


}