////////////
// IMPORT //
////////////

import placesTemplate from './places.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function placesConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('places', {
      url: '/lieux',
      controller: 'PlacesController',
      controllerAs: 'places',
      template: placesTemplate,
      data: {
        access: USER_ACCESS.redactor
      }
    });
}


////////////
// EXPORT //
////////////

export default placesConfig;
