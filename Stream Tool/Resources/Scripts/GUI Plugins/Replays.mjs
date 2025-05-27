import {viewport} from "../GUI/Viewport.mjs";
import {readReplayFile} from "./Replay Reader/Replay Reader.mjs";
import {players} from "../GUI/Player/Players.mjs";
import {getJson} from "../GUI/File System.mjs";
import {stPath} from "../GUI/Globals.mjs";
import {customChange, setCurrentPlayer} from "../GUI/Custom Skin.mjs";
import {scores} from "../GUI/Score/Scores.mjs";
import {displayNotif} from "../GUI/Notifications.mjs";


// event listener for file upload
document.getElementById('viewport').addEventListener("drop", (event) => {fileUploadDragDrop(event)});

// prevents default dragover behaviour, which blocks the file drop
document.getElementById('viewport').addEventListener("dragover", (event) => {event.preventDefault()});


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

    let replay = readReplayFile(replayFile);

    for (let i = 0; i < replay.player.length; i++) {
        let GUIPlayer = players[i];
        let replayPlayer = replay.player[i];

        // this JSON call seems tacky, but I don't know how to get around it...
        // why doesn't GUIPlayer.charChange make this exact call??
        GUIPlayer.charInfo = await getJson(`${stPath.char}/${replayPlayer.character}/_Info`);

        setCurrentPlayer(GUIPlayer);

        GUIPlayer.setName(replayPlayer.username);

        // don't want to update score for players 3 & 4, since each team uses p1 and p2 score
        if (i < 2) {
            scores[i].setScore(replayPlayer.wins);
        }

        await GUIPlayer.charChange(replayPlayer.character, true);
        customChange(replayPlayer.skinCode, replayPlayer.taunt);
    }
}


displayNotif("Drag and drop a .roa file!");