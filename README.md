<h2>NOTE: This branch is a modification of the FRC version of the stream tool, which was uploaded to Readek's socials. The branch 'for-main-branch' builds off the main GitHub-available branch. <3</h2>
<p align="center">

  <img src="https://github.com/Readek/RoA-Stream-Tool/blob/master/preview.png" alt="Preview">
  
</p>

<h1 align="center">RoA Stream Tool+</h1>

<h2 align="center">Now with replay uploading functionality! Extract game data right from the replay file, including player names, characters, win counts, and custom colours!
<h3 align="center">*the rest of this README is unchanged*</h3></h2>


So you want to do a Rivals of Aether stream, huh? Well, today is your lucky day, because I have done tons of work so you don’t have to! With this tool, you will be able to set up a RoA tournament stream in no time.

*Now with a [Discord Server](https://discord.gg/EX22CTBNrM)!*

*Also available for [Melee](https://github.com/Readek/Melee-Stream-Tool) and [Rushdown Revolt](https://github.com/Readek/Rushdown-Revolt-Stream-Tool)!*

---

## Features
- [Easy and fast setup](https://file.garden/ZW90VTBJky9JVpp_/RoAST/Setup.mp4) using a browser source. Drag and drop!
- [Handy interface](https://file.garden/ZW90VTBJky9JVpp_/RoAST/GUIDemo.mp4) to quickly change everything you need, like player names, pronouns, characters, scores, round, casters...
  - With customizable **Player and Commentator Presets** to setup your match in no time!
- Every single character and skin the game has to offer is supported (more than 300 different skins!).
  - You can also add in **custom skin** codes for any character!
  - This includes **recolorable HD renders**!
  - **Workshop** characters are also supported!
- A "[VS Screen](https://file.garden/ZW90VTBJky9JVpp_/RoAST/VSDemo.mp4)" to be displayed when waiting for the next game.
- A [Bracket View](https://file.garden/ZW90VTBJky9JVpp_/RoAST/BracketPreview.png) to showcase your tournament's top 8 positions!
- A [Remote GUI](https://raw.githubusercontent.com/Readek/RoA-Stream-Tool/master/Git%20wiki%20images/8%20-%20Remote%20GUI/Mobile%20View.png) that can be accessed by any device within the local network, including mobile devices!
- Now with **2v2 support**!
- Made to be customized! Add workshop characters, custom overlays or even dive into the code if you're brave enough!

---

## How to setup
These are instructions for **OBS Studio**:
- Get the [latest release](https://github.com/Readek/RoA-Stream-Control/releases).
- Extract somewhere.
- Drag and drop `RoA Scoreboard.html` into OBS, or add a new browser source in OBS pointing at the local file.
  - If the source looks weird, manually set the source's properties to 1920 width and 1080 height, or set your OBS canvas resolution to 1080p, or make the source fit the screen (Ctrl+F).
- In the source's properties, change *Use custom frame rate* -> `60` (if streaming at 60fps of course).
- Manage it all with the `RoA Stream Tool` executable.

Repeat from the 3rd step to add the `VS Screen.html` and `Bracket.html` views, though I recommend you to do so on another scene.

It is **very recommended** that you turn off the in-game top HUD. The overlay was made with that HUD off in mind.

### Interface shortcuts!
- Press `Enter` to update*.
- Press either `F1` or `F2` to increase P1's or P2's score.
- Press `ESC` to clear player info*.

** Functionallity may change in some menus to ease workflow.*

For developing, there are some shorcuts to make things easier:
- Press `F5` to reload the GUI.
- Press `F12` to open the dev console. This will also unlock window resolution.

---

## Advanced setup
Yes, those instructions above are enough, but we can do better. **All of this is optional** of course.
 
2 basic transitions are included in the `Resources/OBS Transitions` folder, intended to be used to change to the game scene and to the vs screen, if you don't have a transition yourself of course. To use them on OBS:
- Add a new stinger transition.
- Set the video file to `Game In.webm` if creating the game scene transition, and `Swoosh.webm` if creating a vs screen transition.
- Transition point -> `350 ms`.
- I recommend you to set the Audio Fade Style to crossfade, just in case.
- On the scene's right click menu, set it to Transition Override to the transition you just created.
- Also, you may want to set a hotkey to transition to the game scene so you can press enter ingame to start the replay and press the transition key at the same time. The transition is timed to do so.

Also, you may find the "3 2 1" of the game's intro a bit distracting when combined with the scoreboard intro. [These](https://drive.google.com/open?id=1NEDii3B50eHT_goADzn6t3_O8Uvok0Gs) are the sprites to remove them (using the [Modding Tool](https://github.com/jam1garner/gm_data_win/releases/latest)).

### Remote GUI

The Stream Tool GUI can be controlled remotely by any device within the local network where the GUI is running, and yes, this includes mobile devices! Please take a look at the [wiki](https://github.com/Readek/RoA-Stream-Tool/wiki/8.-Remote-GUI) for instructions.

---

## Other stuff...
Do you want to customize something? Do you need some OBS tips and tricks for a RoA stream? **Please, go to the [wiki](https://github.com/Readek/RoA-Stream-Control/wiki)**!

The project now has a **Discord server**! If you need support about this (or other) stream tools, you're free to [join us](https://discord.gg/EX22CTBNrM)!

**Workshop creators**! Do you want your character added to the Stream Tool? There's [a guide](https://github.com/Readek/RoA-Stream-Tool/wiki/6.-Workshop-characters) to help you do that, don't worry!

Do you want to adapt this project to another game but can't figure out how to? Lucky for you, I'm open for commisions! Contact me on [Mastodon](https://mstdn.social/@Readek) or on the project's [Discord Server](https://discord.gg/EX22CTBNrM)!

Do you want to support this project? You can contribute, and get some extra rewards, on [Ko-fi](https://ko-fi.com/readek) or [Patreon](https://www.patreon.com/Readek)! Every bit helps towards development of more features and stream tools!

### Closing notes
This project is basically my learning grounds as a web developer. This is actually where I started learning javascript! As such, the code you're about to see may be unoptimized or badly written, so if you know how the web dev world works, please leave suggestions about how to improve the project as pull requests, or take a look at the [issues page](https://github.com/Readek/RoA-Stream-Tool/issues) to see if you can help with those! Any help will be greatly appreciated.

---

*Also, you may wonder, what happened to the old, [lua scripted version](https://drive.google.com/open?id=15o52oz89siOJ5f_toD7zZDjp22dn2t73) of this controller? Well, turns out obs is just not ready for this kind of stuff. Current version of OBS doesn't have any kind of animator, and has to stutter to load every image you want to change, so it was really hard to get around that. Also, was much harder to update. With this javascript version, I wanted to make things better so I could update it with more ease. Anyways, the link of the old version will stay up if you ever want to know about lua obs scripting!*

---
