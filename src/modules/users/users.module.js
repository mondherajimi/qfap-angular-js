////////////
// IMPORT //
////////////

import 'ngTable';

import usersConfig from './users.config';
import UsersController from './users.controller';

// import './users.scss';


////////////
// EXPORT //
////////////

export default angular.module('qfap.users', [
    'ngTable'
  ])
  .config(usersConfig)
  .controller('UsersController', UsersController)
  .name;