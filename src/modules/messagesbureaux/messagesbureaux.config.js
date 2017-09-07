////////////
// IMPORT //
////////////

import messagesbureauxTemplate from './messagesbureaux.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function messagesbureauxConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('messagesbureaux', {
      url: '/messagesbureaux',
      controller: 'MessagesbureauxController',
      controllerAs: 'messagesbureaux',
      template: messagesbureauxTemplate,
      resolve: {
        groups: function(StaticData) {
          return StaticData.getGroups();
        }
      },
      data: {
        access: USER_ACCESS.redactor
      }
    });
}


////////////
// EXPORT //
////////////

export default messagesbureauxConfig;
