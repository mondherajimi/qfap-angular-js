////////////
// IMPORT //
////////////



//////////////
// CONSTANT //
//////////////

export const AUTH_EVENTS = {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
};

export const USER_ACCESS = (() => {

  // les valeurs associées aux droits correspondent aux idRoles dans la table roles
  let userRoles = {
    user: 1,        // 00000001
    contributor: 2, // 00000010
    moderator: 4,   // 00000100
    redactor: 8,    // 00001000
    admin: 16,      // 00010000
  };

  return {
    // 00011111
    all: userRoles.user | userRoles.contributor | userRoles.moderator | userRoles.redactor | userRoles.admin,
    // 00011110
    contributor: userRoles.contributor | userRoles.moderator | userRoles.redactor | userRoles.admin,
    // 00011100
    moderator: userRoles.moderator | userRoles.redactor | userRoles.admin,
    // 00011000
    redactor: userRoles.redactor | userRoles.admin,
    // 00010000
    admin: userRoles.admin,

    userRoles: userRoles,
  };
})();


//////////////
// SERVICES //
//////////////

class AuthService {

  /*@ngInject*/
  constructor(Api) {
    this.Api = Api;
  }

  login(credentials) {
    return this.Api.post('/auth/login', credentials);
  }
}


////////////
// EXPORT //
////////////

// AUTH_EVENTS and USER_ACCESS are also exported
export default AuthService;
