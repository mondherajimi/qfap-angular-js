const PLUGIN_NAMESPACE = 'plugin_';
const MEDIUM_NAMESPACE = 'mediumInsert';

import MediaLibraryService from '../../../media-library/mediaLibrary.service';

/**
 *  Generic medium editor insert plugin addon
 */
class Addon {

  constructor(element, name, options) {
    this.el = element;
    this.$el = $(element);

    this.name = name;

    this.core = this.$el.data(PLUGIN_NAMESPACE + MEDIUM_NAMESPACE);
    this.options = _.clone(options);
  }

  add() {
    this.$el.scope().$parent.cpntEditor.editComponent(this.name, this.$el);
  }
}

/**
 *  Media Library medium editor insert plugin addon
 */
class ImagePlugin {

  constructor(element, name, options, services) {
    this.el = element;
    this.$el = $(element);


    this.name = name;

    this.core = this.$el.data(PLUGIN_NAMESPACE + MEDIUM_NAMESPACE);
    this.options = _.clone(options);

    this.$filter = services.$filter;
    this.MediaLibrary = services.mediaLibrary;
  }

  add() {

    this.MediaLibrary
      .getMedia()
      .then((image) => {
        this.$el.scope().$parent.cpntEditor.insertCpnt(this.$el, {
          type:'image',
          data: {
            id: image.id,
            src: this.$filter('path')(image, 'Large'),
            alt: image.alt,
            size: 'Large',
            credit: image.credit,
            modifiers: image.modifiers
          }
        });
      });

  }
}


/////////////
// SERVICE //
/////////////

class InsertPluginService {

  /*@ngInject*/
  constructor($filter, INSERT_PLUGIN_CONFIG, MediaLibraryService) {
    this.INSERT_PLUGIN_CONFIG = INSERT_PLUGIN_CONFIG;

    this.services = {
      $filter: $filter,
      mediaLibrary: MediaLibraryService
    };
  }

  insertAddon(name, defaultOptions) {
    let addonName = name.charAt(0).toUpperCase() + name.slice(1);

    let services = this.services;

    $.fn[MEDIUM_NAMESPACE + addonName] = function(customOptions) {
      // allow to specify in customOptions only the parameters we change from default
      let options = angular.extend({}, defaultOptions, customOptions);

      return this.each(function() {
        if (!$.data(this, PLUGIN_NAMESPACE + MEDIUM_NAMESPACE + addonName)) {
          var addon;


          if (addonName === 'Image') {
            addon = new ImagePlugin(this, name, options, services);
          }
          // else if (addonName === 'Form') {
          //   addon = new FormPlugin(this, options);
          // }
          else {
            addon = new Addon(this, name, options);
          }

          $.data(this, PLUGIN_NAMESPACE + MEDIUM_NAMESPACE + addonName, addon);
        }
      });
    };
  }

  insertAll() {
    _.each(this.INSERT_PLUGIN_CONFIG, (value, key) => {
      if (!value) return;

      this.insertAddon(key, value);
    });
  }
}


////////////
// EXPORT //
////////////

export default InsertPluginService;
