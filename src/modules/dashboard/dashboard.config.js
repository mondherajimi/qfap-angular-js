////////////
// IMPORT //
////////////

import dashboardTemplate from './dashboard.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function dashboardConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('dashboard', {
      url: '/',
      controller: 'DashboardController',
      controllerAs: 'dashboard',
      template: dashboardTemplate,
      resolve: {
        pagesTypes: function(StaticData) {
          return StaticData.getPagesTypes();
        },
        pagesStatus: function(StaticData) {
          return StaticData.getPagesStatus();
        },
        groups: function(StaticData) {
          return StaticData.getGroups();
        }
      },
      data: {
        access: USER_ACCESS.all
      }
    });
}


////////////
// EXPORT //
////////////

export default dashboardConfig;