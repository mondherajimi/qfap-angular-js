////////////
// IMPORT //
////////////

import uiBootstrap from 'uiBootstrap';
//import fichesConfig from './fiches.config';
import FichesController from './fiches.controller';
import 'algoliasearch';

////////////
// EXPORT //
////////////

export default angular.module('qfap.fiches', [
    uiBootstrap,
    'algoliasearch'
  ])
  //.config(fichesConfig)
  .controller('FichesController', FichesController)
  .name;