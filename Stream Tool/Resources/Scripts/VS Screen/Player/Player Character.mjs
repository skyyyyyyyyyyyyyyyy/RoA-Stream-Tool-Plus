import { charaFadeIn, fadeIn, fadeInMove } from "../../Utils/Fade In.mjs";
import { charaFadeOut, fadeOut, fadeOutMove } from "../../Utils/Fade Out.mjs";
import { genRnd } from "../../Utils/Gen Random Num.mjs";
import { current } from "../../Utils/Globals.mjs";
import { vsIntro } from "../Intro.mjs";
import { fadeInTimeVs, fadeOutTimeVs, introDelayVs } from "../VsGlobals.mjs";

export class PlayerCharacter {

    #charSrc = "";
    #trailSrc = "";
    #bgSrc = "";

    #charEl;
    #trailEl;
    #charDiv;
    #bgEl;

    #charIcon;

    #animImg;
    #idleImg;
    #tauntImg;

    #tauntTimeout;

    /**
     * Controls the player's character, trail and bg video
     * @param {HTMLElement} charEl - Elemeent containing character image
     * @param {HTMLElement} trailEl - Element containing trail image
     * @param {HTMLElement} bgEl - Element containing background video
     * @param {Number} id - Player slot
     */
    constructor(charEl, trailEl, charIcon, charAnim, id) {

        this.#charEl = charEl;
        this.#trailEl = trailEl;

        // to animate both char and trail at once
        this.#charDiv = charEl.parentElement;

        this.#charIcon = charIcon;
        this.#animImg = charAnim;

        this.id = id;

    }

     /**
     * Updates all player's character elements
     * @param {Object} vsData - Data for the VS Screen
     * @returns {Promise <() => void>} Promise with fade in animation function
     */
    update(vsData) {

        // update that character
        return this.#updateChar(vsData);

    }

    /**
     * Updates character and trail images
     * @param {Object} vsData - Data for the VS Screen
     * @returns {Promise <() => void>} Promise with fade in animation function
     */
    async #updateChar(fullData) {

        const data = fullData.vs;

        // if that character image is not the same as the local one
        if (this.#charSrc != data.charImg || this.#trailSrc != data.trailImg) {

            const startupBois = current.startup;

            this.#charIcon.src = fullData.iconImg;
            this.idleFC = fullData.idleFC;
            this.idleY = fullData.idleY;
            this.idleS = fullData.idleS;
            this.tauntFC = fullData.tauntFC;
            this.tauntY = fullData.tauntY;
            this.tauntS = fullData.tauntS;

            // calculate delay for the final fade in
            const fadeInDelay = current.startup ? current.delay : 0;
            const fadeAnimDelay = current.startup ? introDelayVs : 0;

            // remember the change
            this.#charSrc = data.charImg;
            this.#trailSrc = data.trailImg;
            
            // dont do this if loading
            if (!current.startup) {
                clearTimeout(this.#tauntTimeout);
                fadeOutMove(this.#animImg.parentElement.parentElement.parentElement, null, false);
                await charaFadeOut(this.#charDiv, this.#trailEl, fadeOutTimeVs);
            }


            await this.loadAnims(fullData.idleImg, fullData.tauntImg)
            this.updateAnim();


            // update those images
            this.#charEl.src = data.charImg;
            this.#trailEl.src = data.trailImg;

            // position the character
            const pos = data.charPos;

            /* pos[0] += -50;
            pos[1] += -50; */

            this.#charEl.style.transform = `translate(${pos[0]}px, ${pos[1]}px) scale(${pos[2]})`;
            this.#trailEl.style.transform = `translate(${pos[0]}px, ${pos[1]}px) scale(${pos[2]})`;

            // since most images are large pixel arts, only do regular
            // rendering if skin name includes "HD" on it
            if (data.skin.includes("HD")) {
                this.#charEl.style.imageRendering = "auto"; // default scalling
                this.#trailEl.style.imageRendering = "auto";
            } else {
                this.#charEl.style.imageRendering = "pixelated"; // pixel art scalling
                this.#trailEl.style.imageRendering = "pixelated";
            }

            // here we will store promises to use later
            const charsLoaded = [];
            // this will make the thing wait till the images are fully loaded
            charsLoaded.push(this.#charEl.decode(),
                this.#trailEl.decode().catch( () => {} ) // if no trail, do nothing
            );
            // this function will send a promise when the images finish loading
            await Promise.all(charsLoaded);

            // return the fade in animation, to be used when rest of players load
            return () => this.fadeInChar(fadeInDelay, startupBois, fadeAnimDelay);
            
        }

    }

    /** Fade that character in, will activate from the outside */
    fadeInChar(delay, startup, fadeAnimDelay) {
        charaFadeIn(this.#charDiv, this.#trailEl, fadeInTimeVs, delay);
        fadeInMove(this.#animImg.parentElement.parentElement.parentElement, null, true % 2, fadeAnimDelay);
        
        if (!startup) {
            setTimeout(async () => {
                this.toggleTaunt();
                this.setRndTaunt();
            }, 150);
        }
    }
    
    /**
     * Adapts the character elements to singles or doubles
     * @param {Number} gamemode - New gamemode
     */
    changeGm(gamemode) {

        if (gamemode == 1) { // singles
            this.#charDiv.parentElement.classList.add("singlesClip");
            this.#charDiv.parentElement.classList.remove("dubsClip");
        } else { // doubles
            this.#charDiv.parentElement.classList.remove("singlesClip");
            this.#charDiv.parentElement.classList.add("dubsClip");
        }

    }

    /** Hides the character's images */
    hide() {
        this.#charDiv.style.display = "none";
        if (this.id < 3) {
            this.#animImg.parentElement.parentElement.parentElement.style.display = "none";
            clearTimeout(this.#tauntTimeout);
        }
        
    }

    /** Displays hidden images, fading them in */
    show() {
        charaFadeIn(this.#charDiv, this.#trailEl, fadeInTimeVs, current.delay);
        this.#charDiv.style.display = "block";

        fadeInMove(this.#animImg.parentElement.parentElement.parentElement, null, true % 2, introDelayVs);
        this.#animImg.parentElement.parentElement.parentElement.style.display = "block";

        if (vsIntro.getGameCount() != 0) {
            setTimeout(async () => {
                this.toggleTaunt();
                this.setRndTaunt();
            }, 150);
        }

    }

    async loadAnims(idle, taunt) {

        const idleImg = new Image();
        idleImg.src = idle;
        await idleImg.decode();
        this.#idleImg = idleImg;

        const tauntImg = new Image();
        tauntImg.src = taunt;
        await tauntImg.decode();
        this.#tauntImg = tauntImg;

    }

    updateAnim(whichOne) {

        this.#animImg.style.animation = `asdfdsaf`;

        const animImg = whichOne ? this.#tauntImg : this.#idleImg;
        const idleFC = whichOne ? this.tauntFC : this.idleFC;
        const speed = whichOne ? this.tauntS : this.idleS;
        const idleY = whichOne ? this.tauntY : this.idleY;

        //change the image path depending on the character and skin
        this.#animImg.src = animImg.src;

        const r = document.querySelector(':root');
        r.style.setProperty("--spriteWidth" + (this.id), animImg.width + "px");
        r.style.setProperty("--spriteCount" + (this.id), idleFC); // frame count
        // formula for this one is: 1000 is a second, then divided by 60 gets us an
        // in-game frame, then we multiply by 6 because thats the average frame
        // wait between sprite changes, and then we multiply by the character frame
        // count to know how long the animation is going to take, finally, we divide
        // by 1000 to get the value in seconds for the css variable
        r.style.setProperty("--spriteTime" + (this.id), 1000/60*speed*idleFC/1000 + "s");

        void this.#animImg.offsetHeight;

        this.#animImg.style.animation = `moveSprite${this.id} var(--spriteTime${this.id}) steps(var(--spriteCount${this.id})) infinite`;

        if (idleFC) {
            this.#animImg.parentElement.parentElement.parentElement.style.display = "flex";
        } else {
            this.#animImg.parentElement.parentElement.parentElement.style.display = "none";
        }

        this.#animImg.parentElement.style.transform = `translateY(${idleY*2}px)`;

    }

    toggleTaunt() {
        let iteration = 0;
        this.updateAnim(true);
        this.#animImg.onanimationiteration = async () => {
            iteration++;
            if (iteration == 1) {
                this.updateAnim()
            }
            this.#animImg.onanimationiteration = null;
        }
    }

    setRndTaunt() {
        this.#tauntTimeout = setTimeout(() => {
            this.toggleTaunt();
            this.setRndTaunt();
        }, genRnd(5, 15)*1000);
    }

    clearAnimTimeout() {
        clearTimeout(this.#tauntTimeout);
    }

}