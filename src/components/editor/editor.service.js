////////////////
// CONTROLLER //
////////////////

class EditorService {

  /*@ngInject*/
  constructor(EDITOR_TYPE, EDITOR_CONFIG, COMPONENTS_EDITOR_CONFIG, INSERT_PLUGIN_CONFIG) {
    this.EDITOR_TYPE = EDITOR_TYPE;
    this.EDITOR_CONFIG = EDITOR_CONFIG;
    this.COMPONENTS_EDITOR_CONFIG = COMPONENTS_EDITOR_CONFIG;
    this.INSERT_PLUGIN_CONFIG = INSERT_PLUGIN_CONFIG;
  }

  parseOptions(config) {
    // EDITOR_CONFIG is set for basic editor,
    // any modification can be override by config,
    // but some options are forced according to editor type
    let forcedOptions = {};

    if (config.type === this.EDITOR_TYPE.inline) {
      forcedOptions = {
        disableReturn: true,
        disableExtraSpaces: true,
        toolbar: false
      };
    }

    if (config.type === this.EDITOR_TYPE.components) {
      config = angular.extend({}, this.COMPONENTS_EDITOR_CONFIG, config);

      // make sure we have the default config
      // but allow to override it if you want to deactivate addons
      // by setting its value to false (e.g.: verbatim: false)
      config.insertPlugin = angular.extend({}, this.INSERT_PLUGIN_CONFIG, config.insertPlugin);
    }

    return angular.extend({}, this.EDITOR_CONFIG, config, forcedOptions);
  }

  toInnerText(value) {
    let tempEl = document.createElement('div');
    let text;

    tempEl.innerHTML = value;
    text = tempEl.textContent || '';

    return text.trim();
  }
}


////////////
// EXPORT //
////////////

export default EditorService;