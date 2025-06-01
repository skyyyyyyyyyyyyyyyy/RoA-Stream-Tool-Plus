import {inside, stPath} from "../../GUI/Globals.mjs";
import {viewport} from "../../GUI/Viewport.mjs";
import {getJson, getPluginList, saveJson} from "../../GUI/File System.mjs";

const pluginButtonHTML = `
<button id="pluginsRegion" class="botRegion" title="Go to plugin settings">
  <load-svg src="${stPath.scripts}/GUI Plugins/Plugin Settings/Plugins.svg" id="pluginsIcon"></load-svg>
</button>
`;

const pluginButtonCSS = `
#pluginsRegion {
  width: 32px;
  background-color: var(--bg3);
}

#pluginsRegion:hover {
  background-color: var(--bg1);
}

#pluginsRegion:active {
  background-color: var(--bg5);
}

#pluginsIcon {
  width: 24px;
  height: 24px;
  color: var(--text2);
}
`;

const pluginSettingsHTML = `
<div id="pluginSettings">
    <div id="pluginSettingsTitle">Plugin Settings</div>
    
    <div id="pluginSettingsContent">
        
        <!--    will be populated by addPluginListButtons     -->
        <ul id="pluginsList"></ul>
        
        <!--    will be populated by onPluginButtonClicked     -->
        <div id="pluginSettingsList"></div>
    </div>
    
    <div id="pBotButts">
      <button id="pluginsGoBack" class="pInfoBotButt">
        <div class="pInfoIconCont">
          <load-svg src="SVGs/Check.svg" class="pInfoIcon"></load-svg>
        </div>
        <span>Go back</span>
      </button>
    </div>
</div>
`;

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
    justify-content: center;
    margin-block-start: 1%;
    margin-block-end: 1%;
}

#pluginsList {
    list-style-type: none;
    width: 200px;
    margin: 0px auto;
    overflow: hidden;
    overflow-y: scroll;
    padding-inline-start: 0px;
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

.pluginButton:hover {
  background-color: var(--bg3);
}

.pluginButton:active {
  background-color: var(--bg4);
}

#pluginSettingsList {
    margin: 0px auto;
    padding: 10px;
    width: 55%;
    overflow: hidden;
    overflow-y: scroll;
    background-color: var(--bg3);
    border-style: outset;
}


#pBotButts {
  display: flex;
  gap: 10px;
  padding-bottom: 15px;
}
`;

function pluginListButton(pluginName) {
    return `
    <li>
        <button id="${pluginName}" class="pluginButton">
            <span>${pluginName}</span>
        </button>
    </li>
    `;
}

function pluginSettingCheckbox(pluginSetting, checked) {
    return `
    <div class="settingBox">
      <input type="checkbox" id="${pluginSetting}" class="settingsCheck" tabindex="-1" ${checked ? "checked" : ""}>
      <label for="${pluginSetting}" class="settingsText">${pluginSetting}</span>
    </div>
    `;
}

async function loadPlugins() {
    const pluginNames = await getPluginList();
    for (let i = 0; i < pluginNames.length; i++) {
        document.getElementById("pluginsList").insertAdjacentHTML("beforeend", pluginListButton(pluginNames[i]));
        document.getElementById(pluginNames[i]).addEventListener("click", () => onPluginButtonClicked(pluginNames[i]));
    }
}

async function onPluginButtonClicked(pluginID) {

    for (const buttonListElement of document.getElementById("pluginsList").children) {
        const button = buttonListElement.children.item(0);
        button.style.backgroundColor = (pluginID !== button.id) ? "" : "var(--focused)";
    }
    loadPluginSettings(pluginID);
}

async function loadPluginSettings(pluginID) {
    document.getElementById("pluginSettingsList").replaceChildren();

    const settings = await getPluginSettings(pluginID);

    if (settings !== null) {
        if (!Object.hasOwn(settings, "Enabled")) {
            settings["Enabled"] = true;
        }

        document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend",
            pluginSettingCheckbox("Enabled", settings["Enabled"])
            + (Object.hasOwn(settings, "_info") ? `<p><i>${settings["_info"]}</i></p>` : "")
            + `<div class="rectangle" style="margin: 10px auto"></div>`);

        for (const setting in settings) {
            if (setting !== "_info") {
                if (setting !== "Enabled") {
                    document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", pluginSettingCheckbox(setting, settings[setting]));
                }
                document.getElementById(setting).addEventListener("click", () => togglePluginSetting(pluginID, setting));
            }
        }
    }
}

async function togglePluginSetting(pluginID, setting) {
    // i think this should depend on what setting is being toggled?
    // not sure how to implement actually invoking the effect of a setting toggle yet
    const checkbox = document.getElementById(setting);
    await savePluginSettings(pluginID, setting, checkbox.checked);
}

async function savePluginSettings(pluginID, setting, value) {
    if (inside.electron) {
        // read the file
        const settings = await getPluginSettings(pluginID);

        // update the setting's value
        settings[setting] = value;

        // save the file (cursed reuse of saveJson by immediately escaping the Texts folder)
        saveJson(`/../Scripts/GUI Plugins/${pluginID}/Settings`, settings);
    }
}

export async function getPluginSettings(pluginID) {
    return await getJson(`${stPath.scripts}/GUI Plugins/${pluginID}/Settings`);
}

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
document.head.appendChild(pluginSettingsCSSElement);

await loadPlugins();

//FIXME this calculation does not work wtf
const pluginSettingsList = document.getElementById("pluginSettingsList");
alert((document.getElementById("pluginsList").offsetHeight - (pluginSettingsList.maxHeight - pluginSettingsList.offsetHeight)) + "px");
pluginSettingsList.style.maxHeight = (document.getElementById("pluginsList").offsetHeight - (pluginSettingsList.maxHeight - pluginSettingsList.offsetHeight)) + "px";

document.getElementById("pluginsGoBack").addEventListener("click", () => {viewport.toCenter()});
