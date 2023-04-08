Add subtitles to NPO Start



## Tools needed:
- a userscript manager: I use [tampermonkey](https://www.tampermonkey.net/). It is used to retrieve the Dutch captions and to inject the translated subtitles into the video player
- a tool to easily translate the subtitles: I use the extension [Subtitle Editor](https://github.com/pepri/subtitles-editor) on [Visual Studio Code](https://code.visualstudio.com/) (which uses Google Translate) because it's really simple to install and use (also it's free).

## Initial set-up: 
In your userscript manager, save [this script](https://github.com/Uuvu/add-subtitles-on-NPO-start/blob/main/npo.js)

## Now that everything is set up, let's watch a new video with translated subtitles!
1) Open a video on npostart.nl
![1](https://user-images.githubusercontent.com/101060119/158232700-88b0fa05-d418-4d8d-822f-e84474ef4661.png)

2) Click on the button in the top left corner*. This will:
- copy the Dutch captions in your clipboard
- open a new page with the same video (this is the real video player, the previous page embeds this player in an iframe) 
![2](https://user-images.githubusercontent.com/101060119/158232729-ef584d10-84ff-4b7f-a934-43c62b2fa26b.png) 

⚠ If you are using this for the first time, you may need to come back to the tab open in step 1 and allow the clipboard permission:
![image](https://user-images.githubusercontent.com/101060119/230739808-1a989272-4a8c-4032-b580-4e4d3183f182.png)


3) Paste the content of the clipboard in a new file in Open Visual Studio Code and translate them with Subtitle Editor (open the command palette: view>command palette, type "sub" and select "Subtitles:Translates", then enter the language you want to translate you subtitles in ex "EN", then press enter), then copy the translated subtitles.

![3](https://user-images.githubusercontent.com/101060119/158232768-2d4fb47f-5a5c-44fb-b40e-42ba1b5dfcb7.png)
![4](https://user-images.githubusercontent.com/101060119/158232777-87f9c249-cb1a-46fe-a2ab-af65074fa5a7.png)

4) Go back to the page opened in 2) and paste the subtitles in the text area in the top left corner and press Enter.
![5](https://user-images.githubusercontent.com/101060119/158232795-36662eea-00db-4db1-b31b-24b2ed498225.png)

5) Now start the video... and enjoy! 
![6](https://user-images.githubusercontent.com/101060119/158232805-5e1b34ea-871c-484c-83e7-d5d2f5579a35.png)

## Some tricks:
- In step 2), you can also press Alt+L, but this shortcut only works if the focus is on the main page (and not on the video, which is an iframe and not the main page): 
    - So, either do the shortcut before you click anything on the page 
    - or if you've already clicked on the video, click on the text description in the top left corner (this will set the focus on the main page) and then press Alt+L (but then, it's easier to simply click on the button!). 
- Hide/show the translated subtitles with Alt-L (as it is now, you cannot use the player settings to do that because the translated subtitles are not displayed there - more details in "possible improvements" below)
- If you add the translated subtitles to a video, they will be saved and the next time you open the same video, they will be loaded in the text area automatically. If you don't want to change them (ex into another language), just press Enter
- If you want to bookmark the video to continue watching it sometimes later, you need to bookmark the page in step 1 (not the player opened in step 2) as the link of the player changes after some time (couple of hours?). 
- The script also disables the dark overlay when the video is on pause (because it makes it difficult to read the subtitles): if you want to keep it, simply comment on that part in the script
- The script moves the volume button to the right of the video player: if you want to keep it in its original position, simply comment out that part in the script


## Many things are easily customizable by modifying the userscripts [even if you don't know how to code with javascript] (search for ● in the script)
- The key for the shortcuts 
- The position: you can change the position of the subtitle by modifying this part in the userscript "line:10% position:20% align:left". I added them in the top left corner so that it takes me some efforts to read the English subtitles. I am thus force to focus on the Dutch subtitles. Be careful, if you use the Dutch subtitles at the same time, as they can hide them. After you save the modifications in the usercript, you need to reload the page. 
- The size of the translated subtitles
- In step 2), instead of retrieving the captions by copying them to the clipboard, you can save a file (the code is already implemented, you just have to uncomment it and comment out the "clipboard" part)


## Some help if it doesn't work as expected:
- If the text area doesn't appear on the second player: try to press F5 to reload the page
- If the translated subtitles are not visible: the problem could come from the format of the translated subtitles, because sometimes when translating the subtitles, the format could be changed and they won't be recognize by the playe (ex: in VSCode, make sure that the Language mode is plain text and not html as html will add many spaces(click on the language mode in the bottom right corner). To debug, try with the original subtitles (the one that are sent in the clipboard). 



## Simple explanations about the process:
- Why do we have to watch the video on a special page? This special page is the real video player, the main page embeds this player in an iframe. To add the translated subtitles, we need to have direct access to the video player, which (as far as I know) is not possible if the player is in an iframe.
- Does it work with all videos on NPO? It worked for the dozen or so videos I tested from different programs chosen randomly. As long as the video has captions, it should work. If you find a video with captions for which the script doesn't work, please let me know!
- The subtitles translated by Google Translate aren't good enough! If you know a better option to translate the subtitles that is free and easy to set up, please share it. 


## For those who want to help, here are some possible improvements and more details:
- The translation process: it could be integrated (the script from the "Subtitle Editor" can be adapted; it's written in TypeScript). Also, it could use a better API than Google Translate (ex: Bing Microsoft Translator or Microsoft Azure or DeepL...)
- The shortcut on the main page: I couldn't find a way to trigger it when the iframe is on focus
- How the subtitles are added: NPO use video-js. There are (at least) 2 ways to add the subtitles. One via `<track>` and one via `player.addRemoteTextTrack`. I use `<track>` because I didn't find a way with `player.addRemoteTextTrack` to display simultaneously the Dutch captions and the translated subtitles. The problem with `<track>` is that the subtitles are not added in the settings panel (`player.addRemoteTextTrack` does add them). There is a setting (`layer.textTrackDisplay.allowMultipleShowingTracks`) that should make it work with `player.addRemoteTextTrack` but I wasn't able to figure out how to do it.  The script to add the subtitles with `player.addRemoteTextTrack` is already written but commented in the script.
- It would be nice if the subtitles were draggable (but is there a way to do that with video-js?)
- An easier way to customize the shortcuts, the translated subtitles than to edit the script
- Turn the script in an extension to simplify the installation process
- On the player page, when the left and right arrows are pressed, the video is paused (this doesn't happen on the main page: the video continues to play from the new requested time). The error is `Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause().` Is there something that can be done to prevent this? 
- Improve how the subtitles are saved for the next session: Currently the subtitles are saved in local storage and the key is the 1000 first characters of the video's URL. It is not the full URL because the last characters of the URL seem to change every couple of hours. Here is how to URL seems to be composed:
   - the first 199 characters seem to be the same for all the videos no matter the program.
   - the next 16 characters seem to be specific to each program
   - the following 980 are specific to each video
   - and the remaining characters seem to the specific to each day. 
I chose to set the key to the first 1000 characters just because it's easy to code and it's working (even though it's not very "clean")

