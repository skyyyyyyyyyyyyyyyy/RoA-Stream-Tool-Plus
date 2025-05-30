import {stPath} from "../../GUI/Globals.mjs";
import {viewport} from "../../GUI/Viewport.mjs";
import {displayNotif} from "../../GUI/Notifications.mjs";

const pluginButtonHTML = `
<button id="pluginsRegion" class="botRegion" title="Go to plugin settings">
  <load-svg src="${stPath.scripts}/GUI Plugins/Plugin Settings/Plugins.svg" id="pluginsIcon"></load-svg>
</button>
`

const pluginButtonCSS = `
#pluginsRegion {
  width: 32px;
  background-color: var(--bg3);
}

#pluginsRegion:hover {
  background-color: var(--bg1);
  cursor: pointer;
}

#pluginsRegion:active {
  background-color: var(--bg5);
}

#pluginsIcon {
  width: 24px;
  height: 24px;
  color: var(--text2);
}
`

const pluginSettingsHTML = `
<div id="pluginSettings">
    <div id="pluginSettingsTitle">Plugin Settings</div>
    
    <div id="pluginSettingsContent">
        <ul id="pluginsList">
            <li>
                <button id="pluginButton1" class="pluginButton">
                    <span>Plugin 1</span>
                </button>
            </li>
            <li>
                <button id="pluginButton2" class="pluginButton">
                    <span>Plugin 2</span>
                </button>
            </li>
            <li>
                <button id="pluginButton3" class="pluginButton">
                    <span>Plugin 3</span>
                </button>
            </li>
            <li>
                <button id="pluginButton4" class="pluginButton">
                    <span>Plugin 4</span>
                </button>
            </li>
            <li>
                <button id="pluginButton5" class="pluginButton">
                    <span>Plugin 5</span>
                </button>
            </li>
            <li>
                <button id="pluginButton6" class="pluginButton">
                    <span>Plugin 6</span>
                </button>
            </li>
        </ul>
                    
        <div id="pluginSettingsList">
            <div class="settingsTitle">Scoreboard</div>
            
            <div class="settingBox" title="Plays an intro on 'RoA Scoreboard.html' whenever the file loads.">
              <input type="checkbox" id="allowIntro" class="settingsCheck" tabindex="-1">
              <label for="allowIntro" class="settingsText">Allow Intro</span>
            </div>
            
            <div class="settingBox" title="Uses alternative art for workshop characters that have one.">
              <input type="checkbox" id="forceAlt" class="settingsCheck" disabled tabindex="-1">
              <label for="forceAlt" id="mmText" class="settingsText">Use 'Alt' skins</span>
            </div>
        </div>
    </div>
    
    <div id="pBotButts">
      <button id="pluginsGoBack" class="pInfoBotButt">
        <div class="pInfoIconCont">
          <load-svg src="SVGs/Close.svg" class="pInfoIcon"></load-svg>
        </div>
        <span>Go back</span>
      </button>
      <button id="pluginsApplyChanges" class="pInfoBotButt">
        <div class="pInfoIconCont">
          <load-svg src="SVGs/Check.svg" class="pInfoIcon"></load-svg>
        </div>
        <span>Apply changes</span>
      </button>
    </div>
</div>
`

const pluginSettingsCSS = `
#pluginSettings {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  background-color: var(--bg5);
  overflow: hidden;
}

#pluginSettingsTitle {
  font-family: "Roboto-Medium";
  font-size: 18px;
  border-bottom: solid 1px var(--text2);
  padding-top: 15px;
  text-transform: uppercase;
}

#pluginSettingsContent {
    min-height: 50px;
    max-height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-block-start: 1%;
    margin-block-end: 1%;
}

#pluginsList {
    list-style-type: none;
    width: 200px;
    overflow: hidden;
    overflow-y: scroll;
    padding-inline-start: 0px;
    margin-left: 10%;
    margin-block-start: 0px;
    margin-block-end: 0px;
}

#pluginsList li:nth-child(odd) {
    background-color: var(--bg2);
}

#pluginsList::-webkit-scrollbar-track {
  background: var(--bg3);
}

.pluginButton {
    width: 100%;
    height: 40px;
}

#pluginSettingsList {
    margin: 0px auto;
}


#pBotButts {
  display: flex;
  gap: 10px;
  padding-bottom: 15px;
}
`

// importing plugins button to bottom bar
document.getElementById('updateRegion').insertAdjacentHTML("afterend", pluginButtonHTML);

const uploadButtonCSSElement = document.createElement("style");
uploadButtonCSSElement.textContent = pluginButtonCSS;
document.head.appendChild(uploadButtonCSSElement);

document.getElementById("pluginsRegion").addEventListener("click", () => {viewport.toPlugins()});

// importing plugin settings window
document.getElementById("bracket").insertAdjacentHTML("afterend", pluginSettingsHTML);

const pluginSettingsCSSElement = document.createElement("style");
pluginSettingsCSSElement.textContent = pluginSettingsCSS;
document.head.appendChild(pluginSettingsCSSElement)

document.getElementById("pluginsGoBack").addEventListener("click", () => {viewport.toCenter()});
document.getElementById("pluginsApplyChanges").addEventListener("click", () => {displayNotif("Changes applied! (not really)")});
