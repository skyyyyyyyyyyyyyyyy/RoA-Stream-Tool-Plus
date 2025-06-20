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
    <div id="pluginSettingsList" class="scroll-shadows"></div>
    
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

/* taken from https://css-tricks.com/books/greatest-css-tricks/scroll-shadows/ */
.scroll-shadows {
  max-height: 200px;
  overflow: auto;

  background:
    /* Shadow Cover TOP */
    linear-gradient(
      var(--bg3) 30%,
      rgba(255, 255, 255, 0)
    ) center top,
    
    /* Shadow Cover BOTTOM */
    linear-gradient(
      rgba(255, 255, 255, 0), 
      var(--bg3) 70%
    ) center bottom,
    
    /* Shadow TOP */
    radial-gradient(
      farthest-side at 50% 20%,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ) center top,
    
    /* Shadow BOTTOM */
    radial-gradient(
      farthest-side at 50% 80%,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0)
    ) center bottom;
  
  background-repeat: no-repeat;
  background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
  background-attachment: local, local, scroll, scroll;
}`;

/**
 * Generates the HTML for a plugin list button.
 * @param {string} pluginName - The name of the plugin.
 * @returns {string} The HTML string for the button.
 */
function pluginListButton(pluginName) {
    return `
    <li>
        <button id="${pluginName}" class="pluginButton">
            <span>${pluginName}</span>
        </button>
    </li>
    `;
}

/**
 * Generates the HTML for a plugin setting checkbox.
 * @param {string} pluginSetting - The name of the setting.
 * @param {boolean} checked - Whether the checkbox is checked.
 * @returns {string} The HTML string for the checkbox.
 */
function pluginSettingCheckbox(pluginSetting, checked) {
    return `
    <div class="settingBox">
      <input type="checkbox" id="${pluginSetting}" class="settingsCheck" tabindex="-1" ${checked ? "checked" : ""}>
      <label for="${pluginSetting}" class="settingsText">${pluginSetting}</span>
    </div>
    `;
}

/**
 * Generates an error message for a missing file.
 * @param {string} filename - The name of the missing file.
 * @returns {string} The HTML string for the error message.
 */
function fileNotFoundErrorText(filename) {
    return `<div id="pluginErrorContainer"><p>${filename} was not found for this plugin!</p>
            <p>Please create a ${filename} file in the root directory of your plugin.</p></div>`
}

/**
 * Loads the list of plugins and adds them to the plugin list in the GUI.
 */
async function loadPlugins() {
    const pluginNames = await getPluginList();
    for (const pluginName in pluginNames) {
        document.getElementById("pluginsList").insertAdjacentHTML("beforeend", pluginListButton(pluginName));
        document.getElementById(pluginName).addEventListener("click", () => onPluginButtonClicked(pluginName, pluginNames[pluginName]));
    }
}

/**
 * Highlights the selected plugin button and loads its settings.
 * @param {string} pluginName - The name of the clicked plugin.
 * @param {boolean} mjsFound - Whether the plugin has a valid mjs file.
 */
async function onPluginButtonClicked(pluginName, mjsFound) {
    for (const buttonListElement of document.getElementById("pluginsList").children) {
        const button = buttonListElement.children.item(0);
        button.style.backgroundColor = (pluginName !== button.id) ? "" : "var(--focused)";
    }
    loadPluginSettings(pluginName, mjsFound);
}

/**
 * Displays a plugin's settings in the GUI.
 * @param {string} pluginName - The name of the plugin.
 * @param {boolean} mjsFound - Whether the plugin has a valid mjs file.
 */
async function loadPluginSettings(pluginName, mjsFound) {
    document.getElementById("pluginSettingsList").replaceChildren();

    const settings = await getPluginSettings(pluginName);

    if (!mjsFound) {
        document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", fileNotFoundErrorText(pluginName + ".mjs"));
    } else if (settings == null) {
        document.getElementById("pluginSettingsList").insertAdjacentHTML("beforeend", fileNotFoundErrorText("Settings.json"));
    } else {
        createPluginSettingsList(pluginName, settings);
    }
}

/**
 * Creates the settings list for a plugin and adds it to the GUI.
 * @param {string} pluginName - The name of the plugin.
 * @param {Object} settings - The settings object for the plugin.
 */
function createPluginSettingsList(pluginName, settings) {

    // add "Enabled" setting, if the settings object doesn't already have it
    if (!Object.hasOwn(settings, "Enabled")) {
        settings["Enabled"] = true;
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

/**
 * Toggles the "Enabled" setting for a plugin and updates the GUI.
 * @param {string} pluginName - The name of the plugin.
 * @param {Object} settings - The settings object for the plugin.
 */
async function togglePluginEnabled(pluginName, settings) {
    settings["Enabled"] = !settings["Enabled"];
    for (const setting in settings) {
        if (setting !== "_info" && setting !== "Enabled") {
            document.getElementById(setting).disabled = !settings["Enabled"];
        }
    }
    await savePluginSettings(pluginName, "Enabled", settings["Enabled"]);
}

/**
 * Toggles a specific setting for a plugin and saves the change.
 * @param {string} pluginName - The name of the plugin.
 * @param {string} setting - The name of the setting to toggle.
 */
async function togglePluginSetting(pluginName, setting) {
    // i think this should depend on what setting is being toggled?
    // not sure how to implement actually invoking the effect of a setting toggle yet
    const checkbox = document.getElementById(setting);
    await savePluginSettings(pluginName, setting, checkbox.checked);
}

/**
 * Saves a plugin's settings to its JSON file.
 * @param {string} pluginName - The name of the plugin.
 * @param {string} setting - The name of the setting to save.
 * @param {any} value - The value of the setting to save.
 */
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

/**
 * Instantiates a settings object for a plugin.
 * @param {string} pluginName - The name of the plugin.
 * @returns {Object} The settings object for the plugin.
 */
export async function getPluginSettings(pluginName) {
    return await getJson(`${stPath.scripts}/GUI Plugins/${pluginName}/Settings`);
}

/**
 * Initializes the plugin settings module by adding the plugin button and settings window to the GUI.
 */
async function init() {
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
}


init();