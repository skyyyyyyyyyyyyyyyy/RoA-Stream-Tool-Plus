import {viewport} from "../../GUI/Viewport.mjs";
import {readReplayFile} from "./Replay Reader/Replay Reader.mjs";
import {players} from "../../GUI/Player/Players.mjs";
import {getJson} from "../../GUI/File System.mjs";
import {stPath} from "../../GUI/Globals.mjs";
import {customChange, setCurrentPlayer} from "../../GUI/Custom Skin.mjs";
import {scores} from "../../GUI/Score/Scores.mjs";
import {displayNotif} from "../../GUI/Notifications.mjs";


const uploadButtonHTML = `
<div id="uploadReplayButtonContainer">
  <label id="uploadReplayInput" for="replayUpload" class="botRegion" title="Upload a replay file">
    <load-svg src="${stPath.scripts}/GUI Plugins/Replay Uploader/Upload.svg" id="uploadReplayIcon"></load-svg>
  </label>
  <input id="replayUpload" type="file" accept=".roa" onclick="this.value = null;" />
</div>`

const uploadButtonCSS = `
input[type="file"] {
  display: none;
}

#uploadReplayButtonContainer {
  width: 32px;
  background-color: var(--bg3);
}

@media (max-width: 590px) {
  #uploadReplayButtonContainer {
    width: 50px;
  }
}

#uploadReplayIcon {
  width: 28px;
  height: 28px;
  color: var(--text2);
}

#uploadReplayInput:hover {
  background-color: var(--bg1);
  cursor: pointer;
}

#uploadReplayInput:active {
  background-color: var(--bg5);
}`

// insert uploadButtonCSS as a stylesheet
const uploadButtonCSSElement = document.createElement("style");
uploadButtonCSSElement.textContent = uploadButtonCSS;
document.head.appendChild(uploadButtonCSSElement);

// insert upload button HTML
document.getElementById('botBarBracket').insertAdjacentHTML("afterend", uploadButtonHTML);

// event listener for upload button file upload
document.getElementById('replayUpload').addEventListener("change", (event) => {fileUploadButton(event)});

// event listener for drag-and-drop file upload
document.getElementById('viewport').addEventListener("drop", (event) => {fileUploadDragDrop(event)});

// prevents default viewport dragover behaviour, which blocks the file drop
document.getElementById('viewport').addEventListener("dragover", (event) => {event.preventDefault()});


/**
 * Handles uploading a replay file via the upload button.
 * @param event {Event} - The upload event containing the uploaded file.
 */
export async function fileUploadButton(event) {
    event.preventDefault();

    const file = event.target.files.item(0);
    const replayFile = await file.text();

    await updateGUIFromReplayFile(replayFile);
}


/**
 * Handles uploading a replay file via drag and drop.
 * @param event {DragEvent} - The drag and drop event that contains the uploaded file.
 */
export async function fileUploadDragDrop(event) {
    event.preventDefault();

    // if elsewhere, drag & drop takes you back to the main screen
    viewport.toCenter();

    const file = event.dataTransfer.files.item(0);

    // check if the file is a .roa file
    if (file.name.split(".").pop() === "roa") {
        const replayFile = await file.text();
        updateGUIFromReplayFile(replayFile);

    } else alert("That is NOT a .roa file!");

}

/**
 * Transfers the replay file data into the GUI.
 * Notably, does not update OBS immediately. Do that yourself.
 * @param replayFile {string} - The content of the replay file to be processed.
 */
async function updateGUIFromReplayFile(replayFile) {

    const replay = readReplayFile(replayFile);
    const settings = await getJson(`${stPath.scripts}/GUI Plugins/Replay Uploader/Settings`);

    for (let i = 0; i < replay.player.length; i++) {
        let GUIPlayer = players[i];
        let replayPlayer = replay.player[i];

        // this JSON call seems tacky, but I don't know how to get around it...
        // why doesn't GUIPlayer.charChange make this exact call??
        GUIPlayer.charInfo = await getJson(`${stPath.char}/${replayPlayer.character}/_Info`);

        setCurrentPlayer(GUIPlayer);

        GUIPlayer.setName(replayPlayer.username);

        // don't want to update score for players 3 & 4, since each team uses p1 and p2 score
        if (settings["Replays update win counts"] && i < 2) {
            scores[i].setScore(replayPlayer.wins);
        }

        await GUIPlayer.charChange(replayPlayer.character, true);
        customChange(replayPlayer.skinCode, replayPlayer.taunt);

    }

    displayNotif("Don't forget to press UPDATE!");
}


displayNotif("Drag and drop a .roa file!");