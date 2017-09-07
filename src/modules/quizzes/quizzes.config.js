////////////
// IMPORT //
////////////

import quizzesTemplate from './quizzes.html';


////////////
// CONFIG //
////////////

/*@ngInject*/
function quizzesConfig($stateProvider, USER_ACCESS) {

  $stateProvider
    .state('quizzes', {
      url: '/questionnaires',
      controller: 'QuizzesController',
      controllerAs: 'quizzes',
      template: quizzesTemplate,
      data: {
        access: USER_ACCESS.moderator
      }
    });
}


////////////
// EXPORT //
////////////

export default quizzesConfig;