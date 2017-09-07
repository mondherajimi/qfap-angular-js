////////////
// IMPORT //
////////////

import '../../directives/addRow/ngTableAddRow.loader';

import authorsConfig from './authors.config';
import AuthorsController from './authors.controller';


////////////
// EXPORT //
////////////

export default angular.module('qfap.authors', [
    'ngTable'
  ])
  .config(authorsConfig)
  .controller('AuthorsController', AuthorsController)
  .name;
