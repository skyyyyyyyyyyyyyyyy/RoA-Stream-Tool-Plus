import { characterCodeToName, skinCodeToName } from "./Character Codes.mjs";

/**
 * Reads a .roa replay file and parses its contents
 * @param {String} file - The big ass replay file
 * @returns Replay data object
 */
export function readReplayFile(file) {

    const replayData = {};

    // get an array with each line
    const fileLines = file.split("\n");
    let playerCount = 0;
   
    // read each line individually
    for (let i = 0; i < fileLines.length; i++) {
        
        // avoid game info lines - we don't need those
        if (i > 1) {

            // we now need to identify how many players we have
            if (fileLines[i].length == 169 || fileLines[i].length == 170) {
                playerCount++;
            }

        }
        
    }

    replayData.player = [];
    let curLine = 2;

    // for each player
    for (let i = 0; i < playerCount; i++) {

        
        // create a player object
        const player = {};
        

        // steam username
        const username = fileLines[i + curLine].substring(1, 33).trimEnd();
        // player tag
        const tag = fileLines[i + curLine].substring(33, 39).trimEnd();

        // final player string
        player.username = username;

        // if username is too long, RoA adds an ellipsis to the end
        // i don't like it, so i'm removing it :p
        if (username.slice(-3) === "...") {
            player.username = player.username.slice(0, -3);
        }

        // identify if this is a workshop character
        const isWorkshop = fileLines[i + curLine + 1].length == 19 ? true : false;

        // character
        const charSlot = fileLines[i + curLine].substring(39, 42);
        if (isWorkshop) {
            player.character = "Workshop Character"
            player.charImg = "/images/Icons/Workshop.png";
        } else {
            player.character = characterCodeToName(charSlot);
            player.characterCode = Number(charSlot);
            player.charImg = "/images/Characters/" + player.character + ".png";
        
            
            // skin stuff            
            const skinSlot = fileLines[i + curLine].substring(42, 44);
            player.skin = skinCodeToName(charSlot, skinSlot);
            player.skin = skinCodeToName(charSlot, skinSlot);

            // taunt slot, for custom customs
            const tauntCode = fileLines[i + curLine].substring(44, 46);
            player.tauntCode = tauntCode;
            player.taunt = skinCodeToName(charSlot, tauntCode);
        
            // skin color code!
            const skinCode = fileLines[i + curLine].substring(56, 106).trimEnd();
            // add in the "-"'s in the code
            player.skinCode = skinCode.match(/.{1,4}/g).join("-");
        }
        

        // win count
        player.wins = fileLines[i + curLine].substring(127, 129).trimStart();


        // add player to the final object
        replayData.player.push(player);


        // next player will be 2 lines below, or 3 lines if player is workshop
        
        curLine += isWorkshop ? 2 : 1;

    }

    return replayData;

}

