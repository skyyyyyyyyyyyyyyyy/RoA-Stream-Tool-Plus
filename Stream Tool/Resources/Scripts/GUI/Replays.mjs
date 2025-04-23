import {viewport} from "./Viewport.mjs";
import {readReplayFile} from "./Replay Reader/Replay Reader.mjs";
import {players} from "./Player/Players.mjs";
import {getJson} from "./File System.mjs";
import {stPath} from "./Globals.mjs";
import {customChange, setCurrentPlayer} from "./Custom Skin.mjs";
import {settings} from "./Settings.mjs";
import {scores} from "./Score/Scores.mjs";
import {writeScoreboard} from "./Write Scoreboard.mjs";


export async function fileUploadButton(event) {
    event.preventDefault();

    const file = event.target.files.item(0);
    const replayFile = await file.text();

    await updateGUIFromReplayFile(replayFile);
}


export async function fileUploadDragDrop(event) {
    event.preventDefault();

    // if elsewhere, drag & drop takes you back to the main screen
    viewport.toCenter();

    const file = event.dataTransfer.files.item(0);

    if (file.name.split(".").pop() === "roa"){
        const replayFile = await file.text();

        await updateGUIFromReplayFile(replayFile);
    }
    else alert("That is NOT a .roa file!");

}


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
        if (settings.isReplaysUpdateScoreChecked() && i < 2) {
            scores[i].setScore(replayPlayer.wins);
        }

        await GUIPlayer.charChange(replayPlayer.character, true);
        await customChange(replayPlayer.skinCode, replayPlayer.taunt);
    }

    if (settings.isReplaysAutoUpdateOverlayChecked()) {
        await writeScoreboard();
    }
}