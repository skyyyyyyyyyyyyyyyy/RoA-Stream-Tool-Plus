import { bestOf } from './BestOf.mjs';
import { casters } from './Caster/Casters.mjs';
import { currentColors } from './Colors.mjs';
import { gamemode } from './Gamemode Change.mjs';
import { players, playersReady } from './Player/Players.mjs';
import { round } from './Round.mjs';
import { scores } from './Score/Scores.mjs';
import { settings } from './Settings.mjs';
import { teams } from './Team/Teams.mjs';
import { tournament } from './Tournament.mjs';
import { wl } from './WinnersLosers.mjs';
import { inside } from './Globals.mjs';
import { saveSimpleTexts } from './File System.mjs';

const updateDiv = document.getElementById('updateRegion');
const updateText = updateDiv.getElementsByClassName("botText")[0];
const updateRegion = document.getElementById('updateRegion');
let yetToUpdate = false;
let firstTimeUpdating = true;

// bottom bar update button
updateDiv.addEventListener("click", writeScoreboard);

/** Allows Bracket.mjs to tell this file that the overlay hasn't been updated since a file was uploaded */
export function setYetToUpdate(value) {
    yetToUpdate = value;
}

/**
 * Warns the user that a player is not ready to update yet
 * @param {Boolean} state - True if ready, false if not
 */
export function readyToUpdate(state) {
    if (state) {
        if (playersReady()) {
            if (yetToUpdate) {
                changeUpdateText("DON'T FORGET TO UPDATE", "--bg3_angry");
                yetToUpdate = false;
            } else {
                changeUpdateText("UPDATE");
            }
            updateDiv.style.pointerEvents = "auto";
        }
    } else {
        changeUpdateText("LOADING CHARACTERS...");
        updateDiv.style.pointerEvents = "none";
    }
}

/** Changes the text displayed on the update button */
export function changeUpdateText(text, style) {
    updateText.innerHTML = text;
    if (style) {
        updateDiv.style.backgroundColor = `var(${style})`;
    }
    else {
        updateDiv.style.backgroundColor = "";
    }
}


/** Adds delay to green background colour when pressing update button */
const scoreboardUpdated = async () => {
    changeUpdateText("UPDATED!", "--bg3_happy");

    await new Promise(resolve => setTimeout(resolve, 400));

    changeUpdateText("UPDATE");
};


/** Generates an object with game data, then sends it */
export async function writeScoreboard() {

    // if this is a remote browser, display some visual feedback
    if (!inside.electron) {
        changeUpdateText("SENDING DATA...");
        updateRegion.removeEventListener("click", writeScoreboard);
    }

    // this is what's going to be sent to the browsers
    const scoreboardJson = {
        player: [], // more lines will be added below
        teamName: [
            teams[0].getName(),
            teams[1].getName()
        ],
        color: currentColors,
        score: [
            scores[0].getScore(),
            scores[1].getScore()
        ],
        wl: [
            wl.getLeft(),
            wl.getRight(),
        ],
        bestOf: bestOf.getBo(),
        gamemode: gamemode.getGm(),
        round: round.getText(),
        tournamentName: tournament.getText(),
        caster: [],
        socialNames: ["twitch", "yt", "twitter", "bsky", "masto", "cohost"],
        allowIntro: settings.isIntroChecked(),
        // this is just for remote updating
        altSkin: settings.isAltArtChecked(),
        customRound: settings.isCustomRoundChecked(),
        forceHD: settings.isHDChecked(),
        noLoAHD: settings.isNoLoAChecked(),
        workshop: settings.isWsChecked(),
        forceWL: settings.isForceWLChecked(),
        roundIndex: round.getIndex(),
        roundNumber: round.getNumber(),
        id : "gameData"
    };

    //add the player's info to the player section of the json
    const playerNum = gamemode.getGm() === 1 ? 2 : 4; // add only 2 players if singles
    for (let i = 0; i < playerNum; i++) {

        // finally, add it to the main json
        scoreboardJson.player.push({
            pronouns: players[i].pronouns,
            tag: players[i].tag,
            name: players[i].getName(),
            socials: players[i].getSocials(),
            sc : {
                charImg: players[i].scBrowserSrc || players[i].scSrc,
                charPos: players[i].getScCharPos(),
            },
            vs : {
                charImg: players[i].vsBrowserSrc || players[i].vsSrc,
                charPos: players[i].getVsCharPos(),
                trailImg: players[i].trailSrc,
                bgVid: players[i].vsBgSrc,
                skin: players[i].vsSkin.name
            },
            // these are just for remote updating
            char: players[i].char,
            skin: players[i].skin.name,
            skinHex: players[i].skinHex,
            customImg: players[i].customImg
        })

    }

    // stuff that needs to be done for both sides
    for (let i = 0; i < 2; i++) {
        // if the team inputs dont have anything, display as [Color Team]
        if (!teams[i].getName()) {
            scoreboardJson.teamName[i] = `${currentColors[i].name} Team`
        }
    }

    // do the same for the casters
    for (let i = 0; i < casters.length; i++) {
        scoreboardJson.caster.push({
            name: casters[i].getName(),
            pronouns : casters[i].getPronouns(),
            tag : casters[i].getTag(),
            socials : casters[i].getSocials()
        })
    }

    // its time to send the data away
    if (inside.electron) {

        const ipc = await import("./IPC.mjs");
        ipc.updateGameData(JSON.stringify(scoreboardJson, null, 2));
        ipc.sendGameData();
        ipc.sendRemoteGameData();

        //simple .txt files
        if (settings.isSimpleTextsChecked()) {
            saveSimpleTexts();
        }

    } else { // remote update stuff

        const remote = await import("./Remote Requests.mjs");
        scoreboardJson.id = "";
        scoreboardJson.message = "RemoteUpdateGUI";
        remote.sendRemoteData(scoreboardJson);

    }

    if (!firstTimeUpdating) {
        await scoreboardUpdated();
    } else {
        firstTimeUpdating = false;
    }

}