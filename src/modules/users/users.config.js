////////////
// IMPORT //
////////////

import usersTemplate from './users.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function usersConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('users', {
      url: '/utilisateurs',
      controller: 'UsersController',
      controllerAs: 'users',
      template: usersTemplate,
      resolve: {
        roles: function(StaticData) {
          return StaticData.getRoles();
        },
        groups: function(StaticData) {
          return StaticData.getGroups();
        }
      },
      data: {
        access: USER_ACCESS.moderator
      }
    });
}


////////////
// EXPORT //
////////////

export default usersConfig;