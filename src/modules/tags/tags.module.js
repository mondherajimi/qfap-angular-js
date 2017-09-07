////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import tagsConfig from './tags.config';
import TagsController from './tags.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.tags', [
    'ngTable'
  ])
  .config(tagsConfig)
  .controller('TagsController', TagsController)
  .name;
