import {stPath} from "../../GUI/Globals.mjs";
import {viewport} from "../../GUI/Viewport.mjs";

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
<div id="pBotButts">
  <button id="pluginGoBack" class="pInfoBotButt">
    <div class="pInfoIconCont">
      <load-svg src="SVGs/Close.svg" class="pInfoIcon"></load-svg>
    </div>
    <span>Go back</span>
  </button>
  <button id="pluginUpdate" class="pInfoBotButt">
    <div class="pInfoIconCont">
      <load-svg src="SVGs/Check.svg" class="pInfoIcon"></load-svg>
    </div>
    <span>Apply changes</span>
  </button>
</div>
</div>
`

document.getElementById('updateRegion').insertAdjacentHTML("afterend", pluginButtonHTML);

const uploadButtonCSSElement = document.createElement("style");
uploadButtonCSSElement.textContent = pluginButtonCSS;
document.head.appendChild(uploadButtonCSSElement);

document.getElementById("pluginsRegion").addEventListener("click", () => {viewport.toPlugins()})
