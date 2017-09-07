////////////
// IMPORT //
////////////

import messagesmoderationTemplate from './messagesmoderation.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function messagesmoderationConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('messagesmoderation', {
      url: '/messagesmoderation',
      controller: 'MessagesmoderationController',
      controllerAs: 'messagesmoderation',
      template: messagesmoderationTemplate,
      data: {
        access: USER_ACCESS.redactor
      }
    });
}


////////////
// EXPORT //
////////////

export default messagesmoderationConfig;
