////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import disciplinesConfig from './disciplines.config';
import DisciplinesController from './disciplines.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.disciplines', [
    'ngTable'
  ])
  .config(disciplinesConfig)
  .controller('DisciplinesController', DisciplinesController)
  .name;
