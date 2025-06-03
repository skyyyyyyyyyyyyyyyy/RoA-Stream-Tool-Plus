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

@media (max-width: 590px) {
    #pluginsRegion {
        width: 50px;
    }
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
   
    <!--    will be populated by addPluginListButtons     -->
    <ul id="pluginsList"></ul>
    
    <!--    will be populated by onPluginButtonClicked     -->
    <div id="pluginSettingsList"></div>
    
    <button id="pluginsGoBack" class="pInfoBotButt">
        <div class="pInfoIconCont">
            <load-svg src="SVGs/Check.svg" class="pInfoIcon"></load-svg>
        </div>
        <span>Go back</span>
    </button>
</div>
`;

const pluginSettingsCSS = `
#pluginSettings {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translateY(100%);
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 3fr 1fr;
  justify-content: center;
  align-items: center;
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
  grid-row: 1;
  grid-column: 2;
  width: fit-content;
  justify-self: center;
  align-self: end;
}

#pluginsList {
    list-style-type: none;
    padding-inline-start: 0px;
    margin-block-start: 0px;
    margin-block-end: 0px;
    width: 200px;
    justify-self: center;
    max-height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    grid-column: 1;
    grid-row: 1 / span 3;
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
    width: 80%;
    height: 80%;
    justify-self: center;
    overflow: hidden;
    overflow-y: scroll;
    background-color: var(--bg3);
    border-style: outset;
    grid-column: 2;
    grid-row: 2;
}

#pluginErrorContainer {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 15px;
}

#pluginErrorContainer p {
    margin-block: 0;
}

#pluginsGoBack {
  grid-column: 1 / span 2;
  grid-row: 3;
  justify-self: center;
  align-self: center;
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


function fileNotFoundErrorText(filename) {
    return `<div id="pluginErrorContainer"><p>${filename} was not found for this plugin!</p>
            <p>Please create a ${filename} file in the root directory of your plugin.</p></div>`
}

async function loadPlugins() {
    const pluginNames = await getPluginList();
    for (let i = 0; i < pluginNames.length; i++) {
        document.getElementById("pluginsList").insertAdjacentHTML("beforeend", pluginListButton(pluginNames[i]));
        document.getElementById(pluginNames[i]).addEventListener("click", () => onPluginButtonClicked(pluginNames[i]));
    }
}

async function onPluginButtonClicked(pluginName) {

    for (const buttonListElement of document.getElementById("pluginsList").children) {
        const button = buttonListElement.children.item(0);
        button.style.backgroundColor = (pluginName !== button.id) ? "" : "var(--focused)";
    }
    loadPluginSettings(pluginName);
}

async function loadPluginSettings(pluginName) {
    document.getElementById("pluginSettingsList").replaceChildren();

    const settings = await getPluginSettings(pluginName);

    if (settings !== null) {

        createPluginSettingsList(pluginName, settings);

    } else {
        document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", fileNotFoundErrorText("Settings.json"));
    }
}


function createPluginSettingsList(pluginName, settings) {

    // add "Enabled" setting, if the settings object doesn't already have it
    if (!Object.hasOwn(settings, "Enabled")) {
        settings["Enabled"] = true;
    }

    // check if {pluginName}.mjs exists, display error if not
    // is it inefficient to keep re-checking the file path every time the button is clicked?
    // could alternatively store the active plugins in an array and look that up instead, or something like that...
    const fs = require('fs');
    const innerFiles = fs.readdirSync(`${stPath.scripts}/GUI Plugins/${pluginName}`);
    if (!innerFiles.includes(`${pluginName}.mjs`)) {
        document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", fileNotFoundErrorText(`${pluginName}.mjs`));
        return;
    }

    // add enabled setting, info text, and rectangle separator to GUI
    document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend",
        pluginSettingCheckbox("Enabled", settings["Enabled"])
        + (Object.hasOwn(settings, "_info") ? `<p style="font-style: italic;" ">${settings["_info"]}</p>` : "")
        + `<div class="rectangle" style="margin: 10px auto"></div>`);
    document.getElementById("Enabled").addEventListener("click", () => togglePluginEnabled(pluginName, settings));

    // populate settings list
    for (const setting in settings) {
        if (setting !== "_info" && setting !== "Enabled") {
            document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", pluginSettingCheckbox(setting, settings[setting]));
            document.getElementById(setting).addEventListener("click", () => togglePluginSetting(pluginName, setting));
            document.getElementById(setting).disabled = !settings["Enabled"];
        }
    }
}

async function togglePluginEnabled(pluginName, settings) {
    settings["Enabled"] = !settings["Enabled"];
    for (const setting in settings) {
        if (setting !== "_info" && setting !== "Enabled") {
            document.getElementById(setting).disabled = !settings["Enabled"];
        }
    }
    await savePluginSettings(pluginName, "Enabled", settings["Enabled"]);
}

async function togglePluginSetting(pluginName, setting) {
    // i think this should depend on what setting is being toggled?
    // not sure how to implement actually invoking the effect of a setting toggle yet
    const checkbox = document.getElementById(setting);
    await savePluginSettings(pluginName, setting, checkbox.checked);
}

async function savePluginSettings(pluginName, setting, value) {
    if (inside.electron) {
        // read the file
        const settings = await getPluginSettings(pluginName);

        // update the setting's value
        settings[setting] = value;

        // save the file (cursed reuse of saveJson by immediately escaping the Texts folder)
        saveJson(`/../Scripts/GUI Plugins/${pluginName}/Settings`, settings);
    }
}

export async function getPluginSettings(pluginName) {
    return await getJson(`${stPath.scripts}/GUI Plugins/${pluginName}/Settings`);
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

document.getElementById("pluginsGoBack").addEventListener("click", () => {viewport.toCenter()});
