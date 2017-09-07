////////////
// IMPORT //
////////////

import disciplinesTemplate from './disciplines.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function disciplinesConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('disciplines', {
      url: '/disciplines',
      controller: 'DisciplinesController',
      controllerAs: 'disciplines',
      template: disciplinesTemplate,
      data: {
        access: USER_ACCESS.admin
      }
    });
}


////////////
// EXPORT //
////////////

export default disciplinesConfig;
