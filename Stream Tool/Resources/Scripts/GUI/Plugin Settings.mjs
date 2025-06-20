import {inside, stPath} from "./Globals.mjs";
import {viewport} from "./Viewport.mjs";
import {getJson, getPluginList, saveJson} from "./File System.mjs";

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
 * Loads the plugin window functionality.
 */
export async function initPluginSettings() {
    document.getElementById("pluginsRegion").addEventListener("click", () => {viewport.toPlugins()});
    document.getElementById("pluginsGoBack").addEventListener("click", () => {viewport.toCenter()});

    await loadPlugins();
}