////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import placesConfig from './places.config';
import PlacesController from './places.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.places', [
    'ngTable'
  ])
  .config(placesConfig)
  .controller('PlacesController', PlacesController)
  .name;
