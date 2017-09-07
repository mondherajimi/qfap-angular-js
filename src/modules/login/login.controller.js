////////////////
// CONTROLLER //
////////////////

class LoginController {

  /*@ngInject*/
  constructor($rootScope, AUTH_EVENTS, AuthService) {
    this.$rootScope = $rootScope;
    this.AUTH_EVENTS = AUTH_EVENTS;
    this.AuthService = AuthService;
  }

  doLogin(credentials) {
    this.AuthService
      .login(credentials)
      .then(
        (success) => {
          this.$rootScope.$broadcast(this.AUTH_EVENTS.loginSuccess, success.data);
        });
  }

  forgotPwd() {
    let domain = window.location.hostname.split('.').slice(-2).join('.');

    // hack to make it work on local environment...
    if (domain === 'localhost') { domain = 'lestudio.mx'; }

    window.open(
        'https://accounts.'+domain+'/account/send_password?returnUrl=escalade.'+domain+'&pop=1'
      , '_blank'
      , 'width=350,height=375,scrollbars=no,status=yes,resizable=no'
    );
  }
}


////////////
// EXPORT //
////////////

export default LoginController;
