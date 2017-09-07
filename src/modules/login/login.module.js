////////////
// IMPORT //
////////////

import loginConfig from './login.config';
import LoginController from './login.controller';

// import './login.scss';


////////////
// EXPORT //
////////////

export default angular.module('qfap.login', [])
  .config(loginConfig)
  .controller('LoginController', LoginController)
  .name;