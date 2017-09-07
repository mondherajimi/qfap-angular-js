////////////
// IMPORT //
////////////

import appTemplate from './app.html';


////////////////
// CONTROLLER //
////////////////

class AppController {

  /*@ngInject*/
  constructor($scope, $http, $state, AUTH_EVENTS, Api, UserService, toastr) {
    this.$http = $http;
    this.$state = $state;

    this.currentUser = UserService;

    if (!UserService.isAuthenticated()) {
      this.disconnect();
    }

    // redirect if not authenticated
    $scope.$on(AUTH_EVENTS.notAuthenticated, () => this.disconnect());
    // logged out successfully
    $scope.$on(AUTH_EVENTS.logoutSuccess, () => this.disconnect());

    // logged in successfully
    $scope.$on(AUTH_EVENTS.loginSuccess, (e, data) => {
      UserService.store(data);

      $state.go('dashboard');
    });

    // TODO redirect on 404
    // goto dashboard if authentified and login else

    // pop up if non authorized
    $scope.$on(AUTH_EVENTS.notAuthorized, (e, fromState, toState) => {
      var message = "Vous n'avez pas les droits d'accès à cette page.";
      if (toState.url)
        message += "(" + toState.url + ")";

      toastr.error(message, {
        closeButton: true,
        timeOut: 0
      });

      $state.go(fromState.name || 'dashboard');
    });
  }

  disconnect() {
    this.$state.go('login');
  }
}


////////////
// EXPORT //
////////////

export default {
  template: appTemplate,
  controller: AppController,
  controllerAs: 'app'
};