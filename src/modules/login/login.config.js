////////////
// IMPORT //
////////////

import loginTemplate from './login.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function loginConfig($stateProvider) {

  $stateProvider
    .state('login', {
      url: '/identification',
      controller: 'LoginController',
      controllerAs: 'login',
      template: loginTemplate
    });
}


////////////
// EXPORT //
////////////

export default loginConfig;
