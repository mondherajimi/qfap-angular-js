/////////
// RUN //
/////////

/*@ngInject*/
function appRun($rootScope, $anchorScroll, ENV, toastr, AUTH_EVENTS, UserService) {

  // $anchorScroll yOffset because the navbar being fixed
  $anchorScroll.yOffset = 120;

  // $stateChangeStart
  $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState, toParams, fromState, fromParams) {
    // Basic history
    $rootScope.previousState = fromState.name;

    // Check authorizations
    var access = toState.data ? toState.data.access : undefined;
    if (access && !UserService.hasAccess(access)) {
      event.preventDefault();
      if (UserService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, fromState, toState);
      }
      else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });

  // $stateChangeSuccess
  $rootScope.$on('$stateChangeSuccess', function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
    // clear UserService
    if (toState.name === 'login') {
      UserService.destroy();
    }
  });

  // $httpError
  $rootScope.$on('$httpError', function httpError(event, eventData) {
    let message = eventData.message;

    toastr.error(message);

    // console log error when not in production
    if (ENV.environment !== "production")
      console.error(eventData);
  });
}


////////////
// EXPORT //
////////////

export default appRun;