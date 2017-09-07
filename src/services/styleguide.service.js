////////////
// IMPORT //
////////////

import StyleguideTemplates from 'styleguideTemplates';

//////////////
// SERVICES //
//////////////

class StyleguideService {

  /*@ngInject*/
  constructor($log) {
    this.$log = $log;
    this.templates = StyleguideTemplates;
  }

  component(type) {
    let name = 'component-'+type;

    if (!(_.has(this.templates, type) && _.has(this.templates[type], name))) {
      this.$log.error(new Error('StyleguideService: unknow '+ type + ' component'));
      // this stops the script
      // throw new Error('StyleguideService: unknow '+ type + ' component');
      return;
    }

    return this.templates[type][name];
  }
}


////////////
// EXPORT //
////////////

export default StyleguideService;
