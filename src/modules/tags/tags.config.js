////////////
// IMPORT //
////////////

import tagsTemplate from './tags.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function tagsConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('tags', {
      url: '/tags',
      controller: 'TagsController',
      controllerAs: 'tags',
      template: tagsTemplate,
      data: {
        access: USER_ACCESS.admin
      }
    });
}


////////////
// EXPORT //
////////////

export default tagsConfig;
