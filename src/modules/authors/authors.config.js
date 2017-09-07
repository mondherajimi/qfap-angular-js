////////////
// IMPORT //
////////////

import authorsTemplate from './authors.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function auhtorsConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('authors', {
      url: '/auteurs',
      controller: 'AuthorsController',
      controllerAs: 'authors',
      template: authorsTemplate,
      data: {
        access: USER_ACCESS.redactor
      }
    });
}


////////////
// EXPORT //
////////////

export default auhtorsConfig;
