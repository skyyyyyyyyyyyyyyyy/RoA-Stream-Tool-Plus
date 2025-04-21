import { fadeIn } from "../Utils/Fade In.mjs";
import { fadeOut } from "../Utils/Fade Out.mjs";
import { genRnd } from "../Utils/Gen Random Num.mjs";
import { current } from "../Utils/Globals.mjs";
import { players } from "./Player/Players.mjs";
import { fadeInTimeVs, fadeOutTimeVs, introDelayVs } from "./VsGlobals.mjs";

const introTop = document.getElementById("introTop");
const introBot = document.getElementById("introBot");
const foreGround = document.getElementById("foreGround");
const foreGroundO = document.getElementById("foreGroundOmega");
const bgVid = document.getElementById("bgVid");

let isAllowed = false;
let data;

let gameCount;

class VsIntro {

    isAllowed() {
        return isAllowed;
    }

    /**
     * Updates data used in the scoreboard intro
     * @param {Object} incData - All of the scoreboard data
     */
    updateData(incData) {

        // this will notify to the outside that we're doing the intro
        isAllowed = true;

        data = incData

    }

    /** Plays a cool and sexy intro that covers the entire screen */
    play() {

		if (data.round == "Grand Finals" || data.round == "True Finals") {

			bgVid.src = "Resources/Overlay/VS Screen/BG Omega.mp4";
			foreGround.style.display = "none";
			foreGroundO.style.display = "block";

		} else {
			if (data.round == "Winners Semis" || data.round == "Losers Top 8") {
				foreGround.src = "Resources/Overlay/VS Screen/FG 1.png"
			} else if (data.round == "Losers Quarters" || data.round == "Winners Finals") {
				foreGround.src = "Resources/Overlay/VS Screen/FG 2.png"
			} else if (data.round == "Losers Finals" || data.round == "Losers Semis") {
				foreGround.src = "Resources/Overlay/VS Screen/FG 3.png"
			} else {
				foreGround.src = "Resources/Overlay/VS Screen/FG 0.png"
			}
			/* bgVid.src = "Resources/Overlay/VS Screen/BG.mp4"; */
			foreGround.style.display = "block";
			foreGroundO.style.display = "none";
		}        

        gameCount = data.score[0] + data.score[1];

		if (gameCount == 0) {

			document.getElementById("introducing").style.opacity = "1";

			const introQuips = [
				"Get ready!",
				"Introducing...",
				"Can't escape from crossing fate",
				"Fight Goes On",
				"Fight on!",
				"Next Up",
				"It's happening",
				"LET'S DANCE",
				"Let's Rock",
				"GET READY TO RUMBLE",
				"Coming up...",
				"A rivalry is surely brewing",
				"New challengers approaching...",
				"Let's gooooooooooooooooooooo",
				"Heaven or hell",
				"Get ready for the next battle!",
				"It's showtime!",
				"Into the heat of battle",
				"Top 10 best anime fights"
			];

			let quipRate = 2;

			if (data.round.toLocaleUpperCase().includes("WINNERS")) {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Upper bracket rivals",
						"Only one can keep winning",
					)
				}
			}

			if (data.round.toLocaleUpperCase().includes("LOSERS")) {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Their last chance",
						"No room for errors",
						"Do or die",
						"Lower Bracket Rivals",
						"Only one will advance",
						"One of them will go home",
						"It's all or nothing",
					)
				}
			}

			quipRate = 5;

			if (data.player[0].char == "Absa" || data.player[1].char == "Absa") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Thunder and Lightning",
					)
				}
			}
			if (data.player[0].char == "Clairen" || data.player[1].char == "Clairen") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"With yet another swordfighter",
					)
				}
			}
			if (data.player[0].char == "Elliana" || data.player[1].char == "Elliana") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Pierce the heavens!",
					)
				}
			}
			if (data.player[0].char == "Etalus" || data.player[1].char == "Etalus") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Winter is coming",
						"Cold as ice",
					)
				}
			}
			/* if (data.player[0].char == "Forsburn" || data.player[1].char == "Forsburn") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"",
					)
				}
			} */
			/* if (data.player[0].char == "Hodan" || data.player[1].char == "Hodan") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"",
					)
				}
			} */
			if (data.player[0].char == "Kragg" || data.player[1].char == "Kragg") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Between a rock and a hard place",
						"FAir and square"
					)
				}
			}
			if (data.player[0].char == "Maypul" || data.player[1].char == "Maypul") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Time to wrap it up",
					)
				}
			}if (data.player[0].char == "Mollo" || data.player[1].char == "Mollo") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Let the fireworks begin!",
					)
				}
			}
			if (data.player[0].char == "Olympia" || data.player[1].char == "Olympia") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Crystal clear",
					)
				}
			}
			if (data.player[0].char == "Orcane" || data.player[1].char == "Orcane") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Stay Hydrated",
					)
				}
			}
			if (data.player[0].char == "Ori and Sein" || data.player[1].char == "Ori and Sein") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Uair is not a killmove",
					)
				}
			}
			if (data.player[0].char == "Pomme" || data.player[1].char == "Pomme") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"*mic drop*",
					)
				}
			}
			/* if (data.player[0].char == "Ranno" || data.player[1].char == "Ranno") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"",
					)
				}
			} */
			if (data.player[0].char == "Shovel Knight" || data.player[1].char == "Shovel Knight") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Strike the earth!",
						"Sharpen Thy Shovel",
					)
				}
			}
			/* if (data.player[0].char == "Sylvanos" || data.player[1].char == "Sylvanos") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"",
					)
				for (let i = 0; i < quipRate; i++) {
			} */
			if (data.player[0].char == "Wrastor" || data.player[1].char == "Wrastor") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"That ain't Falco",
						"Fly High",
					)
				}
			}
			if (data.player[0].char == "Zetterburn" || data.player[1].char == "Zetterburn") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Through the fire and flames",
						"Turning up the heat",
					)
				}
			}

			if ((data.player[0].char == "Zetterburn" || data.player[1].char == "Zetterburn")
				&& (data.player[0].char == "Etalus" || data.player[1].char == "Etalus")) {
				for (let i = 0; i < quipRate; i++) {
						introQuips.push(
						"A Song of Ice and Fire",
					)
				}
			}

			if (data.player[0].char == data.player[1].char) {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"An even matchup",
					)
				}
			}

			quipRate = 15;

			if (data.player[0].name == "Fireicey" || data.player[1].name == "Fireicey") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"The northern lion appears",
					)
				}
			}

			if (data.player[0].name == "OliveOily" || data.player[1].name == "OliveOily") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Perish",
					)
				}
			}

			if (data.player[0].name == "Kerus" || data.player[1].name == "Kerus") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"¡VAMOS!",
					)
				}
			}

			if (data.player[0].name == "Slimepuffen" || data.player[1].name == "Slimepuffen") {
				for (let i = 0; i < quipRate; i++) {
					introQuips.push(
						"Have you heard of the critically acclaimed MMORPG\nFinal Fantasy XIV? With an expanded\nfree trial which you can play\nthrough the entirety of A Realm Reborn\nand the award winning Heavensward expansion\nup to level 60 for free with\nno restrictions on playtime",
					)
				}
			}

			document.getElementById("middleDivs").style.animation = "";
			document.getElementById("middleDivs").style.opacity = 0;
			
			introBot.innerText = data.round;
			if (data.round.toUpperCase() == "Grand Finals".toUpperCase()) {
				introTop.innerText = "The final battle";
			} else if (data.round.toUpperCase() == "True Finals".toUpperCase()) {
				introTop.innerText = "It all ends here";
			} else {
				introTop.innerText = introQuips[genRnd(0, introQuips.length - 1)];
				/* introTop.innerText = "It all starts here"; */
			}

			let finalDelay = introDelayVs;

			if (data.round == "Grand Finals") {

				fadeIn(document.getElementById("introTexts"), fadeInTimeVs, 3.3)
			
				setTimeout(() => {

					document.getElementById("everything").style.animation = "moveEverythingSerious 6s";

					document.getElementById("charas").style.animation = "charaMoveSerious 2s";

					document.getElementById("imTired").style.animation = "animsSerious 1.5s 2.5s both";
					document.getElementById("imExtraTired").style.animation = "animsSerious 1.5s 2.5s both";

					setTimeout(() => {
						document.getElementById("seriousAudio").play();
					}, 3300);

				}, finalDelay*1000);

				finalDelay = finalDelay + 3

			} else {

				document.getElementById("everything").style.animation = "moveEverything 3s";

				document.getElementById("whoosh").play();

				document.getElementById("charas").style.animation = "";

				document.getElementById("imTired").style.animation = "";
				document.getElementById("imExtraTired").style.animation = "";
				
			}

			setTimeout(() => {
				introTop.classList.add("animTop");
				introBot.classList.add("animBot");
			}, finalDelay*1000);

			setTimeout(() => {
				players.player(0).char().clearAnimTimeout();
				players.player(0).char().toggleTaunt();
                players.player(0).char().setRndTaunt();
				players.player(1).char().clearAnimTimeout();
				players.player(1).char().toggleTaunt();
                players.player(1).char().setRndTaunt();
			}, finalDelay*1000+1000);

			setTimeout(() => {
				fadeIn(document.getElementById("middleDivs"), fadeInTimeVs);
				fadeOut(document.getElementById("introducing"), fadeOutTimeVs);
			}, finalDelay*1000+2750);

			current.delay = finalDelay + 2.55;

		} else {
			current.delay = introDelayVs;
		}

    }

    /** Resets all animation states for intro elements */
    reset() {

        // only do this if intro toggle is active
        if (this.isAllowed()) {

			introTop.classList.remove("animTop");
			introBot.classList.remove("animBot");
			document.getElementById("introducing").style.animation = "";
			document.getElementById("everything").style.animation = "";
			document.getElementById("introducing").style.opacity = "0";

			document.getElementById("charas").style.animation = "";
			document.getElementById("imTired").style.animation = "";
			document.getElementById("imExtraTired").style.animation = "";

			document.getElementById("introTexts").style.animation = "";

			document.getElementById("seriousAudio").pause();
			document.getElementById("seriousAudio").currentTime = 0;

        }

    }

	getGameCount() {
		return gameCount;
	}

}

export const vsIntro = new VsIntro;